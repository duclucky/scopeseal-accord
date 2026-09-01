import pytest

from tests.direct.helpers import (
    CONTRACT_PATH,
    GEN_SCALE,
    NOW,
    RATIFY_DEADLINE,
    REVIEW_DEADLINE,
    create_agreement,
    field,
    mock_official_records,
    mock_semantic_review,
    ratify,
)


def _manual_create(contract, vm, sponsor, contractor, ratify_deadline, review_deadline):
    vm.sender = sponsor
    vm.value = 2 * GEN_SCALE
    contract.create_agreement(
        "boundary-01",
        contractor,
        "00190662-2025",
        "6480e4d5-6f07-4b83-8097-5756d8fbf527",
        "01",
        "3267368TH",
        "7f56490a-c5ba-4922-853b-07b18b0d14c1",
        "417379",
        "Upgrade Grove Island Leisure Centre while preserving the awarded facility objective.",
        "Allow restoration, safety, and critical infrastructure substitutions tied to the same facility.",
        ratify_deadline,
        review_deadline,
        3600,
    )


def _material(contract, vm, sponsor, contractor):
    create_agreement(contract, vm, sponsor, contractor)
    ratify(contract, vm, contractor)
    mock_official_records(vm)
    mock_semantic_review(vm, "MATERIAL_AMENDMENT")
    vm.sender = sponsor
    contract.request_review("grove-island-01", "00587863-2026")


def test_create_rejects_exact_current_ratification_deadline_without_mutation(
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.warp(NOW)
    with direct_vm.expect_revert("Ratification deadline must be in the future"):
        _manual_create(contract, direct_vm, direct_alice, direct_bob, NOW, REVIEW_DEADLINE)
    assert int(field(contract.get_accounting(), "received_gen")) == 0


@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:09:59Z", True),
        (RATIFY_DEADLINE, False),
        ("2026-09-01T00:10:01Z", False),
    ],
)
def test_ratification_boundary_with_stale_draft(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    before = contract.get_accounting()
    direct_vm.sender = direct_bob
    direct_vm.warp(timestamp)
    if allowed:
        contract.ratify_agreement("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "ACTIVE"
    else:
        with direct_vm.expect_revert("Ratification deadline has passed"):
            contract.ratify_agreement("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "DRAFT"
    assert contract.get_accounting() == before


@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:59:59Z", True),
        (REVIEW_DEADLINE, False),
        ("2026-09-01T01:00:01Z", False),
    ],
)
def test_review_boundary_with_stale_active_state(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    ratify(contract, direct_vm, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp(timestamp)
    before = contract.get_accounting()
    if allowed:
        mock_official_records(direct_vm, previous_binding="wrong-01")
        contract.request_review("grove-island-01", "00587863-2026")
        assert field(contract.get_agreement("grove-island-01"), "state") == "RETRYABLE"
    else:
        with direct_vm.expect_revert("Review deadline has passed"):
            contract.request_review("grove-island-01", "00587863-2026")
        agreement = contract.get_agreement("grove-island-01")
        assert field(agreement, "state") == "ACTIVE"
        assert int(field(agreement, "attempt_count")) == 0
    assert contract.get_accounting() == before


@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:59:59Z", True),
        ("2026-09-01T01:00:00Z", False),
        ("2026-09-01T01:00:01Z", False),
    ],
)
def test_proposal_boundary_with_stale_negotiation(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _material(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp(timestamp)
    before = contract.get_accounting()
    if allowed:
        contract.propose_split("grove-island-01", 1)
        assert int(field(contract.get_agreement("grove-island-01"), "proposal_nonce")) == 1
    else:
        with direct_vm.expect_revert("Negotiation window is closed"):
            contract.propose_split("grove-island-01", 1)
        assert int(field(contract.get_agreement("grove-island-01"), "proposal_nonce")) == 0
    assert contract.get_accounting() == before


@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:59:59Z", True),
        ("2026-09-01T01:00:00Z", False),
        ("2026-09-01T01:00:01Z", False),
    ],
)
def test_acceptance_boundary_with_stale_negotiation_and_proposal(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _material(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    contract.propose_split("grove-island-01", 1)
    direct_vm.sender = direct_bob
    direct_vm.warp(timestamp)
    if allowed:
        contract.accept_split("grove-island-01", 1)
        assert field(contract.get_agreement("grove-island-01"), "state") == "SETTLED"
    else:
        before = contract.get_accounting()
        with direct_vm.expect_revert("Negotiation window is closed"):
            contract.accept_split("grove-island-01", 1)
        assert field(contract.get_agreement("grove-island-01"), "state") == "NEGOTIATION"
        assert contract.get_accounting() == before

@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:09:59Z", False),
        (RATIFY_DEADLINE, True),
        ("2026-09-01T00:10:01Z", True),
    ],
)
def test_draft_recovery_boundary_with_stale_draft(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    create_agreement(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp(timestamp)
    if allowed:
        contract.recover_expired("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "SETTLED"
    else:
        before = contract.get_accounting()
        with direct_vm.expect_revert("Agreement has not expired"):
            contract.recover_expired("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "DRAFT"
        assert contract.get_accounting() == before


@pytest.mark.parametrize(
    ("timestamp", "allowed"),
    [
        ("2026-09-01T00:59:59Z", False),
        ("2026-09-01T01:00:00Z", True),
        ("2026-09-01T01:00:01Z", True),
    ],
)
def test_negotiation_recovery_boundary_with_stale_negotiation(
    timestamp,
    allowed,
    direct_vm,
    direct_deploy,
    direct_alice,
    direct_bob,
):
    contract = direct_deploy(CONTRACT_PATH)
    _material(contract, direct_vm, direct_alice, direct_bob)
    direct_vm.sender = direct_alice
    direct_vm.warp(timestamp)
    if allowed:
        contract.recover_expired("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "SETTLED"
    else:
        before = contract.get_accounting()
        with direct_vm.expect_revert("Agreement has not expired"):
            contract.recover_expired("grove-island-01")
        assert field(contract.get_agreement("grove-island-01"), "state") == "NEGOTIATION"
        assert contract.get_accounting() == before
