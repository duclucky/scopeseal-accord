import ast
from pathlib import Path

import pytest


CONTRACT_PATH = Path(__file__).parents[2] / "contracts" / "scopeseal_accord.py"
DEPENDS_LINE = '# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }'
WRITE_METHODS = {
    "create_agreement",
    "ratify_agreement",
    "request_review",
    "propose_split",
    "accept_split",
    "recover_expired",
    "withdraw_credit",
    "open_closeout",
    "ratify_closeout",
    "request_closeout_review",
    "propose_closeout_split",
    "accept_closeout_split",
    "recover_closeout",
    "withdraw_closeout_credit",
}
VIEW_METHODS = {
    "get_agreement",
    "get_review_attempt",
    "get_account_agreement_ids",
    "get_credit_gen",
    "get_accounting",
    "get_closeout",
    "get_closeout_attempt",
    "get_closeout_credit_gen",
}


@pytest.fixture(scope="module")
def source_bytes() -> bytes:
    assert CONTRACT_PATH.is_file(), f"missing contract: {CONTRACT_PATH}"
    return CONTRACT_PATH.read_bytes()


@pytest.fixture(scope="module")
def source(source_bytes: bytes) -> str:
    return source_bytes.decode("ascii")


@pytest.fixture(scope="module")
def module(source: str) -> ast.Module:
    return ast.parse(source)


def _decorator_name(node: ast.expr) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        return _decorator_name(node.value) + "." + node.attr
    return ""


def _method_decorators(module: ast.Module) -> dict[str, set[str]]:
    result: dict[str, set[str]] = {}
    for node in ast.walk(module):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            result[node.name] = {_decorator_name(item) for item in node.decorator_list}
    return result


def test_contract_is_ascii_and_has_current_header(source_bytes: bytes, source: str) -> None:
    assert source_bytes.decode("ascii") == source
    meaningful = [line for line in source.splitlines() if line.strip()]
    assert meaningful[0] == "# v0.3.0"
    assert meaningful[1] == DEPENDS_LINE
    assert meaningful[2] == "import genlayer as gl"


def test_contract_has_exactly_one_project_contract_class(module: ast.Module) -> None:
    contract_classes = []
    for node in module.body:
        if not isinstance(node, ast.ClassDef):
            continue
        bases = {_decorator_name(base) for base in node.bases}
        if "gl.contract.Contract" in bases:
            contract_classes.append(node.name)
    assert contract_classes == ["ScopeSealAccord"]


def test_public_api_matches_locked_specification(module: ast.Module) -> None:
    decorators = _method_decorators(module)
    writes = {
        name
        for name, names in decorators.items()
        if "gl.public.write" in names or "gl.public.write.payable" in names
    }
    views = {name for name, names in decorators.items() if "gl.public.view" in names}
    assert writes == WRITE_METHODS
    assert views == VIEW_METHODS
    assert "gl.public.write.payable" in decorators["create_agreement"]
    assert "gl.public.write.payable" in decorators["open_closeout"]
    assert all(
        "gl.public.write.payable" not in decorators[name]
        for name in WRITE_METHODS - {"create_agreement", "open_closeout"}
    )


def test_collections_are_not_reassigned_and_maps_are_string_keyed(module: ast.Module) -> None:
    annotations = [
        ast.unparse(node.annotation)
        for node in ast.walk(module)
        if isinstance(node, ast.AnnAssign)
    ]
    assert any(text.startswith("TreeMap[str,") for text in annotations)
    assert all(
        not text.startswith("TreeMap[") or text.startswith("TreeMap[str,")
        for text in annotations
    )

    init_methods = [
        node
        for node in ast.walk(module)
        if isinstance(node, ast.FunctionDef) and node.name == "__init__"
    ]
    for method in init_methods:
        for node in ast.walk(method):
            if isinstance(node, ast.Call) and _decorator_name(node.func) in {"TreeMap", "DynArray"}:
                pytest.fail("collection storage must not be constructed in __init__")


def test_consensus_and_value_primitives_are_present(source: str) -> None:
    assert "gl.vm.run_nondet_default(" in source
    assert "gl.vm.run_nondet(" not in source
    assert "run_nondet_unsafe" not in source
    assert "GEN_SCALE" in source
    assert "gl.message.value" in source
    assert "emit_transfer(value=" in source
    assert "credit debited before transfer" in source


def test_eoa_withdrawals_use_external_chain_interface(module: ast.Module) -> None:
    interfaces = [
        node for node in module.body
        if isinstance(node, ast.ClassDef)
        and "gl.evm.contract_interface" in {_decorator_name(item) for item in node.decorator_list}
    ]
    assert [node.name for node in interfaces] == ["_Recipient"]
    transfers = [
        node for node in ast.walk(module)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "emit_transfer"
    ]
    assert len(transfers) == 2
    assert all(
        isinstance(node.func.value, ast.Call)
        and _decorator_name(node.func.value.func) == "_Recipient"
        for node in transfers
    )


def test_official_queries_are_bounded_to_the_publication_graph(source: str) -> None:
    assert "def _publication_graph(publication: str) -> str:" in source
    assert source.count('"GRAPH <" + _publication_graph(publication) + "> {') == 3
    assert "GRAPH ?g" not in source
    assert "?contract a epo:Contract" in source
    assert "epo:SettledContract" not in source


def test_semantic_prompt_states_the_exact_settlement_row_schema(module: ast.Module) -> None:
    string_literals = "\n".join(
        node.value
        for node in ast.walk(module)
        if isinstance(node, ast.Constant) and isinstance(node.value, str)
    )
    assert 'ENTITY_RESULTS_SCHEMA=[{"entity_id":"AMENDMENT_SCOPE","verdict":"WITHIN_BASELINE|MATERIAL_AMENDMENT"}]' in string_literals
    assert "AGGREGATE_VERDICT must exactly equal the single entity verdict." in string_literals
    assert 'ENTITY_RESULTS_SCHEMA=[{"entity_id":"COMPLETION","verdict":"RELEASE_RETENTION|NEGOTIATE_RETENTION"}]' in string_literals
