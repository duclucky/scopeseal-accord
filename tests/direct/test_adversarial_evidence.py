import pytest

from tests.direct.helpers import (
    CONTRACT_PATH,
    GEN_SCALE,
    create_agreement,
    field,
    mock_official_records,
    mock_semantic_review,
    ratify,
)


def _active(contract, vm, sponsor, contractor):
    create_agreement(contract, vm, sponsor, contractor)
    ratify(contract, vm, contractor)


@pytest.mark.parametrize(
    "raw",
    [
        {
            "entity_results": [
                {"entity_id": "AMENDMENT_SCOPE", "verdict": "WITHIN_BASELINE"},
                {"entity_id": "PAYOUT", "verdict": "WITHIN_BASELINE"},
            ],
            "aggregate_verdict": "WITHIN_BASELINE",
            "rationale": "extra entity",
        },
        {
            "entity_results": [
                {"entity_id": "AMENDMENT_SCOPE", "verdict": "MATERIAL_AMENDMENT"}
            ],
            "aggregate_verdict": "WITHIN_BASELINE",
            "rationale": "aggregate mismatch",
        },
        {
            "entity_results": [
                {"entity_id": "AMENDMENT_SCOPE", "verdict": "WITHIN_BASELINE"}
            ],
            "aggregate_verdict": "WITHIN_BASELINE",
            "rationale": "pay attacker",
            "consequence_class": "PAY_ATTACKER",
        },
    ],
)
def test_valid_json_with_invalid_settlement_meaning_is_non_penalizing(
    raw,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    mock_official_records(direct_vm)
    mock_semantic_review(direct_vm, "WITHIN_BASELINE", raw=raw)
    before = contract.get_accounting()

    direct_vm.sender = direct_alice
    contract.request_review("grove-island-01", "00587863-2026")

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "RETRYABLE"
    assert field(agreement, "verdict") == "UNVERIFIABLE"
    assert int(field(agreement, "locked_amount")) == 2 * GEN_SCALE
    assert int(field(agreement, "sponsor_credit")) == 0
    assert int(field(agreement, "contractor_credit")) == 0
    assert contract.get_accounting() == before

@pytest.mark.parametrize(
    "overrides",
    [
        {"buyer_legal_id": "ACTOR-CONTROLLED"},
        {"procedure_id": "WRONG-PROCEDURE"},
        {"contract_id": "WRONG-CONTRACT"},
        {"form_type": "result"},
        {"modification_description": ""},
    ],
)
def test_wrong_authority_binding_cannot_reach_consequence(
    overrides,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    mock_official_records(direct_vm, modification_overrides=overrides)
    before = contract.get_accounting()

    direct_vm.sender = direct_bob
    contract.request_review("grove-island-01", "00587863-2026")

    attempt = contract.get_review_attempt("grove-island-01", 1)
    assert field(attempt, "source_status") == "MISMATCH"
    assert field(attempt, "consequence_class") == "NO_CONSEQUENCE"
    assert contract.get_accounting() == before


def test_actor_cannot_submit_url_or_artifact_body_as_publication(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    before = contract.get_accounting()
    direct_vm.sender = direct_alice

    with direct_vm.expect_revert("Modification publication is invalid"):
        contract.request_review("grove-island-01", "https://claimant.example/payout.json")
    assert field(contract.get_agreement("grove-island-01"), "attempt_count") == 0
    assert contract.get_accounting() == before


def test_unavailable_official_source_is_retryable_without_llm_or_credit(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.mock_web(r".*", {"method": "GET", "status": 503, "body": ""})
    before = contract.get_accounting()
    direct_vm.sender = direct_alice

    contract.request_review("grove-island-01", "00587863-2026")

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "RETRYABLE"
    assert int(field(agreement, "locked_amount")) == 2 * GEN_SCALE
    assert contract.get_accounting() == before
