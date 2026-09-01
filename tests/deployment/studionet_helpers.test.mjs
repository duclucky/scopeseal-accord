import test from "node:test";
import assert from "node:assert/strict";

import {
  deploymentDecision,
  isSuccessfulFinalizedReceipt,
  mergeEnvironment,
  retryDecision,
  safeReceiptProjection,
  selectNextLifecycleAction,
  valueForCreateAgreement,
} from "../../scripts/studionet.mjs";


test("safe receipt projection excludes raw validator material", () => {
  const projected = safeReceiptProjection({
    statusName: "FINALIZED",
    txExecutionResultName: "FINISHED_WITH_RETURN",
    resultName: "MAJORITY_AGREE",
    hash: `0x${"a".repeat(64)}`,
    data: { contract_address: `0x${"1".repeat(40)}` },
    stdout: "private output",
    node_config: { private: "must-not-leak" },
    trace: { private: true },
  }, "deploy");

  assert.deepEqual(Object.keys(projected).sort(), [
    "consensusResult", "contractAddress", "label", "status", "transactionHash", "txExecutionResult",
  ]);
  const serialized = JSON.stringify(projected);
  assert.equal(serialized.includes("private output"), false);
  assert.equal(serialized.includes("must-not-leak"), false);
});


test("raw and normalized finalized receipts require successful execution", () => {
  const raw = {
    status: 7,
    result: 6,
    consensus_data: { leader_receipt: [{ execution_result: "SUCCESS" }] },
  };
  const normalized = {
    statusName: "FINALIZED",
    txExecutionResultName: "FINISHED_WITH_RETURN",
  };
  assert.equal(isSuccessfulFinalizedReceipt(raw), true);
  assert.equal(isSuccessfulFinalizedReceipt(normalized), true);
  assert.equal(isSuccessfulFinalizedReceipt({ ...raw, result: 7 }), false);
  assert.equal(isSuccessfulFinalizedReceipt({ ...normalized, txExecutionResultName: "ERROR" }), false);
});


test("creation always attaches exactly 2 GEN in base-unit transport", () => {
  assert.equal(valueForCreateAgreement(), 2n * 10n ** 18n);
});


test("deployment identity resumes only the exact active revision", () => {
  const current = {
    network: "studionet",
    chainId: 61999,
    sourceCommit: "abc",
    sourceSha256: "def",
    depends: "runner",
    deployer: "0xprincipal",
  };
  assert.equal(deploymentDecision(undefined, current), "DEPLOY");
  assert.equal(deploymentDecision({ ...current, result: "SUCCESS", active: true, contractAddress: "0xcontract" }, current), "RESUME");
  assert.equal(deploymentDecision({ ...current, sourceSha256: "changed", result: "SUCCESS", active: true, contractAddress: "0xcontract" }, current), "REFUSE");
});


test("project environment wins and parent only fills absent variables", () => {
  assert.deepEqual(
    mergeEnvironment(
      { STUDIONET_PRIVATE_KEY: "project" },
      { STUDIONET_PRIVATE_KEY: "parent", STUDIONET_CONTRACTOR_PRIVATE_KEY: "contractor" },
    ),
    { STUDIONET_PRIVATE_KEY: "project", STUDIONET_CONTRACTOR_PRIVATE_KEY: "contractor" },
  );
});


test("lifecycle selector resumes from canonical state without replay", () => {
  assert.equal(selectNextLifecycleAction(undefined), "CREATE");
  assert.equal(selectNextLifecycleAction({ state: "DRAFT" }), "RATIFY");
  assert.equal(selectNextLifecycleAction({ state: "ACTIVE" }), "REVIEW");
  assert.equal(selectNextLifecycleAction({ state: "RETRYABLE" }), "REVIEW");
  assert.equal(selectNextLifecycleAction({ state: "NEGOTIATION", hasProposal: false }), "PROPOSE");
  assert.equal(selectNextLifecycleAction({ state: "NEGOTIATION", hasProposal: true }), "ACCEPT");
  assert.equal(selectNextLifecycleAction({ state: "SETTLED", sponsorCreditGen: 0, contractorCreditGen: 2 }), "WITHDRAW_CONTRACTOR");
  assert.equal(selectNextLifecycleAction({ state: "SETTLED", sponsorCreditGen: 1, contractorCreditGen: 1 }), "WITHDRAW_CONTRACTOR");
  assert.equal(selectNextLifecycleAction({ state: "SETTLED", sponsorCreditGen: 1, contractorCreditGen: 0 }), "WITHDRAW_SPONSOR");
  assert.equal(selectNextLifecycleAction({ state: "CLOSED" }), "COMPLETE");
  assert.equal(selectNextLifecycleAction({ state: "UNKNOWN" }), "STOP_INCONSISTENT");
});


test("review retry is allowed only for the current transient source attempt", () => {
  const agreement = { state: "RETRYABLE", attemptCount: 3 };
  assert.equal(retryDecision(agreement, { attemptNumber: 3, sourceStatus: "UNAVAILABLE" }), "RETRY_TRANSIENT");
  assert.equal(retryDecision(agreement, { attemptNumber: 3, sourceStatus: "INVALID" }), "REFUSE_STRUCTURAL");
  assert.equal(retryDecision(agreement, { attemptNumber: 2, sourceStatus: "UNAVAILABLE" }), "REFUSE_MISMATCH");
  assert.equal(retryDecision({ state: "ACTIVE", attemptCount: 0 }, undefined), "REFUSE_STATE");
});
