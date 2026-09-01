from tests.direct.conftest import to_hex
from tests.direct.helpers import (
    CONTRACT_PATH,
    GEN_SCALE,
    RATIFY_DEADLINE,
    REVIEW_DEADLINE,
    assert_parties,
    create_agreement,
    field,
    ratify,
)


def test_create_agreement_locks_exact_terms_and_two_gen(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)

    agreement = contract.get_agreement("grove-island-01")
    assert field(agreement, "state") == "DRAFT"
    assert_parties(agreement, direct_alice, direct_bob)
    assert field(agreement, "original_publication") == "00190662-2025"
    assert field(agreement, "original_notice_uuid") == "6480e4d5-6f07-4b83-8097-5756d8fbf527"
    assert field(agreement, "original_notice_version") == "01"
    assert field(agreement, "buyer_legal_id") == "3267368TH"
    assert field(agreement, "procedure_id") == "7f56490a-c5ba-4922-853b-07b18b0d14c1"
    assert field(agreement, "contract_id") == "417379"
    assert field(agreement, "ratify_deadline") == RATIFY_DEADLINE
    assert field(agreement, "review_deadline") == REVIEW_DEADLINE
    assert int(field(agreement, "locked_amount")) == 2 * GEN_SCALE
    assert int(contract.get_credit_gen("grove-island-01", to_hex(direct_alice))) == 0
    assert int(contract.get_credit_gen("grove-island-01", to_hex(direct_bob))) == 0
    accounting = contract.get_accounting()
    assert int(field(accounting, "received_gen")) == 2
    assert int(field(accounting, "locked_gen")) == 2
    assert int(field(accounting, "credited_gen")) == 0
    assert int(field(accounting, "withdrawn_gen")) == 0


def test_create_rejects_wrong_value_and_duplicate_without_accounting_change(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.sender = direct_alice
    direct_vm.value = GEN_SCALE
    direct_vm.warp("2026-09-01T00:00:00Z")

    with direct_vm.expect_revert("Creation requires exactly 2 GEN"):
        contract.create_agreement(
            "grove-island-01",
            direct_bob,
            "00190662-2025",
            "6480e4d5-6f07-4b83-8097-5756d8fbf527",
            "01",
            "3267368TH",
            "7f56490a-c5ba-4922-853b-07b18b0d14c1",
            "417379",
            "Upgrade Grove Island Leisure Centre while preserving the awarded facility objective.",
            "Allow restoration, safety, and critical infrastructure substitutions tied to the same facility.",
            RATIFY_DEADLINE,
            REVIEW_DEADLINE,
            3600,
        )
    assert int(field(contract.get_accounting(), "received_gen")) == 0

    direct_vm.value = 0
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    before = contract.get_accounting()
    direct_vm.sender = direct_alice
    direct_vm.value = 2 * GEN_SCALE
    with direct_vm.expect_revert("Agreement already exists"):
        contract.create_agreement(
            "grove-island-01",
            direct_bob,
            "00190662-2025",
            "6480e4d5-6f07-4b83-8097-5756d8fbf527",
            "01",
            "3267368TH",
            "7f56490a-c5ba-4922-853b-07b18b0d14c1",
            "417379",
            "Upgrade Grove Island Leisure Centre while preserving the awarded facility objective.",
            "Allow restoration, safety, and critical infrastructure substitutions tied to the same facility.",
            RATIFY_DEADLINE,
            REVIEW_DEADLINE,
            3600,
        )
    assert contract.get_accounting() == before


def test_only_contractor_can_ratify_once_before_deadline(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)

    direct_vm.sender = direct_charlie
    with direct_vm.expect_revert("Only contractor can ratify"):
        contract.ratify_agreement("grove-island-01")
    assert field(contract.get_agreement("grove-island-01"), "state") == "DRAFT"

    ratify(contract, direct_vm, direct_bob)
    assert field(contract.get_agreement("grove-island-01"), "state") == "ACTIVE"

    with direct_vm.expect_revert("Agreement cannot be ratified"):
        contract.ratify_agreement("grove-island-01")


def test_agreements_are_isolated_and_unauthorized_actor_cannot_review(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob, agreement_id="grove-island-01")
    create_agreement(contract, direct_vm, direct_alice, direct_bob, agreement_id="grove-island-02")

    ratify(contract, direct_vm, direct_bob, agreement_id="grove-island-01")
    assert field(contract.get_agreement("grove-island-01"), "state") == "ACTIVE"
    assert field(contract.get_agreement("grove-island-02"), "state") == "DRAFT"

    before = contract.get_accounting()
    direct_vm.sender = direct_charlie
    with direct_vm.expect_revert("Only an agreement party can request review"):
        contract.request_review("grove-island-01", "00587863-2026")
    assert int(field(contract.get_agreement("grove-island-01"), "attempt_count")) == 0
    assert field(contract.get_agreement("grove-island-02"), "state") == "DRAFT"
    assert contract.get_accounting() == before
