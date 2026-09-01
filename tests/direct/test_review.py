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


def _active(contract, vm, sponsor, contractor):
    create_agreement(contract, vm, sponsor, contractor)
    ratify(contract, vm, contractor)


def test_complete_within_baseline_review_opens_two_gen_contractor_credit(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    mock_official_records(direct_vm)
    mock_semantic_review(direct_vm, "WITHIN_BASELINE")

    direct_vm.sender = direct_bob
    contract.request_review("grove-island-01", "00587863-2026")

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "SETTLED"
    assert field(agreement, "verdict") == "WITHIN_BASELINE"
    assert field(agreement, "modification_publication") == "00587863-2026"
    assert int(field(agreement, "locked_amount")) == 0
    assert int(field(agreement, "contractor_credit")) == 2 * GEN_SCALE
    assert int(contract.get_credit_gen("grove-island-01", to_hex(direct_bob))) == 2
    accounting = contract.get_accounting()
    assert int(field(accounting, "locked_gen")) == 0
    assert int(field(accounting, "credited_gen")) == 2

    attempt = contract.get_review_attempt("grove-island-01", 1)
    assert field(attempt, "source_status") == "COMPLETE"
    assert field(attempt, "source_coverage") == "COMPLETE"
    assert field(attempt, "entity_id") == "AMENDMENT_SCOPE"
    assert field(attempt, "aggregate_verdict") == "WITHIN_BASELINE"
    assert field(attempt, "consequence_class") == "CREDIT_CONTRACTOR"


def test_complete_material_review_opens_negotiation_without_moving_gen(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    mock_official_records(direct_vm)
    mock_semantic_review(direct_vm, "MATERIAL_AMENDMENT")

    direct_vm.sender = direct_alice
    contract.request_review("grove-island-01", "00587863-2026")

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "NEGOTIATION"
    assert field(agreement, "verdict") == "MATERIAL_AMENDMENT"
    assert int(field(agreement, "locked_amount")) == 2 * GEN_SCALE
    assert int(field(agreement, "sponsor_credit")) == 0
    assert int(field(agreement, "contractor_credit")) == 0
    assert field(agreement, "negotiation_started_at") != ""
    assert field(agreement, "negotiation_deadline") != ""
    accounting = contract.get_accounting()
    assert int(field(accounting, "locked_gen")) == 2
    assert int(field(accounting, "credited_gen")) == 0


def test_wrong_previous_notice_is_retryable_and_cannot_switch_publication(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _active(contract, direct_vm, direct_alice, direct_bob)
    mock_official_records(direct_vm, previous_binding="forged-uuid-01")

    direct_vm.sender = direct_alice
    contract.request_review("grove-island-01", "00587863-2026")

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "RETRYABLE"
    assert field(agreement, "verdict") == "UNVERIFIABLE"
    assert field(agreement, "modification_publication") == "00587863-2026"
    assert int(field(agreement, "locked_amount")) == 2 * GEN_SCALE
    assert int(field(agreement, "sponsor_credit")) == 0
    assert int(field(agreement, "contractor_credit")) == 0
    attempt = contract.get_review_attempt("grove-island-01", 1)
    assert field(attempt, "source_status") == "MISMATCH"
    assert field(attempt, "consequence_class") == "NO_CONSEQUENCE"

    before = contract.get_accounting()
    with direct_vm.expect_revert("Modification publication is already locked"):
        contract.request_review("grove-island-01", "00590574-2026")
    assert contract.get_accounting() == before
