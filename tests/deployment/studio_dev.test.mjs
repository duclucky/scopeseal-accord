import assert from "node:assert/strict";
import test from "node:test";

import {
  deploymentDecision,
  mergeEnvironment,
  nextLifecycleAction,
  parseDepends,
  safeReceiptProjection,
  valueForAction,
} from "../../scripts/studio-dev.mjs";


test("project environment wins without exposing signer values", () => {
  assert.deepEqual(mergeEnvironment({ A: "project" }, { A: "parent", B: "parent" }), { A: "project", B: "parent" });
});


test("v0.3 Depends is parsed after the version pragma", () => {
  const source = '# v0.3.0\n# { "Depends": "py-genlayer:abc" }\nimport genlayer as gl\n';
  assert.equal(parseDepends(source), "py-genlayer:abc");
  assert.throws(() => parseDepends("# v0.3.0\nimport genlayer as gl\n"), /Depends header/u);
});


test("deployment resumes only the exact active identity", () => {
  const identity = { network: "studio-dev", chainId: 61997, sourceCommit: "a", sourceSha256: "b", depends: "c", contractApi: "d", sponsor: "e", contractor: "f" };
  assert.equal(deploymentDecision(undefined, identity), "DEPLOY");
  assert.equal(deploymentDecision({ ...identity, active: true, result: "SUCCESS", contractAddress: "0x1" }, identity), "RESUME");
  assert.equal(deploymentDecision({ ...identity, active: false, result: "ABANDONED_TESTNET" }, identity), "REPLACE");
  assert.equal(deploymentDecision({ ...identity, sourceSha256: "changed", active: true, result: "SUCCESS", contractAddress: "0x1" }, identity), "REFUSE");
});


test("safe Studio Dev receipt projection omits validator internals and keeps fee outcome", () => {
  const receipt = {
    hash: `0x${"1".repeat(64)}`,
    statusName: "FINALIZED",
    txExecutionResultName: "FINISHED_WITH_RETURN",
    resultName: "MAJORITY_AGREE",
    consensus_data: { private_validator_material: "must-not-leak" },
    feeAccounting: { paid_fee_value: "100000000000000000", total_refunded: "25000000000000000" },
  };
  const safe = safeReceiptProjection(receipt, "write", null);
  assert.equal(safe.fee.actualGEN, "0.075");
  assert.equal(safe.fee.refundedGEN, "0.025");
  assert.equal(JSON.stringify(safe).includes("private_validator_material"), false);
});


test("lifecycle selector covers the agreement and closeout state machines", () => {
  assert.equal(nextLifecycleAction({ agreement: null }), "CREATE");
  assert.equal(nextLifecycleAction({ agreement: { state: "DRAFT" } }), "RATIFY");
  assert.equal(nextLifecycleAction({ agreement: { state: "NEGOTIATION", hasProposal: false } }), "PROPOSE");
  assert.equal(nextLifecycleAction({ agreement: { state: "SETTLED", contractorCreditGEN: "2", sponsorCreditGEN: "0" } }), "WITHDRAW_CONTRACTOR");
  assert.equal(nextLifecycleAction({ agreement: { state: "CLOSED" }, closeout: null }), "OPEN_CLOSEOUT");
  assert.equal(nextLifecycleAction({ agreement: { state: "CLOSED" }, closeout: { state: "OFFERED" } }), "RATIFY_CLOSEOUT");
  assert.equal(nextLifecycleAction({ agreement: { state: "CLOSED" }, closeout: { state: "CLOSED" } }), "COMPLETE");
});


test("human-facing application values remain one or two GEN", () => {
  assert.equal(valueForAction("CREATE"), 2n * 10n ** 18n);
  assert.equal(valueForAction("OPEN_CLOSEOUT"), 10n ** 18n);
  assert.equal(valueForAction("REVIEW"), 0n);
});
