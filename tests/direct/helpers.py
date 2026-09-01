import json

from tests.direct.conftest import to_hex


CONTRACT_PATH = "contracts/scopeseal_accord.py"
GEN_SCALE = 10**18
NOW = "2026-09-01T00:00:00Z"
RATIFY_DEADLINE = "2026-09-01T00:10:00Z"
REVIEW_DEADLINE = "2026-09-01T01:00:00Z"


def create_agreement(contract, vm, sponsor, contractor, agreement_id="grove-island-01"):
    vm.sender = sponsor
    vm.value = 2 * GEN_SCALE
    vm.warp(NOW)
    contract.create_agreement(
        agreement_id,
        contractor,
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
    contract_address = vm._contract_address
    current_balance = vm._balances.get(bytes(contract_address), 0)
    vm.deal(contract_address, current_balance + 2 * GEN_SCALE)
    vm.value = 0
    return agreement_id


def ratify(contract, vm, contractor, agreement_id="grove-island-01"):
    vm.sender = contractor
    vm.value = 0
    contract.ratify_agreement(agreement_id)


def assert_parties(agreement, sponsor, contractor):
    assert to_hex(field(agreement, "sponsor")).lower() == to_hex(sponsor).lower()
    assert to_hex(field(agreement, "contractor")).lower() == to_hex(contractor).lower()


def field(record, name):
    if isinstance(record, dict):
        return record[name]
    return getattr(record, name)


def _sparql_body(values):
    binding = {
        key: {"type": "literal", "value": value}
        for key, value in values.items()
    }
    return json.dumps({"head": {"vars": list(values)}, "results": {"bindings": [binding]}})


def mock_official_records(
    vm,
    *,
    previous_binding="6480e4d5-6f07-4b83-8097-5756d8fbf527-01",
    original_overrides=None,
    modification_overrides=None,
):
    original = {
        "publication": "00190662-2025",
        "notice_uuid": "6480e4d5-6f07-4b83-8097-5756d8fbf527",
        "notice_version": "01",
        "buyer_legal_id": "3267368TH",
        "procedure_id": "7f56490a-c5ba-4922-853b-07b18b0d14c1",
        "contract_id": "417379",
        "title": "Grove Island Leisure Centre Upgrade Works",
        "description": "Refurbishment of changing rooms, public toilets, pool deck, mechanical systems, and external paving.",
    }
    modification = {
        "publication": "00587863-2026",
        "notice_version": "02",
        "form_type": "cont-modif",
        "previous_notice_binding": previous_binding,
        "buyer_legal_id": "3267368TH",
        "procedure_id": "7f56490a-c5ba-4922-853b-07b18b0d14c1",
        "contract_id": "417379",
        "title": "Grove Island Leisure Centre Upgrade Works",
        "description": "Refurbishment of changing rooms, public toilets, pool deck, mechanical systems, and external paving.",
        "modification_description": "Added sauna, pool deck, electrical, fire door, and painting work; omitted some ceilings and decoration.",
        "modification_reason": "Unforeseen hidden elements and critical infrastructure replacement for continued operation.",
        "justification": "add-wss",
    }
    if original_overrides:
        original.update(original_overrides)
    if modification_overrides:
        modification.update(modification_overrides)
    vm.mock_web(
        r".*00190662-2025.*",
        {"method": "GET", "status": 200, "body": _sparql_body(original)},
    )
    vm.mock_web(
        r".*00587863-2026.*",
        {"method": "GET", "status": 200, "body": _sparql_body(modification)},
    )


def mock_semantic_review(vm, verdict, rationale="Bounded semantic comparison.", raw=None):
    result = raw
    if result is None:
        result = {
            "entity_results": [
                {"entity_id": "AMENDMENT_SCOPE", "verdict": verdict}
            ],
            "aggregate_verdict": verdict,
            "rationale": rationale,
        }
    vm.mock_llm(
        r"(?s).*ScopeSeal Accord semantic reviewer.*",
        json.dumps(result),
    )
