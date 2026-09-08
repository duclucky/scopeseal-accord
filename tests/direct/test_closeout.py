import json

from tests.direct.conftest import to_hex
from tests.direct.helpers import (
    CONTRACT_PATH,
    GEN_SCALE,
    create_agreement,
    field,
    mock_official_records,
    mock_semantic_review,
    ratify,
)


RATIFY = "2026-09-01T02:00:00Z"
REVIEW = "2026-09-01T03:00:00Z"


def _closed(contract, vm, sponsor, contractor):
    vm.sender = sponsor
    vm.value = 2 * GEN_SCALE
    vm.warp("2026-09-01T00:00:00Z")
    contract.create_agreement(
        "grove-island-01", contractor, "00547772-2025",
        "58fb29a0-a611-464c-bed0-fe29401479e3", "01", "6912131539",
        "d9f4bc69-ef7d-42f6-ad8f-802fd332b0a6", "3/PNO/2025",
        "Complete the awarded single-lot procurement according to the signed public contract.",
        "Permit only changes that preserve the awarded procurement objective and single-lot identity.",
        "2026-09-01T00:10:00Z", "2026-09-01T01:00:00Z", 3600,
    )
    current = vm._balances.get(bytes(vm._contract_address), 0)
    vm.deal(vm._contract_address, current + 2 * GEN_SCALE)
    vm.value = 0
    vm.warp("2026-09-01T00:10:00Z")
    contract.recover_expired("grove-island-01")
    contract.withdraw_credit("grove-island-01")


def _open(contract, vm, sponsor):
    vm.sender = sponsor
    vm.value = GEN_SCALE
    vm.warp("2026-09-01T01:10:00Z")
    contract.open_closeout(
        "grove-island-01",
        "LOT-0001",
        "Release retention when the official completion notice confirms final payment and no penalty.",
        RATIFY,
        REVIEW,
        3600,
    )
    current = vm._balances.get(bytes(vm._contract_address), 0)
    vm.deal(vm._contract_address, current + GEN_SCALE)
    vm.value = 0


def _completion_body(**overrides):
    values = {
        "publication": "00734925-2025",
        "notice_uuid": "e51ffa34-b755-4d6d-83e9-5e51448bffb1",
        "notice_version": "01",
        "form_type": "completion",
        "notice_type": "compl",
        "previous_publication": "00547772-2025",
        "buyer_legal_id": "6912131539",
        "procedure_id": "d9f4bc69-ef7d-42f6-ad8f-802fd332b0a6",
        "contract_id": "3/PNO/2025",
        "lot_id": "LOT-0001",
        "payment_amount": "544332",
        "payment_currency": "PLN",
        "penalty_amount": "0",
        "penalty_currency": "PLN",
        "explanation": "Payment follows the signed contract and accepted offer.",
    }
    values.update(overrides)
    row = {key: {"type": "literal", "value": value} for key, value in values.items()}
    return json.dumps({"results": {"bindings": [row]}})


def _mock_completion(vm, **overrides):
    vm.mock_web(
        r".*00734925-2025.*",
        {"method": "GET", "status": 200, "body": _completion_body(**overrides)},
    )


def _mock_closeout_semantics(vm, verdict):
    vm.mock_llm(
        r"(?s).*ScopeSeal Accord completion closeout reviewer.*",
        json.dumps({
            "entity_results": [{"entity_id": "COMPLETION", "verdict": verdict}],
            "aggregate_verdict": verdict,
            "rationale": "The authenticated completion record satisfies the locked release standard.",
        }),
    )


def _active_closeout(contract, vm, sponsor, contractor):
    _closed(contract, vm, sponsor, contractor)
    _open(contract, vm, sponsor)
    vm.sender = contractor
    contract.ratify_closeout("grove-island-01")


