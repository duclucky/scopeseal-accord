import pytest

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


def _material(contract, vm, sponsor, contractor):
    create_agreement(contract, vm, sponsor, contractor)
    ratify(contract, vm, contractor)
    mock_official_records(vm)
    mock_semantic_review(vm, "MATERIAL_AMENDMENT")
    vm.sender = sponsor
    contract.request_review("grove-island-01", "00587863-2026")


@pytest.mark.parametrize("contractor_gen", [0, 1, 2])
def test_negotiated_allocations_conserve_two_gen(
    contractor_gen,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _material(contract, direct_vm, direct_alice, direct_bob)

    direct_vm.sender = direct_alice
    contract.propose_split("grove-island-01", contractor_gen)
    proposal = contract.get_agreement("grove-island-01")
    assert int(field(proposal, "proposal_contractor_gen")) == contractor_gen
    assert int(field(proposal, "proposal_nonce")) == 1
    assert field(proposal, "has_proposal") is True

    direct_vm.sender = direct_bob
    contract.accept_split("grove-island-01", 1)

    settled = contract.get_agreement("grove-island-01")
    assert field(settled, "state") == "SETTLED"
    assert field(settled, "verdict") == "NEGOTIATED"
    assert int(field(settled, "contractor_credit")) == contractor_gen * GEN_SCALE
    assert int(field(settled, "sponsor_credit")) == (2 - contractor_gen) * GEN_SCALE
    assert int(contract.get_credit_gen("grove-island-01", to_hex(direct_bob))) == contractor_gen
    assert int(contract.get_credit_gen("grove-island-01", to_hex(direct_alice))) == 2 - contractor_gen


def test_proposal_and_acceptance_enforce_roles_amount_and_nonce(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
    direct_charlie,
):
    contract = direct_deploy(CONTRACT_PATH)
    _material(contract, direct_vm, direct_alice, direct_bob)

    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("Only sponsor can propose"):
        contract.propose_split("grove-island-01", 1)

    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Contractor allocation must be 0, 1, or 2 GEN"):
        contract.propose_split("grove-island-01", 3)
    contract.propose_split("grove-island-01", 1)
    contract.propose_split("grove-island-01", 2)
    assert int(field(contract.get_agreement("grove-island-01"), "proposal_nonce")) == 2

    direct_vm.sender = direct_charlie
    with direct_vm.expect_revert("Only contractor can accept"):
        contract.accept_split("grove-island-01", 2)
    direct_vm.sender = direct_bob
    with direct_vm.expect_revert("Proposal nonce is stale"):
        contract.accept_split("grove-island-01", 1)
    contract.accept_split("grove-island-01", 2)
    with direct_vm.expect_revert("Agreement is not negotiating"):
        contract.accept_split("grove-island-01", 2)
