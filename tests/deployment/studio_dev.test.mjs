import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

import {
  deploymentDecision,
  evidenceProfile,
  isAgreementRecoveryAllowed,
  isCloseoutRecoveryAllowed,
  isWithinAcceptanceWindow,
  isWithinNegotiationWindow,
  mergeEnvironment,
  nextLifecycleAction,
  parseDepends,
  safeReceiptProjection,
  safeOperationError,
  valueForAction,
} from "../../scripts/studio-dev.mjs";


test("project environment wins without exposing signer values", () => {
  assert.deepEqual(mergeEnvironment({ A: "project" }, { A: "parent", B: "parent" }), { A: "project", B: "parent" });
});

test("operation errors do not expose nested RPC or validator payloads", () => {
  const error = new Error("node_config.private_key=must-not-leak");
  error.code = -32000;
  error.cause = { node_config: { private_key: "must-not-leak" } };
  const safe = safeOperationError(error);
  assert.deepEqual(safe, { result: "FAILED", code: -32000 });
  assert.equal(JSON.stringify(safe).includes("must-not-leak"), false);
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

test("deployment requires both intended lifecycle signer roles before recording identity", () => {
  const source = readFileSync(new URL("../../scripts/studio-dev.mjs", import.meta.url), "utf8");
  const deployBlock = source.split("async function deploy() {")[1]?.split("function lifecycleFile(")[0];
  assert.ok(deployBlock);
  assert.match(deployBlock, /const clients = await roleClients\(true\)/u);
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

test("default fee fallback is allowed only inside the canonical negotiation window", () => {
  const agreement = {
    state: "NEGOTIATION",
    hasProposal: false,
    negotiationStartedAt: "2026-09-21T02:25:21Z",
    negotiationDeadline: "2026-09-21T03:25:21Z",
  };
  assert.equal(isWithinNegotiationWindow(agreement, "2026-09-21T02:25:21Z"), true);
  assert.equal(isWithinNegotiationWindow(agreement, "2026-09-21T03:25:20Z"), true);
  assert.equal(isWithinNegotiationWindow(agreement, "2026-09-21T03:25:21Z"), false);
  assert.equal(isWithinNegotiationWindow({ ...agreement, state: "ACTIVE" }, "2026-09-21T02:30:00Z"), false);
  assert.equal(isWithinNegotiationWindow({ ...agreement, hasProposal: true }, "2026-09-21T02:30:00Z"), false);
  assert.equal(isWithinAcceptanceWindow({ ...agreement, hasProposal: true }, "2026-09-21T02:30:00Z"), true);
  assert.equal(isWithinAcceptanceWindow(agreement, "2026-09-21T02:30:00Z"), false);
  assert.equal(isWithinAcceptanceWindow({ ...agreement, hasProposal: true }, "2026-09-21T03:25:21Z"), false);
});

test("E5 smoke profile binds the agreement to the completion notice authority", () => {
  const profile = evidenceProfile("e5-closeout");
  assert.equal(profile.originalPublication, "00547772-2025");
  assert.equal(profile.buyerLegalId, "6912131539");
  assert.equal(profile.procedureId, "d9f4bc69-ef7d-42f6-ad8f-802fd332b0a6");
  assert.equal(profile.contractId, "3/PNO/2025");
  assert.equal(profile.completionPublication, "00734925-2025");
  assert.equal(profile.ratifyOffsetMs < profile.reviewOffsetMs, true);
  assert.throws(() => evidenceProfile("unknown"), /profile/u);
});

test("agreement recovery becomes legal exactly at the state-specific deadline", () => {
  const draft = { state: "DRAFT", ratifyDeadline: "2026-09-21T03:20:30Z", reviewDeadline: "2026-09-21T03:23:30Z", negotiationDeadline: "" };
  assert.equal(isAgreementRecoveryAllowed(draft, "2026-09-21T03:20:29Z"), false);
  assert.equal(isAgreementRecoveryAllowed(draft, "2026-09-21T03:20:30Z"), true);
  assert.equal(isAgreementRecoveryAllowed({ ...draft, state: "ACTIVE" }, "2026-09-21T03:23:29Z"), false);
  assert.equal(isAgreementRecoveryAllowed({ ...draft, state: "ACTIVE" }, "2026-09-21T03:23:30Z"), true);
  assert.equal(isAgreementRecoveryAllowed({ ...draft, state: "CLOSED" }, "2026-09-21T04:00:00Z"), false);
});

test("closeout recovery becomes legal exactly at the state-specific deadline", () => {
  const offered = { state: "OFFERED", ratifyDeadline: "2026-09-21T03:20:30Z", reviewDeadline: "2026-09-21T03:23:30Z", negotiationDeadline: "" };
  assert.equal(isCloseoutRecoveryAllowed(offered, "2026-09-21T03:20:29Z"), false);
  assert.equal(isCloseoutRecoveryAllowed(offered, "2026-09-21T03:20:30Z"), true);
  assert.equal(isCloseoutRecoveryAllowed({ ...offered, state: "RETRYABLE" }, "2026-09-21T03:23:29Z"), false);
  assert.equal(isCloseoutRecoveryAllowed({ ...offered, state: "RETRYABLE" }, "2026-09-21T03:23:30Z"), true);
  assert.equal(isCloseoutRecoveryAllowed({ ...offered, state: "NEGOTIATION", negotiationDeadline: "2026-09-21T03:30:00Z" }, "2026-09-21T03:30:00Z"), true);
  assert.equal(isCloseoutRecoveryAllowed({ ...offered, state: "CLOSED" }, "2026-09-21T04:00:00Z"), false);
});
