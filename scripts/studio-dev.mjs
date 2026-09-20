import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = join(PROJECT_ROOT, "contracts", "scopeseal_accord.py");
const PROJECT_ENV_PATH = join(PROJECT_ROOT, ".env");
const PARENT_ENV_PATH = join(PROJECT_ROOT, "..", ".env");
const EVIDENCE_DIR = join(PROJECT_ROOT, "docs", "evidence", "studio-dev", "milestones", "MS-002");
const DEPLOYMENT_PATH = join(EVIDENCE_DIR, "deployment.json");
const ATTEMPTS_PATH = join(EVIDENCE_DIR, "deployment-attempts.json");
const LIFECYCLE_PATH = join(EVIDENCE_DIR, "lifecycle.json");
const RPC_URL = "https://studio-next.genlayer.com/api";
const EXPLORER_URL = "https://explorer-studio-dev.genlayer.com";
const CHAIN_ID = 61997;
const CHAIN_ID_HEX = "0xf22d";
const GEN = 10n ** 18n;
const AGREEMENT_ID = "scopeseal-v2-001";
const TRANSACTION_APPROVAL = "STUDIO_DEV_TRANSACTION_APPROVED";
const IDENTITY_KEYS = ["network", "chainId", "sourceCommit", "sourceSha256", "depends", "contractApi", "sponsor", "contractor"];


function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}


function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}


function jsonSafe(value) {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(jsonSafe);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, jsonSafe(item)]));
  }
  return value;
}


function readEnvironmentFile(path) {
  if (!existsSync(path)) return {};
  const parsed = {};
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value) parsed[name] = value;
  }
  return parsed;
}


export function mergeEnvironment(projectEnvironment, parentEnvironment) {
  return { ...parentEnvironment, ...projectEnvironment };
}


function loadAuthorizedEnvironment() {
  const merged = mergeEnvironment(readEnvironmentFile(PROJECT_ENV_PATH), readEnvironmentFile(PARENT_ENV_PATH));
  const sponsorKey = process.env.STUDIO_DEV_PRIVATE_KEY
    || process.env.GENLAYER_PRIVATE_KEY
    || merged.STUDIO_DEV_PRIVATE_KEY
    || merged.GENLAYER_PRIVATE_KEY
    || merged.STUDIONET_PRIVATE_KEY;
  const contractorKey = process.env.STUDIO_DEV_CONTRACTOR_PRIVATE_KEY
    || merged.STUDIO_DEV_CONTRACTOR_PRIVATE_KEY
    || merged.STUDIONET_CONTRACTOR_PRIVATE_KEY
    || merged.STUDIONET_DELEGATE_PRIVATE_KEY
    || merged.STUDIONET_INTEGRATOR_PRIVATE_KEY;
  return {
    sponsorKey: sponsorKey || null,
    contractorKey: contractorKey || null,
    presence: {
      sponsorSigner: Boolean(sponsorKey),
      contractorSigner: Boolean(contractorKey),
      projectEnvironment: existsSync(PROJECT_ENV_PATH),
      parentEnvironment: existsSync(PARENT_ENV_PATH),
      processOverride: Boolean(process.env.STUDIO_DEV_PRIVATE_KEY || process.env.GENLAYER_PRIVATE_KEY),
    },
  };
}


function checkedPrivateKey(value, role) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{64}$/u.test(value)) {
    throw new Error(`${role} signer is absent or malformed; no key value was printed.`);
  }
  return value;
}


export function parseDepends(sourceText) {
  for (const line of sourceText.split(/\r?\n/u).slice(0, 8)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("#")) continue;
    try {
      const value = JSON.parse(trimmed.slice(1).trim());
      if (typeof value.Depends === "string" && value.Depends) return value.Depends;
    } catch {
      // A version pragma is allowed before the Depends JSON comment.
    }
  }
  throw new Error("Contract Depends header was not found in the first eight lines.");
}