def test_clean_completion_releases_exactly_one_gen(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT_PATH)
    _active_closeout(contract, direct_vm, direct_alice, direct_bob)
    _mock_completion(direct_vm)
    _mock_closeout_semantics(direct_vm, "RELEASE_RETENTION")
    direct_vm.sender = direct_bob
    contract.request_closeout_review("grove-island-01", "00734925-2025")
    closeout = contract.get_closeout("grove-island-01")
    attempt = contract.get_closeout_attempt("grove-island-01", 1)
    assert field(closeout, "state") == "SETTLED", repr(attempt)
    assert field(closeout, "verdict") == "RELEASE_RETENTION"
    assert int(field(closeout, "locked_amount")) == 0
    assert int(contract.get_closeout_credit_gen("grove-island-01", to_hex(direct_bob))) == 1
    assert field(attempt, "consequence_class") == "CREDIT_CONTRACTOR"


def test_authority_mismatch_is_retryable_and_non_penalizing(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT_PATH)
    _active_closeout(contract, direct_vm, direct_alice, direct_bob)
    _mock_completion(direct_vm, lot_id="LOT-FORGED")
    direct_vm.sender = direct_alice
    contract.request_closeout_review("grove-island-01", "00734925-2025")
    closeout = contract.get_closeout("grove-island-01")
    assert field(closeout, "state") == "RETRYABLE"
    assert int(field(closeout, "locked_amount")) == GEN_SCALE
    assert int(field(closeout, "sponsor_credit")) == 0
    assert int(field(closeout, "contractor_credit")) == 0


def test_negotiated_closeout_conserves_one_gen_and_withdraws_once(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT_PATH)
    _active_closeout(contract, direct_vm, direct_alice, direct_bob)
    _mock_completion(direct_vm)
    _mock_closeout_semantics(direct_vm, "NEGOTIATE_RETENTION")
    direct_vm.sender = direct_alice
    contract.request_closeout_review("grove-island-01", "00734925-2025")
    contract.propose_closeout_split("grove-island-01", 1)
    direct_vm.sender = direct_bob
    contract.accept_closeout_split("grove-island-01", 1)
    assert int(contract.get_closeout_credit_gen("grove-island-01", direct_bob)) == 1
    contract.withdraw_closeout_credit("grove-island-01")
    assert field(contract.get_closeout("grove-island-01"), "state") == "CLOSED"
    with direct_vm.expect_revert("Closeout is not settled"):
        contract.withdraw_closeout_credit("grove-island-01")


def test_open_requires_closed_agreement_exact_value_and_unique_key(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.value = GEN_SCALE
    with direct_vm.expect_revert("Agreement must be closed"):
        contract.open_closeout("grove-island-01", "LOT-0001", "A sufficiently bounded completion retention standard for testing.", RATIFY, REVIEW, 3600)
    direct_vm.value = 0
    direct_vm.warp("2026-09-01T00:10:00Z")
    contract.recover_expired("grove-island-01")
    contract.withdraw_credit("grove-island-01")
    direct_vm.value = 0
    with direct_vm.expect_revert("Closeout requires exactly 1 GEN"):
        contract.open_closeout("grove-island-01", "LOT-0001", "A sufficiently bounded completion retention standard for testing.", RATIFY, REVIEW, 3600)
    _open(contract, direct_vm, direct_alice)
    direct_vm.value = GEN_SCALE
    with direct_vm.expect_revert("Closeout already exists"):
        contract.open_closeout("grove-island-01", "LOT-0001", "A sufficiently bounded completion retention standard for testing.", RATIFY, REVIEW, 3600)


def test_closeout_temporal_boundaries_and_recovery(direct_vm, direct_deploy, direct_alice, direct_bob):
    contract = direct_deploy(CONTRACT_PATH)
    _closed(contract, direct_vm, direct_alice, direct_bob)
    _open(contract, direct_vm, direct_alice)
    direct_vm.sender = direct_bob
    direct_vm.warp(RATIFY)
    with direct_vm.expect_revert("Closeout ratification deadline has passed"):
        contract.ratify_closeout("grove-island-01")
    direct_vm.sender = direct_alice
    contract.recover_closeout("grove-island-01")
    assert int(contract.get_closeout_credit_gen("grove-island-01", direct_alice)) == 1
