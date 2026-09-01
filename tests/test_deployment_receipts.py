from scripts.deployment_receipts import safe_receipt_projection


def test_projects_only_safe_fields_from_raw_studio_receipt() -> None:
    raw = {
        "hash": "0xraw",
        "status": 7,
        "result": 6,
        "consensus_data": {
            "leader_receipt": [
                {
                    "execution_result": "SUCCESS",
                    "stdout": "private validator output",
                    "node_config": {"provider": "secret"},
                }
            ]
        },
        "data": {"contract_address": "0x" + "1" * 40},
        "trace": {"private": True},
    }

    projected = safe_receipt_projection(raw, label="deploy")

    assert projected == {
        "label": "deploy",
        "transactionHash": "0xraw",
        "status": "FINALIZED",
        "txExecutionResult": "SUCCESS",
        "consensusResult": "MAJORITY_AGREE",
        "contractAddress": "0x" + "1" * 40,
    }
    assert "private" not in str(projected).lower()
    assert "secret" not in str(projected).lower()


def test_projects_only_safe_fields_from_normalized_sdk_receipt() -> None:
    normalized = {
        "transactionHash": "0xnormalized",
        "statusName": "FINALIZED",
        "txExecutionResultName": "FINISHED_WITH_RETURN",
        "resultName": "MAJORITY_AGREE",
        "contractAddress": "0x" + "2" * 40,
        "stderr": "must not escape",
    }

    projected = safe_receipt_projection(normalized, label="create")

    assert projected["transactionHash"] == "0xnormalized"
    assert projected["status"] == "FINALIZED"
    assert projected["txExecutionResult"] == "FINISHED_WITH_RETURN"
    assert projected["consensusResult"] == "MAJORITY_AGREE"
    assert set(projected) == {
        "label",
        "transactionHash",
        "status",
        "txExecutionResult",
        "consensusResult",
        "contractAddress",
    }


def test_missing_receipt_fields_remain_explicitly_unknown() -> None:
    assert safe_receipt_projection({}, label="unknown", fallback_hash="0xfallback") == {
        "label": "unknown",
        "transactionHash": "0xfallback",
        "status": None,
        "txExecutionResult": None,
        "consensusResult": None,
        "contractAddress": None,
    }
