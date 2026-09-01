import test from "node:test";
import assert from "node:assert/strict";

import {
  deploymentDecision,
  isSuccessfulFinalizedReceipt,
  mergeEnvironment,
  orderPendingRecoveries,
  quarantineDecision,
  retryDecision,
  retirementDecision,
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
  assert.equal(deploymentDecision({ ...current, sourceSha256: "old", result: "RETIRED", active: false, remainingAccountingZero: true, contractAddress: "0xcontract" }, current), "REPLACE");
  assert.equal(deploymentDecision({ ...current, sourceSha256: "old", result: "QUARANTINED", active: false, recoveryPending: true, closePathDefined: true, contractAddress: "0xcontract" }, current), "REPLACE");
  assert.equal(deploymentDecision({ ...current, sourceSha256: "old", result: "ABANDONED_TESTNET", active: false, recoveryPending: false, contractAddress: "0xcontract" }, current), "REPLACE");
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


test("superseded revision retires only after expiry and zero accounting", () => {
  const agreement = {
    state: "RETRYABLE",
    reviewDeadline: "2026-09-02T04:43:24Z",
    sponsorCreditGen: 0,
    contractorCreditGen: 0,
  };
  const accounting = { received_gen: 2, locked_gen: 2, credited_gen: 0, withdrawn_gen: 0 };
  assert.deepEqual(
    retirementDecision(agreement, accounting, "2026-09-02T04:43:23Z"),
    { action: "WAIT", availableAt: "2026-09-02T04:43:24Z" },
  );
  assert.deepEqual(
    retirementDecision(agreement, accounting, "2026-09-02T04:43:24Z"),
    { action: "RECOVER", availableAt: "2026-09-02T04:43:24Z" },
  );
  assert.deepEqual(
    retirementDecision({ ...agreement, state: "SETTLED", sponsorCreditGen: 2 }, { ...accounting, locked_gen: 0, credited_gen: 2 }),
    { action: "WITHDRAW_SPONSOR" },
  );
  assert.deepEqual(
    retirementDecision({ ...agreement, state: "CLOSED" }, { received_gen: 2, locked_gen: 0, credited_gen: 0, withdrawn_gen: 2 }),
    { action: "ARCHIVE" },
  );
  assert.deepEqual(
    retirementDecision({ ...agreement, state: "CLOSED" }, { received_gen: 2, locked_gen: 1, credited_gen: 0, withdrawn_gen: 1 }),
    { action: "REFUSE_NONZERO" },
  );
});


test("a failed active revision is quarantined only with a bounded recovery path", () => {
  const agreement = {
    state: "RETRYABLE",
    reviewDeadline: "2026-09-02T04:43:23Z",
    attemptCount: 2,
  };
  const accounting = { received_gen: 2, locked_gen: 2, credited_gen: 0, withdrawn_gen: 0 };
  const attempt = { attemptNumber: 2, sourceStatus: "UNAVAILABLE", aggregateVerdict: "UNVERIFIABLE" };
  assert.deepEqual(
    quarantineDecision(agreement, accounting, attempt),
    { action: "QUARANTINE", recoveryAvailableAt: "2026-09-02T04:43:23Z" },
  );
  assert.deepEqual(
    quarantineDecision(agreement, accounting, {
      attemptNumber: 2,
      sourceStatus: "INVALID",
      sourceCoverage: "INCOMPLETE",
      aggregateVerdict: "UNVERIFIABLE",
      consequenceClass: "NO_CONSEQUENCE",
    }),
    { action: "QUARANTINE", recoveryAvailableAt: "2026-09-02T04:43:23Z" },
  );
  assert.deepEqual(
    quarantineDecision(agreement, { ...accounting, credited_gen: 1 }, attempt),
    { action: "REFUSE" },
  );
  assert.deepEqual(
    quarantineDecision(agreement, accounting, { ...attempt, attemptNumber: 1 }),
    { action: "REFUSE" },
  );
  assert.deepEqual(
    quarantineDecision(agreement, accounting, {
      attemptNumber: 2,
      sourceStatus: "INVALID",
      sourceCoverage: "INCOMPLETE",
      aggregateVerdict: "UNVERIFIABLE",
      consequenceClass: "CREDIT_CONTRACTOR",
    }),
    { action: "REFUSE" },
  );
});


test("multiple quarantined revisions recover in deadline order", () => {
  const ordered = orderPendingRecoveries([
    { deployment: { contractAddress: "0x2", recoveryAvailableAt: "2026-09-02T07:40:38Z" } },
    { deployment: { contractAddress: "0x1", recoveryAvailableAt: "2026-09-02T04:43:23Z" } },
  ]);
  assert.deepEqual(
    ordered.map(({ deployment }) => deployment.contractAddress),
    ["0x1", "0x2"],
  );
});
