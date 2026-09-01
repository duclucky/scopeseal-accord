"""Safe projections for raw Studio and normalized SDK receipts.

Never persist the original receipt: validator configuration, traces, and process
output may be present in fields that are intentionally not copied here.
"""

from __future__ import annotations

import re
from typing import Any


_ADDRESS = re.compile(r"^0x[0-9a-fA-F]{40}$")


def _status(receipt: dict[str, Any]) -> str | int | None:
    if receipt.get("statusName") is not None:
        return receipt["statusName"]
    if receipt.get("status_name") is not None:
        return receipt["status_name"]
    if receipt.get("status") == 7:
        return "FINALIZED"
    if receipt.get("status") == 5:
        return "ACCEPTED"
    return receipt.get("status")


def _consensus_result(receipt: dict[str, Any]) -> str | int | None:
    if receipt.get("resultName") is not None:
        return receipt["resultName"]
    if receipt.get("result_name") is not None:
        return receipt["result_name"]
    if receipt.get("result") == 6:
        return "MAJORITY_AGREE"
    return receipt.get("result")


def _leader_execution(receipt: dict[str, Any]) -> Any:
    if receipt.get("execution_result") is not None:
        return receipt["execution_result"]
    consensus = receipt.get("consensus_data")
    if not isinstance(consensus, dict):
        return None
    leaders = consensus.get("leader_receipt")
    if not isinstance(leaders, list) or not leaders or not isinstance(leaders[0], dict):
        return None
    return leaders[0].get("execution_result")


def _execution_result(receipt: dict[str, Any]) -> str | None:
    normalized = receipt.get("txExecutionResultName") or receipt.get("executionResultName")
    if normalized is not None:
        return str(normalized)
    raw = _leader_execution(receipt)
    if isinstance(raw, str):
        return raw
    if isinstance(raw, dict):
        for key in ("result", "name", "status"):
            if raw.get(key) is not None:
                return str(raw[key])
    return None


def _contract_address(receipt: dict[str, Any]) -> str | None:
    data = receipt.get("data") if isinstance(receipt.get("data"), dict) else {}
    decoded = receipt.get("txDataDecoded") if isinstance(receipt.get("txDataDecoded"), dict) else {}
    candidates = (
        receipt.get("contractAddress"),
        receipt.get("contract_address"),
        data.get("contract_address"),
        data.get("contractAddress"),
        decoded.get("contractAddress"),
    )
    return next((value for value in candidates if isinstance(value, str) and _ADDRESS.fullmatch(value)), None)


def safe_receipt_projection(
    receipt: dict[str, Any] | None,
    *,
    label: str,
    fallback_hash: str | None = None,
) -> dict[str, Any]:
    """Return the complete allowlist of fields safe to persist or print."""

    value = receipt if isinstance(receipt, dict) else {}
    return {
        "label": label,
        "transactionHash": value.get("hash") or value.get("transactionHash") or fallback_hash,
        "status": _status(value),
        "txExecutionResult": _execution_result(value),
        "consensusResult": _consensus_result(value),
        "contractAddress": _contract_address(value),
    }