function formatGen(value) {
  const amount = BigInt(value);
  const whole = amount / GEN;
  const remainder = amount % GEN;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(18, "0").replace(/0+$/u, "")}`;
}


function field(value, snake, camel = snake) {
  return value?.[snake] ?? value?.[camel];
}


function receiptStatus(receipt) {
  return receipt?.statusName ?? receipt?.status_name ?? receipt?.status ?? null;
}


function executionResult(receipt) {
  const normalized = receipt?.txExecutionResultName ?? receipt?.executionResultName;
  if (normalized) return normalized;
  const leaders = receipt?.consensus_data?.leader_receipt;
  const raw = Array.isArray(leaders) && leaders[0] ? leaders[0].execution_result : receipt?.execution_result;
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") return raw.result ?? raw.name ?? raw.status ?? null;
  return null;
}


function consensusResult(receipt) {
  return receipt?.resultName ?? receipt?.result_name ?? receipt?.result ?? null;
}


function contractAddressFromReceipt(receipt) {
  const candidates = [
    receipt?.contractAddress,
    receipt?.contract_address,
    receipt?.data?.contract_address,
    receipt?.data?.contractAddress,
    receipt?.txDataDecoded?.contractAddress,
  ];
  return candidates.find((value) => typeof value === "string" && /^0x[a-fA-F0-9]{40}$/u.test(value));
}


function feeAccounting(receipt) {
  const candidate = receipt?.feeAccounting ?? receipt?.fee_accounting ?? receipt?.data?.feeAccounting ?? receipt?.data?.fee_accounting;
  return candidate && typeof candidate === "object" ? candidate : null;
}


function optionalBigInt(value) {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
    if (typeof value === "string" && /^\d+$/u.test(value)) return BigInt(value);
  } catch {
    return undefined;
  }
  return undefined;
}


export function safeReceiptProjection(receipt, label, fallbackHash) {
  const accounting = feeAccounting(receipt);
  const paid = optionalBigInt(accounting?.paid_fee_value);
  const refunded = optionalBigInt(accounting?.total_refunded);
  const actual = paid === undefined ? undefined : paid - (refunded ?? 0n);
  return {
    label,
    transactionHash: receipt?.hash ?? receipt?.transactionHash ?? fallbackHash ?? null,
    status: receiptStatus(receipt),
    executionResult: executionResult(receipt),
    consensusResult: consensusResult(receipt),
    contractAddress: contractAddressFromReceipt(receipt) ?? null,
    fee: {
      actualGEN: actual === undefined ? null : formatGen(actual),
      refundedGEN: refunded === undefined ? null : formatGen(refunded),
    },
  };
}


export function deploymentDecision(existing, current) {
  if (!existing) return "DEPLOY";
  const identical = IDENTITY_KEYS.every((key) => existing[key] === current[key]);
  if (identical && existing.active === true && existing.result === "SUCCESS" && existing.contractAddress) return "RESUME";
  if (existing.active === false && existing.result === "ABANDONED_TESTNET") return "REPLACE";
  return "REFUSE";
}


export function valueForAction(action) {
  if (action === "CREATE") return 2n * GEN;
  if (action === "OPEN_CLOSEOUT") return GEN;
  return 0n;
}


export function nextLifecycleAction(state) {
  const agreement = state?.agreement;
  const closeout = state?.closeout;
  if (!agreement) return "CREATE";
  if (agreement.state === "DRAFT") return "RATIFY";
  if (["ACTIVE", "RETRYABLE"].includes(agreement.state)) return "REVIEW";
  if (agreement.state === "NEGOTIATION" && !agreement.hasProposal) return "PROPOSE";
  if (agreement.state === "NEGOTIATION") return "ACCEPT";
  if (agreement.state === "SETTLED" && agreement.contractorCreditGEN !== "0") return "WITHDRAW_CONTRACTOR";
  if (agreement.state === "SETTLED" && agreement.sponsorCreditGEN !== "0") return "WITHDRAW_SPONSOR";
  if (agreement.state !== "CLOSED") return "STOP_INCONSISTENT";
  if (!closeout) return "OPEN_CLOSEOUT";
  if (closeout.state === "OFFERED") return "RATIFY_CLOSEOUT";
  if (["ACTIVE", "RETRYABLE"].includes(closeout.state)) return "REVIEW_CLOSEOUT";
  if (closeout.state === "NEGOTIATION" && !closeout.hasProposal) return "PROPOSE_CLOSEOUT";
  if (closeout.state === "NEGOTIATION") return "ACCEPT_CLOSEOUT";
  if (closeout.state === "SETTLED" && closeout.contractorCreditGEN !== "0") return "WITHDRAW_CLOSEOUT_CONTRACTOR";
  if (closeout.state === "SETTLED" && closeout.sponsorCreditGEN !== "0") return "WITHDRAW_CLOSEOUT_SPONSOR";
  if (closeout.state === "CLOSED") return "COMPLETE";
  return "STOP_INCONSISTENT";
}


function requireTransactionApproval() {
  if (process.env[TRANSACTION_APPROVAL] !== "1") {
    throw new Error(`Refusing Studio Dev write: set ${TRANSACTION_APPROVAL}=1 only after action-time user approval.`);
  }
}


function requireCommittedContract() {
  try {
    execFileSync("git", ["diff", "--quiet", "HEAD", "--", "contracts/scopeseal_accord.py"], { cwd: PROJECT_ROOT });
  } catch {
    throw new Error("Refusing deployment: contract source must be committed so deployment identity binds an exact commit.");
  }
}


async function sdk() {
  const [{ createAccount, createClient, isSuccessful }, { studioDevnet }] = await Promise.all([
    import("genlayer-js-rc"),
    import("genlayer-js-rc/chains"),
  ]);
  return { createAccount, createClient, isSuccessful, studioDevnet };
}


async function roleClients(requireContractor = false) {
  const environment = loadAuthorizedEnvironment();
  const { createAccount, createClient, isSuccessful, studioDevnet } = await sdk();
  const sponsorAccount = createAccount(checkedPrivateKey(environment.sponsorKey, "Sponsor"));
  const contractorAccount = environment.contractorKey
    ? createAccount(checkedPrivateKey(environment.contractorKey, "Contractor"))
    : null;
  if (requireContractor && !contractorAccount) throw new Error("Contractor signer is required for the full lifecycle.");
  return {
    environment,
    isSuccessful,
    sponsorAccount,
    contractorAccount,
    readClient: createClient({ chain: studioDevnet }),
    sponsorClient: createClient({ chain: studioDevnet, account: sponsorAccount }),
    contractorClient: contractorAccount ? createClient({ chain: studioDevnet, account: contractorAccount }) : null,
  };
}


async function rpc(method, params = []) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`${method} HTTP request failed.`);
  const body = await response.json();
  if (body.error) throw new Error(`${method} RPC request failed (${body.error.code}).`);
  return body.result;
}


async function verifyChain() {
  const chainId = await rpc("eth_chainId");
  if (chainId !== CHAIN_ID_HEX) throw new Error("Studio Dev RPC returned an unexpected chain ID.");
  return CHAIN_ID;
}


function currentIdentity(sponsor, contractor) {
  const source = readFileSync(CONTRACT_PATH);
  return {
    network: "studio-dev",
    chainId: CHAIN_ID,
    rpc: RPC_URL,
    repositoryCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: PROJECT_ROOT, encoding: "utf8" }).trim(),
    sourceCommit: execFileSync("git", ["log", "-1", "--format=%H", "--", "contracts/scopeseal_accord.py"], { cwd: PROJECT_ROOT, encoding: "utf8" }).trim(),
    sourceSha256: createHash("sha256").update(source).digest("hex"),
    depends: parseDepends(source.toString("ascii")),
    contractApi: "ScopeSealAccord/3",
    sponsor,
    contractor,
  };
}


async function readView(client, address, functionName, args = []) {
  const value = await client.readContract({ address, functionName, args, jsonSafeReturn: true });
  if (typeof value === "string") {
    try { return jsonSafe(JSON.parse(value)); } catch { return value; }
  }
  return jsonSafe(value);
}


function normalizedAgreement(value) {
  if (!value || typeof value !== "object") return null;
  return {
    agreementId: field(value, "agreement_id", "agreementId"),
    state: field(value, "state"),
    verdict: field(value, "verdict") ?? "",
    attemptCount: Number(field(value, "attempt_count", "attemptCount") ?? 0),
    hasProposal: Boolean(field(value, "has_proposal", "hasProposal")),
    proposalNonce: Number(field(value, "proposal_nonce", "proposalNonce") ?? 0),
    lockedGEN: formatGen(field(value, "locked_amount", "lockedAmount") ?? 0),
    sponsorCreditGEN: formatGen(field(value, "sponsor_credit", "sponsorCredit") ?? 0),
    contractorCreditGEN: formatGen(field(value, "contractor_credit", "contractorCredit") ?? 0),
  };
}


function normalizedCloseout(value) {
  if (!value || typeof value !== "object") return null;
  return {
    agreementId: field(value, "agreement_id", "agreementId"),
    state: field(value, "state"),
    verdict: field(value, "verdict") ?? "",
    attemptCount: Number(field(value, "attempt_count", "attemptCount") ?? 0),
    hasProposal: Boolean(field(value, "has_proposal", "hasProposal")),
    proposalNonce: Number(field(value, "proposal_nonce", "proposalNonce") ?? 0),
    lockedGEN: formatGen(field(value, "locked_amount", "lockedAmount") ?? 0),
    sponsorCreditGEN: formatGen(field(value, "sponsor_credit", "sponsorCredit") ?? 0),
    contractorCreditGEN: formatGen(field(value, "contractor_credit", "contractorCredit") ?? 0),
  };
}


async function canonicalState(clients, deployment, agreementId = AGREEMENT_ID) {
  let agreement = null;
  let closeout = null;
  try { agreement = normalizedAgreement(await readView(clients.readClient, deployment.contractAddress, "get_agreement", [agreementId])); } catch { agreement = null; }
  try { closeout = normalizedCloseout(await readView(clients.readClient, deployment.contractAddress, "get_closeout", [agreementId])); } catch { closeout = null; }
  const accounting = await readView(clients.readClient, deployment.contractAddress, "get_accounting");
  return { agreement, closeout, accounting };
}


async function waitForFinalizedSuccess(client, isSuccessful, hash, label) {
  await client.waitForDecision({ hash, retries: 400, interval: 3_000, fullTransaction: true });
  const finalized = await client.waitForFinalization({ hash, retries: 400, interval: 3_000, fullTransaction: true });
  let succeeded = false;
  try { succeeded = isSuccessful(finalized); } catch { succeeded = false; }
  if (!succeeded && executionResult(finalized) !== "FINISHED_WITH_RETURN") {
    const safe = safeReceiptProjection(finalized, label, hash);
    throw new Error(`${label} finalized with execution failure (${safe.executionResult ?? "UNKNOWN"}).`);
  }
  return finalized;
}


function attemptsFile() {
  return readJson(ATTEMPTS_PATH, { network: "studio-dev", attempts: [] });
}


function updateAttempt(hash, patch) {
  const file = attemptsFile();
  const index = file.attempts.findIndex((attempt) => attempt.transactionHash === hash);
  if (index < 0) file.attempts.push({ transactionHash: hash, ...patch });
  else file.attempts[index] = { ...file.attempts[index], ...patch };
  writeJson(ATTEMPTS_PATH, file);
}


async function inspection(clients) {
  const existing = readJson(DEPLOYMENT_PATH, undefined);
  const identity = currentIdentity(clients.sponsorAccount.address, clients.contractorAccount?.address ?? null);
  const quote = await clients.readClient.estimateTransactionFees();
  const result = {
    observedAt: new Date().toISOString(),
    network: "studio-dev",
    chainId: await verifyChain(),
    signerPresence: clients.environment.presence,
    sponsor: clients.sponsorAccount.address,
    sponsorBalanceGEN: formatGen(await clients.readClient.getBalance({ address: clients.sponsorAccount.address })),
    contractor: clients.contractorAccount?.address ?? null,
    contractorBalanceGEN: clients.contractorAccount
      ? formatGen(await clients.readClient.getBalance({ address: clients.contractorAccount.address }))
      : null,
    currentDefaultMaximumFeeGEN: formatGen(quote.feeValue),
    feePolicyEnabled: Boolean(quote.policy.enabled),
    deploymentDecision: deploymentDecision(existing, identity),
    deployment: existing ? {
      active: existing.active,
      result: existing.result,
      contractAddress: existing.contractAddress,
      transactionHash: existing.transactionHash,
      sourceCommit: existing.sourceCommit,
      sourceSha256: existing.sourceSha256,
    } : null,
  };
  if (existing?.contractAddress) {
    result.contractCodePresent = (await clients.readClient.getContractCode(existing.contractAddress)).length > 2;
    result.contractBalanceGEN = formatGen(await clients.readClient.getBalance({ address: existing.contractAddress }));
    result.canonical = await canonicalState(clients, existing);
  }
  return { existing, identity, result };
}


async function inspect() {
  const clients = await roleClients(false);
  const { result } = await inspection(clients);
  console.log(JSON.stringify(result, null, 2));
}


async function finalizeDeployment(clients, identity, hash, maximumFeeGEN = null) {
  const finalized = await waitForFinalizedSuccess(clients.sponsorClient, clients.isSuccessful, hash, "deploy");
  const contractAddress = contractAddressFromReceipt(finalized);
  if (!contractAddress) throw new Error("Successful deployment receipt did not expose a contract address.");
  const code = await clients.readClient.getContractCode(contractAddress);
  if (typeof code !== "string" || code.length <= 2) throw new Error("Deployed contract code could not be verified.");
  const deployment = {
    ...identity,
    active: true,
    result: "SUCCESS",
    contractAddress,
    transactionHash: hash,
    transactionExplorer: `${EXPLORER_URL}/tx/${hash}`,
    contractExplorer: `${EXPLORER_URL}/address/${contractAddress}`,
    finalizedAt: new Date().toISOString(),
    maximumFeeGEN,
    receipt: safeReceiptProjection(finalized, "deploy", hash),
  };
  updateAttempt(hash, { status: "FINALIZED", result: "SUCCESS", finalizedAt: deployment.finalizedAt, contractAddress, receipt: deployment.receipt });
  writeJson(DEPLOYMENT_PATH, deployment);
  console.log(JSON.stringify({ Result: "SUCCESS", contractAddress, transactionHash: hash, explorer: deployment.contractExplorer }, null, 2));
}


async function deploy() {
  requireTransactionApproval();
  requireCommittedContract();
  const clients = await roleClients(false);
  const { existing, identity, result } = await inspection(clients);
  console.log(JSON.stringify({ inspect: result }, null, 2));
  const decision = deploymentDecision(existing, identity);
  if (decision === "RESUME") {
    console.log(JSON.stringify({ Result: "SUCCESS", resumed: true, contractAddress: existing.contractAddress }, null, 2));
    return;
  }
  if (decision === "REFUSE") throw new Error("Existing Studio Dev deployment identity differs; archive or mark a broken revision abandoned before replacement.");
  const pending = [...attemptsFile().attempts].reverse().find((attempt) =>
    attempt.sourceSha256 === identity.sourceSha256
    && attempt.sponsor === identity.sponsor
    && ["SUBMITTED", "DECIDED"].includes(attempt.status));
  if (pending) {
    await finalizeDeployment(clients, identity, pending.transactionHash, pending.maximumFeeGEN ?? null);
    return;
  }
  await clients.sponsorClient.initializeConsensusSmartContract();
  const estimate = await clients.sponsorClient.estimateTransactionFees();
  const maximumFeeGEN = formatGen(estimate.feeValue);
  const hash = await clients.sponsorClient.deployContract({
    code: new Uint8Array(readFileSync(CONTRACT_PATH)),
    args: [],
    fees: { distribution: estimate.distribution, messageAllocations: estimate.messageAllocations, feeValue: estimate.feeValue },
  });
  updateAttempt(hash, { ...identity, status: "SUBMITTED", submittedAt: new Date().toISOString(), maximumFeeGEN });
  console.log(JSON.stringify({ stage: "SUBMITTED", label: "deploy", maximumFeeGEN, transactionHash: hash }, null, 2));
  await finalizeDeployment(clients, identity, hash, maximumFeeGEN);
}


function lifecycleFile(deployment, clients) {
  const existing = readJson(LIFECYCLE_PATH, undefined);
  if (existing) return existing;
  return {
    network: "studio-dev",
    chainId: CHAIN_ID,
    agreementId: AGREEMENT_ID,
    contractAddress: deployment.contractAddress,
    sponsor: clients.sponsorAccount.address,
    contractor: clients.contractorAccount.address,
    originalPublication: "00190662-2025",
    modificationPublication: "00587863-2026",
    completionPublication: "00734925-2025",
    applicationValueGEN: { agreement: "2", closeout: "1" },
    pendingTransaction: null,
    transactions: [],
  };
}


function actorClient(clients, actor) {
  if (actor === "sponsor") return clients.sponsorClient;
  if (actor === "contractor" && clients.contractorClient) return clients.contractorClient;
  throw new Error("Authorized lifecycle actor is unavailable.");
}


async function reconcilePending(file, clients, deployment) {
  if (!file.pendingTransaction) return canonicalState(clients, deployment, file.agreementId);
  const pending = file.pendingTransaction;
  const client = actorClient(clients, pending.actor);
  const finalized = await waitForFinalizedSuccess(client, clients.isSuccessful, pending.transactionHash, pending.action);
  const after = await canonicalState(clients, deployment, file.agreementId);
  file.transactions.push({
    ...pending,
    status: "FINALIZED",
    finalizedAt: new Date().toISOString(),
    receipt: safeReceiptProjection(finalized, pending.action, pending.transactionHash),
    explorer: `${EXPLORER_URL}/tx/${pending.transactionHash}`,
    canonicalAfter: after,
  });
  file.pendingTransaction = null;
  writeJson(LIFECYCLE_PATH, file);
  return after;
}


async function lifecycleWrite({ file, clients, deployment, action, actor, functionName, args }) {
  const client = actorClient(clients, actor);
  const value = valueForAction(action);
  await client.initializeConsensusSmartContract();
  const estimate = await client.estimateTransactionFeesForWrite({
    address: deployment.contractAddress,
    functionName,
    args,
    value,
  });
  const maximumFeeGEN = formatGen(estimate.feeValue);
  const hash = await client.writeContract({
    address: deployment.contractAddress,
    functionName,
    args,
    value,
    fees: { distribution: estimate.distribution, messageAllocations: estimate.messageAllocations, feeValue: estimate.feeValue },
  });
  file.pendingTransaction = {
    action,
    actor,
    functionName,
    transactionHash: hash,
    submittedAt: new Date().toISOString(),
    applicationValueGEN: formatGen(value),
    maximumFeeGEN,
  };
  writeJson(LIFECYCLE_PATH, file);
  console.log(JSON.stringify({ stage: "SUBMITTED", action, actor, applicationValueGEN: formatGen(value), maximumFeeGEN, transactionHash: hash }, null, 2));
  return reconcilePending(file, clients, deployment);
}


function createArguments(file) {
  const now = Date.now();
  const iso = (offset) => new Date(now + offset).toISOString().replace(/\.\d{3}Z$/u, "Z");
  return [
    file.agreementId,
    file.contractor,
    file.originalPublication,
    "6480e4d5-6f07-4b83-8097-5756d8fbf527",
    "01",
    "3267368TH",
    "7f56490a-c5ba-4922-853b-07b18b0d14c1",
    "417379",
    "Deliver the procurement scope described by the original official TED contract notice.",
    "Additions or omissions remain within baseline only when they preserve the original purpose, capability set, and material delivery boundary.",
    iso(60 * 60 * 1000),
    iso(24 * 60 * 60 * 1000),
    3600,
  ];
}


function closeoutArguments(file) {
  const now = Date.now();
  const iso = (offset) => new Date(now + offset).toISOString().replace(/\.\d{3}Z$/u, "Z");
  return [
    file.agreementId,
    "LOT-0001",
    "Release retention when the official completion notice confirms final payment and no penalty.",
    iso(60 * 60 * 1000),
    iso(2 * 60 * 60 * 1000),
    3600,
  ];
}


async function currentAttempt(clients, deployment, state, closeout = false) {
  const item = closeout ? state.closeout : state.agreement;
  if (!item || item.attemptCount < 1) return null;
  const functionName = closeout ? "get_closeout_attempt" : "get_review_attempt";
  return readView(clients.readClient, deployment.contractAddress, functionName, [AGREEMENT_ID, item.attemptCount]);
}


async function lifecycle() {
  requireTransactionApproval();
  const clients = await roleClients(true);
  const deployment = readJson(DEPLOYMENT_PATH, undefined);
  if (!deployment?.active || deployment.result !== "SUCCESS") throw new Error("No active successful Studio Dev deployment exists.");
  const identity = currentIdentity(clients.sponsorAccount.address, clients.contractorAccount.address);
  if (deploymentDecision(deployment, identity) !== "RESUME") throw new Error("Deployment identity does not match current committed source and actor pair.");
  const file = lifecycleFile(deployment, clients);
  if (file.contractAddress !== deployment.contractAddress || file.sponsor !== identity.sponsor || file.contractor !== identity.contractor) {
    throw new Error("Lifecycle evidence belongs to a different deployment or actor pair.");
  }
  let state = await reconcilePending(file, clients, deployment);
  for (let step = 0; step < 20; step += 1) {
    const action = nextLifecycleAction(state);
    if (action === "REVIEW" && state.agreement?.state === "RETRYABLE") {
      const attempt = await currentAttempt(clients, deployment, state);
      file.finalCanonical = { ...state, currentAttempt: attempt };
      writeJson(LIFECYCLE_PATH, file);
      console.log(JSON.stringify({ Result: "RETRYABLE_REQUIRES_DIAGNOSIS", agreementId: file.agreementId, attemptNumber: state.agreement.attemptCount }, null, 2));
      return;
    }
    if (action === "REVIEW_CLOSEOUT" && state.closeout?.state === "RETRYABLE") {
      const attempt = await currentAttempt(clients, deployment, state, true);
      file.finalCanonical = { ...state, currentCloseoutAttempt: attempt };
      writeJson(LIFECYCLE_PATH, file);
      console.log(JSON.stringify({ Result: "CLOSEOUT_RETRYABLE_REQUIRES_DIAGNOSIS", agreementId: file.agreementId, attemptNumber: state.closeout.attemptCount }, null, 2));
      return;
    }
    if (action === "CREATE") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "create_agreement", args: createArguments(file) });
    else if (action === "RATIFY") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "ratify_agreement", args: [file.agreementId] });
    else if (action === "REVIEW") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "request_review", args: [file.agreementId, file.modificationPublication] });
    else if (action === "PROPOSE") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "propose_split", args: [file.agreementId, 1] });
    else if (action === "ACCEPT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "accept_split", args: [file.agreementId, state.agreement.proposalNonce] });
    else if (action === "WITHDRAW_CONTRACTOR") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "withdraw_credit", args: [file.agreementId] });
    else if (action === "WITHDRAW_SPONSOR") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "withdraw_credit", args: [file.agreementId] });
    else if (action === "OPEN_CLOSEOUT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "open_closeout", args: closeoutArguments(file) });
    else if (action === "RATIFY_CLOSEOUT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "ratify_closeout", args: [file.agreementId] });
    else if (action === "REVIEW_CLOSEOUT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "request_closeout_review", args: [file.agreementId, file.completionPublication] });
    else if (action === "PROPOSE_CLOSEOUT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "propose_closeout_split", args: [file.agreementId, 1] });
    else if (action === "ACCEPT_CLOSEOUT") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "accept_closeout_split", args: [file.agreementId, state.closeout.proposalNonce] });
    else if (action === "WITHDRAW_CLOSEOUT_CONTRACTOR") state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "withdraw_closeout_credit", args: [file.agreementId] });
    else if (action === "WITHDRAW_CLOSEOUT_SPONSOR") state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "withdraw_closeout_credit", args: [file.agreementId] });
    else if (action === "COMPLETE") {
      file.completedAt = new Date().toISOString();
      file.finalCanonical = state;
      writeJson(LIFECYCLE_PATH, file);
      console.log(JSON.stringify({ Result: "SUCCESS", agreementId: file.agreementId, agreementState: "CLOSED", closeoutState: "CLOSED", transactionCount: file.transactions.length }, null, 2));
      return;
    } else throw new Error(`Canonical lifecycle is inconsistent (${state.agreement?.state ?? "missing"}/${state.closeout?.state ?? "none"}).`);
  }
  throw new Error("Studio Dev lifecycle exceeded the bounded twenty-step limit.");
}


async function main() {
  const command = process.argv[2] ?? "inspect";
  if (command === "inspect") await inspect();
  else if (command === "deploy") await deploy();
  else if (command === "lifecycle") await lifecycle();
  else throw new Error("Usage: node scripts/studio-dev.mjs <inspect|deploy|lifecycle>");
}


if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Studio Dev operation failure.";
    console.error(`Studio Dev operation stopped: ${message}`);
    process.exitCode = 1;
  });
}
