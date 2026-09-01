import ast
from pathlib import Path

import pytest


CONTRACT_PATH = Path(__file__).parents[2] / "contracts" / "scopeseal_accord.py"
DEPENDS_LINE = '# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }'
WRITE_METHODS = {
    "create_agreement",
    "ratify_agreement",
    "request_review",
    "propose_split",
    "accept_split",
    "recover_expired",
    "withdraw_credit",
}
VIEW_METHODS = {
    "get_agreement",
    "get_review_attempt",
    "get_account_agreement_ids",
    "get_credit_gen",
    "get_accounting",
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
    assert meaningful[0] == DEPENDS_LINE
    assert meaningful[1] == "from genlayer import *"


def test_contract_has_exactly_one_project_contract_class(module: ast.Module) -> None:
    contract_classes = []
    for node in module.body:
        if not isinstance(node, ast.ClassDef):
            continue
        bases = {_decorator_name(base) for base in node.bases}
        if "gl.Contract" in bases:
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
    assert all(
        "gl.public.write.payable" not in decorators[name]
        for name in WRITE_METHODS - {"create_agreement"}
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
    assert "gl.vm.run_nondet(" in source
    assert "run_nondet_unsafe" not in source
    assert "GEN_SCALE" in source


def test_official_queries_are_bounded_to_the_publication_graph(source: str) -> None:
    assert "def _publication_graph(publication: str) -> str:" in source
    assert source.count('"GRAPH <" + _publication_graph(publication) + "> {') == 2
    assert "GRAPH ?g" not in source
    assert "?contract a epo:Contract" in source
    assert "epo:SettledContract" not in source
    assert "gl.message.value" in source
    assert "emit_transfer(value=" in source
    assert "credit debited before transfer" in source
