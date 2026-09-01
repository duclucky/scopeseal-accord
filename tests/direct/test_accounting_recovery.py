from tests.direct.helpers import (
    CONTRACT_PATH,
    RATIFY_DEADLINE,
    REVIEW_DEADLINE,
    create_agreement,
    field,
    mock_official_records,
    mock_semantic_review,
    ratify,
)


def test_sponsor_recovers_unratified_agreement_at_deadline_and_withdraws_once(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp(RATIFY_DEADLINE)

    contract.recover_expired("grove-island-01")
    recovered = contract.get_agreement("grove-island-01")
    assert field(recovered, "state") == "SETTLED"
    assert field(recovered, "verdict") == "EXPIRED_RECOVERY"
    assert int(contract.get_credit_gen("grove-island-01", direct_alice)) == 2

    contract.withdraw_credit("grove-island-01")
    closed = contract.get_agreement("grove-island-01")
    assert field(closed, "state") == "CLOSED"
    assert int(contract.get_credit_gen("grove-island-01", direct_alice)) == 0
    accounting = contract.get_accounting()
    assert int(field(accounting, "received_gen")) == 2
    assert int(field(accounting, "locked_gen")) == 0
    assert int(field(accounting, "credited_gen")) == 0
    assert int(field(accounting, "withdrawn_gen")) == 2

    with direct_vm.expect_revert("Agreement is not settled"):
        contract.withdraw_credit("grove-island-01")


def test_recovery_enforces_sponsor_state_and_state_specific_expiry(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)

    direct_vm.sender = direct_charlie
    direct_vm.warp(RATIFY_DEADLINE)
    with direct_vm.expect_revert("Only sponsor can recover"):
        contract.recover_expired("grove-island-01")

    direct_vm.sender = direct_alice
    direct_vm.warp("2026-09-01T00:09:59Z")
    with direct_vm.expect_revert("Agreement has not expired"):
        contract.recover_expired("grove-island-01")

    direct_vm.warp("2026-09-01T00:05:00Z")
    ratify(contract, direct_vm, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp("2026-09-01T00:59:59Z")
    with direct_vm.expect_revert("Agreement has not expired"):
        contract.recover_expired("grove-island-01")
    direct_vm.warp(REVIEW_DEADLINE)
    contract.recover_expired("grove-island-01")
    assert int(contract.get_credit_gen("grove-island-01", direct_alice)) == 2


def test_two_party_credits_close_only_after_both_withdraw(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    ratify(contract, direct_vm, direct_bob)
    mock_official_records(direct_vm)
    mock_semantic_review(direct_vm, "MATERIAL_AMENDMENT")
    direct_vm.sender = direct_alice
    contract.request_review("grove-island-01", "00587863-2026")
    contract.propose_split("grove-island-01", 1)
    direct_vm.sender = direct_bob
    contract.accept_split("grove-island-01", 1)

    contract.withdraw_credit("grove-island-01")
    assert field(contract.get_agreement("grove-island-01"), "state") == "SETTLED"
    direct_vm.sender = direct_alice
    contract.withdraw_credit("grove-island-01")
    assert field(contract.get_agreement("grove-island-01"), "state") == "CLOSED"
