import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTRACT_PATH = join(PROJECT_ROOT, "contracts", "scopeseal_accord.py");
const PROJECT_ENV_PATH = join(PROJECT_ROOT, ".env");
const PARENT_ENV_PATH = join(PROJECT_ROOT, "..", ".env");
const EVIDENCE_DIR = join(PROJECT_ROOT, "docs", "evidence", "studionet");
const DEPLOYMENT_PATH = join(EVIDENCE_DIR, "deployment.json");
const DEPLOYMENT_ATTEMPTS_PATH = join(EVIDENCE_DIR, "deployment-attempts.json");
const LIFECYCLE_PATH = join(EVIDENCE_DIR, "lifecycle.json");
const ARCHIVE_DIR = join(EVIDENCE_DIR, "archive");
const RPC_URL = "https://studio.genlayer.com/api";
const EXPLORER_URL = "https://explorer-studio.genlayer.com";
const CHAIN_ID = 61999;
const GEN = 10n ** 18n;
const IDENTITY_KEYS = [
  "network", "chainId", "sourceCommit", "sourceSha256", "depends", "contractApi", "sponsor", "contractor",
];
const AGREEMENT_ID = "scopeseal-official-001";


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
  const sponsorKey = merged.STUDIONET_PRIVATE_KEY || merged.GENLAYER_PRIVATE_KEY;
  const contractorKey = merged.STUDIONET_CONTRACTOR_PRIVATE_KEY
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
    },
  };
}


function checkedPrivateKey(value, role) {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{64}$/u.test(value)) {
    throw new Error(`${role} signer is absent or malformed; no key value was printed.`);
  }
  return value;
}


function field(value, snake, camel = snake) {
  return value?.[snake] ?? value?.[camel];
}


function leaderExecution(receipt) {
  if (receipt?.execution_result !== undefined) return receipt.execution_result;
  const leaders = receipt?.consensus_data?.leader_receipt;
  return Array.isArray(leaders) && leaders[0] ? leaders[0].execution_result : undefined;
}


function receiptStatus(receipt) {
  if (receipt?.statusName) return receipt.statusName;
  if (receipt?.status_name) return receipt.status_name;
  if (receipt?.status === 7) return "FINALIZED";
  if (receipt?.status === 5) return "ACCEPTED";
  return receipt?.status ?? null;
}


function consensusResult(receipt) {
  if (receipt?.resultName) return receipt.resultName;
  if (receipt?.result_name) return receipt.result_name;
  if (receipt?.result === 6) return "MAJORITY_AGREE";
  return receipt?.result ?? null;
}


function executionResult(receipt) {
  const normalized = receipt?.txExecutionResultName ?? receipt?.executionResultName;
  if (normalized) return normalized;
  const raw = leaderExecution(receipt);
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") return raw.result ?? raw.name ?? raw.status ?? null;
  return null;
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


export function safeReceiptProjection(receipt, label, fallbackHash) {
  return {
    label,
    transactionHash: receipt?.hash ?? receipt?.transactionHash ?? fallbackHash ?? null,
    status: receiptStatus(receipt),
    txExecutionResult: executionResult(receipt),
    consensusResult: consensusResult(receipt),
    contractAddress: contractAddressFromReceipt(receipt) ?? null,
  };
}


export function isSuccessfulFinalizedReceipt(receipt) {
  if (receiptStatus(receipt) !== "FINALIZED") return false;
  const execution = executionResult(receipt);
  if (execution === "FINISHED_WITH_RETURN") return true;
  return execution === "SUCCESS" && consensusResult(receipt) === "MAJORITY_AGREE";
}


export function valueForCreateAgreement() {
  return 2n * GEN;
}


export function deploymentDecision(existing, current) {
  if (!existing) return "DEPLOY";
  if (existing.active === false && existing.result === "RETIRED" && existing.remainingAccountingZero === true) {
    return "REPLACE";
  }
  if (
    existing.active === false
    && existing.result === "QUARANTINED"
    && existing.recoveryPending === true
    && existing.closePathDefined === true
  ) {
    return "REPLACE";
  }
  const identical = IDENTITY_KEYS.every((key) => existing[key] === current[key]);
  if (identical && existing.active === true && existing.result === "SUCCESS" && existing.contractAddress) return "RESUME";
  return "REFUSE";
}


export function selectNextLifecycleAction(state) {
  if (!state) return "CREATE";
  if (state.state === "DRAFT") return "RATIFY";
  if (["ACTIVE", "RETRYABLE"].includes(state.state)) return "REVIEW";
  if (state.state === "NEGOTIATION" && !state.hasProposal) return "PROPOSE";
  if (state.state === "NEGOTIATION" && state.hasProposal) return "ACCEPT";
  if (state.state === "SETTLED" && Number(state.contractorCreditGen) > 0) return "WITHDRAW_CONTRACTOR";
  if (state.state === "SETTLED" && Number(state.sponsorCreditGen) > 0) return "WITHDRAW_SPONSOR";
  if (state.state === "CLOSED") return "COMPLETE";
  return "STOP_INCONSISTENT";
}


export function retryDecision(agreement, attempt) {
  if (agreement?.state !== "RETRYABLE" || !attempt) return "REFUSE_STATE";
  if (Number(attempt.attemptNumber) !== Number(agreement.attemptCount)) return "REFUSE_MISMATCH";
  if (attempt.sourceStatus === "UNAVAILABLE") return "RETRY_TRANSIENT";
  return "REFUSE_STRUCTURAL";
}


export function retirementDecision(agreement, accounting, now = new Date().toISOString()) {
  if (!agreement || !accounting) return { action: "REFUSE_NONZERO" };
  if (agreement.state === "CLOSED") {
    const keys = ["received_gen", "locked_gen", "credited_gen", "withdrawn_gen"];
    if (keys.some((key) => accounting[key] === undefined || accounting[key] === null)) {
      return { action: "REFUSE_NONZERO" };
    }
    const received = BigInt(accounting.received_gen);
    const locked = BigInt(accounting.locked_gen);
    const credited = BigInt(accounting.credited_gen);
    const withdrawn = BigInt(accounting.withdrawn_gen);
    return locked === 0n && credited === 0n && received === withdrawn
      ? { action: "ARCHIVE" }
      : { action: "REFUSE_NONZERO" };
  }
  if (agreement.state === "SETTLED") {
    if (Number(agreement.contractorCreditGen) > 0) return { action: "WITHDRAW_CONTRACTOR" };
    if (Number(agreement.sponsorCreditGen) > 0) return { action: "WITHDRAW_SPONSOR" };
    return { action: "REFUSE_NONZERO" };
  }
  if (["DRAFT", "ACTIVE", "RETRYABLE", "NEGOTIATION"].includes(agreement.state)) {
    const availableAt = agreement.state === "DRAFT"
      ? agreement.ratifyDeadline
      : agreement.state === "NEGOTIATION"
        ? agreement.negotiationDeadline
        : agreement.reviewDeadline;
    if (!availableAt) return { action: "REFUSE_NONZERO" };
    return Date.parse(now) >= Date.parse(availableAt)
      ? { action: "RECOVER", availableAt }
      : { action: "WAIT", availableAt };
  }
  return { action: "REFUSE_NONZERO" };
}


export function quarantineDecision(agreement, accounting, attempt) {
  if (
    agreement?.state !== "RETRYABLE"
    || !agreement.reviewDeadline
    || Number(attempt?.attemptNumber) !== Number(agreement.attemptCount)
    || attempt?.sourceStatus !== "UNAVAILABLE"
    || attempt?.aggregateVerdict !== "UNVERIFIABLE"
  ) {
    return { action: "REFUSE" };
  }
  const received = BigInt(accounting?.received_gen ?? -1);
  const locked = BigInt(accounting?.locked_gen ?? -1);
  const credited = BigInt(accounting?.credited_gen ?? -1);
  const withdrawn = BigInt(accounting?.withdrawn_gen ?? -1);
  if (received !== 2n || locked !== 2n || credited !== 0n || withdrawn !== 0n) {
    return { action: "REFUSE" };
  }
  return { action: "QUARANTINE", recoveryAvailableAt: agreement.reviewDeadline };
}


async function sdk() {
  const [{ createAccount, createClient }, { studionet }, { TransactionStatus }] = await Promise.all([
    import("genlayer-js"),
    import("genlayer-js/chains"),
    import("genlayer-js/types"),
  ]);
  return { createAccount, createClient, studionet, TransactionStatus };
}


async function roleClients(requireContractor = true) {
  const environment = loadAuthorizedEnvironment();
  const { createAccount, createClient, studionet, TransactionStatus } = await sdk();
  const sponsorAccount = createAccount(checkedPrivateKey(environment.sponsorKey, "Sponsor"));
  const contractorAccount = environment.contractorKey
    ? createAccount(checkedPrivateKey(environment.contractorKey, "Contractor"))
    : null;
  if (requireContractor && !contractorAccount) {
    throw new Error("Contractor signer is not configured; an existing authorized second EOA is required.");
  }
  if (contractorAccount && contractorAccount.address.toLowerCase() === sponsorAccount.address.toLowerCase()) {
    throw new Error("Sponsor and contractor signers must be distinct EOAs.");
  }
  return {
    environment,
    TransactionStatus,
    readClient: createClient({ chain: studionet }),
    sponsorAccount,
    contractorAccount,
    sponsorClient: createClient({ chain: studionet, account: sponsorAccount }),
    contractorClient: contractorAccount ? createClient({ chain: studionet, account: contractorAccount }) : null,
  };
}


async function rpc(method, params) {
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
  const result = await rpc("eth_chainId", []);
  if (result !== "0xf22f") throw new Error("Studionet RPC returned an unexpected chain ID.");
  return CHAIN_ID;
}


function formatGen(value) {
  const amount = BigInt(value);
  const whole = amount / GEN;
  const remainder = amount % GEN;
  if (remainder === 0n) return whole.toString();
  return `${whole}.${remainder.toString().padStart(18, "0").replace(/0+$/u, "")}`;
}


function currentIdentity(sponsor, contractor) {
  const source = readFileSync(CONTRACT_PATH);
  const firstLine = source.toString("ascii").split(/\r?\n/u, 1)[0];
  const depends = JSON.parse(firstLine.slice(1).trim()).Depends;
  return {
    network: "studionet",
    chainId: CHAIN_ID,
    rpc: RPC_URL,
    repositoryCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: PROJECT_ROOT, encoding: "utf8" }).trim(),
    sourceCommit: execFileSync("git", ["log", "-1", "--format=%H", "--", "contracts/scopeseal_accord.py"], { cwd: PROJECT_ROOT, encoding: "utf8" }).trim(),
    sourceSha256: createHash("sha256").update(source).digest("hex"),
    depends,
    contractApi: "ScopeSealAccord/1",
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
    sponsor: field(value, "sponsor"),
    contractor: field(value, "contractor"),
    state: field(value, "state"),
    verdict: field(value, "verdict"),
    attemptCount: Number(field(value, "attempt_count", "attemptCount") ?? 0),
    modificationPublication: field(value, "modification_publication", "modificationPublication") ?? "",
    ratifyDeadline: field(value, "ratify_deadline", "ratifyDeadline") ?? "",
    reviewDeadline: field(value, "review_deadline", "reviewDeadline") ?? "",
    negotiationDeadline: field(value, "negotiation_deadline", "negotiationDeadline") ?? "",
    proposalNonce: Number(field(value, "proposal_nonce", "proposalNonce") ?? 0),
    hasProposal: Boolean(field(value, "has_proposal", "hasProposal")),
    lockedGen: Number(BigInt(field(value, "locked_amount", "lockedAmount") ?? 0) / GEN),
    sponsorCreditGen: Number(BigInt(field(value, "sponsor_credit", "sponsorCredit") ?? 0) / GEN),
    contractorCreditGen: Number(BigInt(field(value, "contractor_credit", "contractorCredit") ?? 0) / GEN),
  };
}


async function canonicalState(clients, deployment) {
  try {
    const agreement = normalizedAgreement(await readView(clients.readClient, deployment.contractAddress, "get_agreement", [AGREEMENT_ID]));
    const accounting = await readView(clients.readClient, deployment.contractAddress, "get_accounting");
    return { agreement, accounting };
  } catch {
    return { agreement: null, accounting: await readView(clients.readClient, deployment.contractAddress, "get_accounting") };
  }
}


async function waitForAcceptedAndFinalized(client, TransactionStatus, hash, label) {
  const accepted = await client.waitForTransactionReceipt({
    hash, status: TransactionStatus.ACCEPTED, retries: 200, interval: 3_000,
  });
  await client.waitForTransactionReceipt({
    hash, status: TransactionStatus.FINALIZED, retries: 400, interval: 3_000,
  });
  const finalized = await client.getTransaction({ hash });
  if (!isSuccessfulFinalizedReceipt(finalized)) {
    const safe = safeReceiptProjection(finalized, label, hash);
    throw new Error(`${label} finalized unexpectedly (${safe.status}/${safe.txExecutionResult}/${safe.consensusResult}).`);
  }
  return { accepted, finalized };
}


function deploymentAttempts() {
  return readJson(DEPLOYMENT_ATTEMPTS_PATH, { network: "studionet", attempts: [] });
}


function updateDeploymentAttempt(hash, patch) {
  const file = deploymentAttempts();
  const index = file.attempts.findIndex((attempt) => attempt.transactionHash === hash);
  if (index < 0) file.attempts.push({ transactionHash: hash, ...patch });
  else file.attempts[index] = { ...file.attempts[index], ...patch };
  writeJson(DEPLOYMENT_ATTEMPTS_PATH, file);
}


async function inspection(clients) {
  const existing = readJson(DEPLOYMENT_PATH, undefined);
  const identity = currentIdentity(clients.sponsorAccount.address, clients.contractorAccount?.address ?? null);
  const result = {
    observedAt: new Date().toISOString(),
    network: "studionet",
    chainId: await verifyChain(),
    signerPresence: clients.environment.presence,
    sponsor: clients.sponsorAccount.address,
    sponsorBalanceGEN: formatGen(await clients.readClient.getBalance({ address: clients.sponsorAccount.address })),
    contractor: clients.contractorAccount?.address ?? null,
    contractorBalanceGEN: clients.contractorAccount
      ? formatGen(await clients.readClient.getBalance({ address: clients.contractorAccount.address }))
      : null,
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


async function finalizeDeployment(clients, identity, hash) {
  const { accepted, finalized } = await waitForAcceptedAndFinalized(
    clients.sponsorClient, clients.TransactionStatus, hash, "deploy",
  );
  updateDeploymentAttempt(hash, {
    status: "ACCEPTED",
    acceptedAt: new Date().toISOString(),
    acceptedReceipt: safeReceiptProjection(accepted, "deploy", hash),
  });
  const contractAddress = contractAddressFromReceipt(finalized) ?? contractAddressFromReceipt(accepted);
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
    receipt: safeReceiptProjection(finalized, "deploy", hash),
  };
  updateDeploymentAttempt(hash, {
    status: "FINALIZED", result: "SUCCESS", finalizedAt: deployment.finalizedAt,
    contractAddress, receipt: deployment.receipt,
  });
  writeJson(DEPLOYMENT_PATH, deployment);
  console.log(JSON.stringify({ Result: "SUCCESS", contractAddress, transactionHash: hash, explorer: deployment.contractExplorer }, null, 2));
  return deployment;
}


async function deploy() {
  const clients = await roleClients(true);
  const { existing, identity, result } = await inspection(clients);
  console.log(JSON.stringify({ inspect: result }, null, 2));
  const decision = deploymentDecision(existing, identity);
  if (decision === "RESUME") {
    console.log(JSON.stringify({ Result: "SUCCESS", resumed: true, contractAddress: existing.contractAddress }, null, 2));
    return;
  }
  if (decision === "REFUSE") throw new Error("Active deployment identity differs; archive and recover it before replacement.");
  const pending = [...deploymentAttempts().attempts].reverse().find((attempt) =>
    attempt.sourceSha256 === identity.sourceSha256
    && attempt.sponsor === identity.sponsor
    && ["SUBMITTED", "ACCEPTED"].includes(attempt.status));
  if (pending) {
    await finalizeDeployment(clients, identity, pending.transactionHash);
    return;
  }
  await clients.sponsorClient.initializeConsensusSmartContract();
  const hash = await clients.sponsorClient.deployContract({
    code: new Uint8Array(readFileSync(CONTRACT_PATH)), args: [],
  });
  updateDeploymentAttempt(hash, { ...identity, status: "SUBMITTED", submittedAt: new Date().toISOString() });
  console.log(JSON.stringify({ stage: "SUBMITTED", label: "deploy", transactionHash: hash }, null, 2));
  await finalizeDeployment(clients, identity, hash);
}


function lifecycleFile(deployment, clients) {
  const fresh = {
    network: "studionet",
    chainId: CHAIN_ID,
    agreementId: AGREEMENT_ID,
    contractAddress: deployment.contractAddress,
    sponsor: clients.sponsorAccount.address,
    contractor: clients.contractorAccount.address,
    originalPublication: "00190662-2025",
    modificationPublication: "00587863-2026",
    valueGEN: "2",
    pendingTransaction: null,
    transactions: [],
  };
  const existing = readJson(LIFECYCLE_PATH, undefined);
  return existing?.retired === true || existing?.archived === true ? fresh : (existing ?? fresh);
}


function archivePaths(contractAddress) {
  const directory = join(ARCHIVE_DIR, contractAddress.toLowerCase());
  return {
    directory,
    deployment: join(directory, "deployment.json"),
    lifecycle: join(directory, "lifecycle.json"),
    relative: `archive/${contractAddress.toLowerCase()}`,
  };
}


function actorClient(clients, actor) {
  if (actor === "sponsor") return clients.sponsorClient;
  if (actor === "contractor") return clients.contractorClient;
  throw new Error("Unknown lifecycle actor.");
}


async function reconcilePending(file, clients, deployment, lifecyclePath = LIFECYCLE_PATH) {
  if (!file.pendingTransaction) return canonicalState(clients, deployment);
  const pending = file.pendingTransaction;
  const client = actorClient(clients, pending.actor);
  const { finalized } = await waitForAcceptedAndFinalized(
    client, clients.TransactionStatus, pending.transactionHash, pending.action,
  );
  const after = await canonicalState(clients, deployment);
  file.transactions.push({
    ...pending,
    status: "FINALIZED",
    finalizedAt: new Date().toISOString(),
    receipt: safeReceiptProjection(finalized, pending.action, pending.transactionHash),
    explorer: `${EXPLORER_URL}/tx/${pending.transactionHash}`,
    canonicalAfter: after,
  });
  file.pendingTransaction = null;
  writeJson(lifecyclePath, file);
  return after;
}


async function lifecycleWrite({
  file, clients, deployment, action, actor, functionName, args, valueGEN = "0", lifecyclePath = LIFECYCLE_PATH,
}) {
  const client = actorClient(clients, actor);
  await client.initializeConsensusSmartContract();
  const hash = await client.writeContract({
    address: deployment.contractAddress,
    functionName,
    args,
    value: valueGEN === "2" ? valueForCreateAgreement() : 0n,
  });
  file.pendingTransaction = {
    action,
    actor,
    transactionHash: hash,
    submittedAt: new Date().toISOString(),
    valueGEN,
  };
  writeJson(lifecyclePath, file);
  console.log(JSON.stringify({ stage: "SUBMITTED", action, actor, valueGEN, transactionHash: hash }, null, 2));
  return reconcilePending(file, clients, deployment, lifecyclePath);
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


async function lifecycle(allowTransientRetry = false) {
  const clients = await roleClients(true);
  const deployment = readJson(DEPLOYMENT_PATH, undefined);
  if (!deployment?.active || deployment.result !== "SUCCESS") throw new Error("No active successful deployment exists.");
  const identity = currentIdentity(clients.sponsorAccount.address, clients.contractorAccount.address);
  if (deploymentDecision(deployment, identity) !== "RESUME") throw new Error("Deployment identity does not match current source and actors.");
  const file = lifecycleFile(deployment, clients);
  if (file.contractAddress !== deployment.contractAddress || file.sponsor !== identity.sponsor || file.contractor !== identity.contractor) {
    throw new Error("Lifecycle evidence belongs to a different deployment or actor pair.");
  }
  let state = await reconcilePending(file, clients, deployment);
  for (let step = 0; step < 10; step += 1) {
    const action = selectNextLifecycleAction(state.agreement);
    if (action === "CREATE") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "create_agreement", args: createArguments(file), valueGEN: "2" });
    } else if (action === "RATIFY") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "ratify_agreement", args: [file.agreementId] });
    } else if (action === "REVIEW") {
      if (state.agreement?.state === "RETRYABLE" && !allowTransientRetry) {
        console.log(JSON.stringify({
          Result: "RETRY_REQUIRES_DIAGNOSIS",
          agreementId: file.agreementId,
          currentAttempt: state.agreement.attemptCount,
          nextCommand: "npm run studionet:retry",
        }, null, 2));
        return;
      }
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "request_review", args: [file.agreementId, file.modificationPublication] });
      if (state.agreement?.state === "RETRYABLE") {
        console.log(JSON.stringify({ Result: "RETRYABLE", agreementId: file.agreementId, attemptCount: state.agreement.attemptCount }, null, 2));
        return;
      }
    } else if (action === "PROPOSE") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "propose_split", args: [file.agreementId, 1] });
    } else if (action === "ACCEPT") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "accept_split", args: [file.agreementId, state.agreement.proposalNonce] });
    } else if (action === "WITHDRAW_CONTRACTOR") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "contractor", functionName: "withdraw_credit", args: [file.agreementId] });
    } else if (action === "WITHDRAW_SPONSOR") {
      state = await lifecycleWrite({ file, clients, deployment, action, actor: "sponsor", functionName: "withdraw_credit", args: [file.agreementId] });
    } else if (action === "COMPLETE") {
      file.completedAt = new Date().toISOString();
      file.finalCanonical = state;
      writeJson(LIFECYCLE_PATH, file);
      console.log(JSON.stringify({ Result: "SUCCESS", agreementId: file.agreementId, state: "CLOSED", transactionCount: file.transactions.length }, null, 2));
      return;
    } else {
      throw new Error(`Canonical lifecycle is inconsistent (${state.agreement?.state ?? "missing"}).`);
    }
  }
  throw new Error("Lifecycle exceeded the bounded ten-step limit.");
}


async function retryLifecycle() {
  const clients = await roleClients(true);
  const deployment = readJson(DEPLOYMENT_PATH, undefined);
  if (!deployment?.active || deployment.result !== "SUCCESS") throw new Error("No active successful deployment exists.");
  const state = await canonicalState(clients, deployment);
  const agreement = state.agreement;
  if (agreement?.state !== "RETRYABLE") throw new Error("Canonical agreement is not retryable.");
  const rawAttempt = await readView(
    clients.readClient,
    deployment.contractAddress,
    "get_review_attempt",
    [AGREEMENT_ID, agreement.attemptCount],
  );
  const attempt = {
    attemptNumber: Number(field(rawAttempt, "attempt_number", "attemptNumber") ?? 0),
    sourceStatus: field(rawAttempt, "source_status", "sourceStatus") ?? "UNKNOWN",
    sourceCoverage: field(rawAttempt, "source_coverage", "sourceCoverage") ?? "UNKNOWN",
    aggregateVerdict: field(rawAttempt, "aggregate_verdict", "aggregateVerdict") ?? "UNKNOWN",
  };
  const decision = retryDecision(agreement, attempt);
  console.log(JSON.stringify({ agreementId: AGREEMENT_ID, currentAttempt: attempt, retryDecision: decision }, null, 2));
  if (decision !== "RETRY_TRANSIENT") {
    throw new Error("Retry refused: the current canonical attempt is not a transient source failure.");
  }
  await lifecycle(true);
}


async function recover() {
  const clients = await roleClients(true);
  const existing = readJson(DEPLOYMENT_PATH, undefined);
  const identity = currentIdentity(clients.sponsorAccount.address, clients.contractorAccount.address);
  if (!existing) {
    const pending = [...deploymentAttempts().attempts].reverse().find((attempt) =>
      attempt.sourceSha256 === identity.sourceSha256 && ["SUBMITTED", "ACCEPTED"].includes(attempt.status));
    if (!pending) throw new Error("No deployment or pending deployment is available to recover.");
    await finalizeDeployment(clients, identity, pending.transactionHash);
    return;
  }
  if (deploymentDecision(existing, identity) !== "RESUME") throw new Error("Recovery refused for a mismatched deployment identity.");
  const file = lifecycleFile(existing, clients);
  const state = await reconcilePending(file, clients, existing);
  console.log(JSON.stringify({ Result: "RECOVERED", agreementId: file.agreementId, canonicalState: state.agreement?.state ?? "ABSENT", nextAction: selectNextLifecycleAction(state.agreement) }, null, 2));
}


async function quarantine() {
  const clients = await roleClients(true);
  const deployment = readJson(DEPLOYMENT_PATH, undefined);
  if (!deployment?.active || deployment.result !== "SUCCESS" || !deployment.contractAddress) {
    throw new Error("No active successful deployment is available to quarantine.");
  }
  const file = lifecycleFile(deployment, clients);
  if (file.contractAddress !== deployment.contractAddress) {
    throw new Error("Quarantine evidence does not match the active deployment.");
  }
  const state = await reconcilePending(file, clients, deployment);
  const agreement = state.agreement;
  const rawAttempt = await readView(
    clients.readClient,
    deployment.contractAddress,
    "get_review_attempt",
    [file.agreementId, agreement?.attemptCount ?? 0],
  );
  const attempt = {
    attemptNumber: Number(field(rawAttempt, "attempt_number", "attemptNumber") ?? 0),
    sourceStatus: field(rawAttempt, "source_status", "sourceStatus") ?? "UNKNOWN",
    aggregateVerdict: field(rawAttempt, "aggregate_verdict", "aggregateVerdict") ?? "UNKNOWN",
  };
  const decision = quarantineDecision(agreement, state.accounting, attempt);
  if (decision.action !== "QUARANTINE") {
    throw new Error("Quarantine refused because canonical state or accounting is not the bounded failed-source case.");
  }
  const quarantinedAt = new Date().toISOString();
  const paths = archivePaths(deployment.contractAddress);
  const archivedDeployment = {
    ...deployment,
    active: false,
    result: "QUARANTINED",
    quarantinedAt,
    recoveryPending: true,
    recoveryAvailableAt: decision.recoveryAvailableAt,
    closePathDefined: true,
    remainingAccountingZero: false,
  };
  const archivedLifecycle = {
    ...file,
    quarantinedAt,
    recoveryPending: true,
    currentCanonical: state,
  };
  writeJson(paths.deployment, archivedDeployment);
  writeJson(paths.lifecycle, archivedLifecycle);
  writeJson(DEPLOYMENT_PATH, archivedDeployment);
  writeJson(LIFECYCLE_PATH, {
    archived: true,
    quarantinedAt,
    contractAddress: deployment.contractAddress,
    archive: paths.relative,
    recoveryPending: true,
  });
  console.log(JSON.stringify({
    Result: "QUARANTINED",
    contractAddress: deployment.contractAddress,
    recoveryPending: true,
    recoveryAvailableAt: decision.recoveryAvailableAt,
    remainingAccountingZero: false,
    accounting: state.accounting,
    archive: paths.relative,
  }, null, 2));
}


function pendingSupersededDeployments() {
  if (!existsSync(ARCHIVE_DIR)) return [];
  const results = [];
  for (const entry of readdirSync(ARCHIVE_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const paths = archivePaths(entry.name);
    const deployment = readJson(paths.deployment, undefined);
    if (deployment?.result === "QUARANTINED" && deployment.recoveryPending === true) {
      results.push({ paths, deployment });
    }
  }
  return results;
}


async function recoverSuperseded() {
  const clients = await roleClients(true);
  const pending = pendingSupersededDeployments();
  if (pending.length === 0) {
    console.log(JSON.stringify({ Result: "NO_PENDING_SUPERSEDED_DEPLOYMENT" }, null, 2));
    return;
  }
  if (pending.length > 1) {
    throw new Error("More than one superseded deployment needs recovery; recover one explicit archive at a time.");
  }
  const { paths, deployment } = pending[0];
  if (
    deployment.sponsor.toLowerCase() !== clients.sponsorAccount.address.toLowerCase()
    || deployment.contractor.toLowerCase() !== clients.contractorAccount.address.toLowerCase()
  ) {
    throw new Error("Superseded deployment actors do not match the authorized signers.");
  }
  const file = readJson(paths.lifecycle, undefined);
  if (!file || file.contractAddress !== deployment.contractAddress) {
    throw new Error("Superseded lifecycle archive is absent or mismatched.");
  }
  let state = await reconcilePending(file, clients, deployment, paths.lifecycle);
  for (let step = 0; step < 4; step += 1) {
    const decision = retirementDecision(state.agreement, state.accounting);
    if (decision.action === "WAIT") {
      console.log(JSON.stringify({
        Result: "WAIT_FOR_SUPERSEDED_EXPIRY",
        contractAddress: deployment.contractAddress,
        availableAt: decision.availableAt,
        accounting: state.accounting,
      }, null, 2));
      return;
    }
    if (decision.action === "RECOVER") {
      state = await lifecycleWrite({
        file, clients, deployment, action: "RECOVER_EXPIRED", actor: "sponsor",
        functionName: "recover_expired", args: [file.agreementId], lifecyclePath: paths.lifecycle,
      });
      continue;
    }
    if (decision.action === "WITHDRAW_CONTRACTOR" || decision.action === "WITHDRAW_SPONSOR") {
      const actor = decision.action === "WITHDRAW_CONTRACTOR" ? "contractor" : "sponsor";
      state = await lifecycleWrite({
        file, clients, deployment, action: decision.action, actor,
        functionName: "withdraw_credit", args: [file.agreementId], lifecyclePath: paths.lifecycle,
      });
      continue;
    }
    if (decision.action === "ARCHIVE") {
      const recoveredAt = new Date().toISOString();
      const recoveredDeployment = {
        ...deployment,
        result: "RETIRED",
        recoveryPending: false,
        recoveredAt,
        remainingAccountingZero: true,
      };
      writeJson(paths.deployment, recoveredDeployment);
      writeJson(paths.lifecycle, {
        ...file,
        recoveryPending: false,
        recoveredAt,
        finalCanonical: state,
      });
      console.log(JSON.stringify({
        Result: "SUPERSEDED_RECOVERED",
        contractAddress: deployment.contractAddress,
        remainingAccountingZero: true,
        accounting: state.accounting,
      }, null, 2));
      return;
    }
    throw new Error("Superseded recovery refused because canonical accounting is not safely recoverable.");
  }
  throw new Error("Superseded recovery exceeded the bounded four-step limit.");
}


async function retire() {
  const clients = await roleClients(true);
  const deployment = readJson(DEPLOYMENT_PATH, undefined);
  if (!deployment?.active || deployment.result !== "SUCCESS" || !deployment.contractAddress) {
    throw new Error("No active successful deployment is available to retire.");
  }
  const file = lifecycleFile(deployment, clients);
  if (file.contractAddress !== deployment.contractAddress) {
    throw new Error("Retirement evidence does not match the active deployment.");
  }
  let state = await reconcilePending(file, clients, deployment);
  for (let step = 0; step < 4; step += 1) {
    const decision = retirementDecision(state.agreement, state.accounting);
    if (decision.action === "WAIT") {
      console.log(JSON.stringify({
        Result: "WAIT_FOR_EXPIRY",
        contractAddress: deployment.contractAddress,
        agreementId: file.agreementId,
        canonicalState: state.agreement?.state ?? "ABSENT",
        availableAt: decision.availableAt,
        accounting: state.accounting,
      }, null, 2));
      return;
    }
    if (decision.action === "RECOVER") {
      state = await lifecycleWrite({
        file, clients, deployment, action: "RECOVER_EXPIRED", actor: "sponsor",
        functionName: "recover_expired", args: [file.agreementId],
      });
      continue;
    }
    if (decision.action === "WITHDRAW_CONTRACTOR" || decision.action === "WITHDRAW_SPONSOR") {
      const actor = decision.action === "WITHDRAW_CONTRACTOR" ? "contractor" : "sponsor";
      state = await lifecycleWrite({
        file, clients, deployment, action: decision.action, actor,
        functionName: "withdraw_credit", args: [file.agreementId],
      });
      continue;
    }
    if (decision.action === "ARCHIVE") {
      const retiredAt = new Date().toISOString();
      const retiredDeployment = {
        ...deployment,
        active: false,
        result: "RETIRED",
        retiredAt,
        remainingAccountingZero: true,
      };
      const retiredLifecycle = { ...file, retired: true, retiredAt, finalCanonical: state };
      const archive = join(ARCHIVE_DIR, deployment.contractAddress.toLowerCase());
      writeJson(join(archive, "deployment.json"), retiredDeployment);
      writeJson(join(archive, "lifecycle.json"), retiredLifecycle);
      writeJson(DEPLOYMENT_PATH, retiredDeployment);
      writeJson(LIFECYCLE_PATH, {
        retired: true,
        retiredAt,
        contractAddress: deployment.contractAddress,
        archive,
      });
      console.log(JSON.stringify({
        Result: "RETIRED",
        contractAddress: deployment.contractAddress,
        agreementId: file.agreementId,
        remainingAccountingZero: true,
        accounting: state.accounting,
      }, null, 2));
      return;
    }
    throw new Error("Retirement refused because canonical accounting is not safely recoverable.");
  }
  throw new Error("Retirement exceeded the bounded four-step limit.");
}


async function main() {
  const command = process.argv[2] ?? "inspect";
  if (command === "inspect") await inspect();
  else if (command === "deploy") await deploy();
  else if (command === "lifecycle") await lifecycle();
  else if (command === "retry") await retryLifecycle();
  else if (command === "recover") await recover();
  else if (command === "retire") await retire();
  else if (command === "quarantine") await quarantine();
  else if (command === "recover-superseded") await recoverSuperseded();
  else throw new Error("Usage: node scripts/studionet.mjs <inspect|deploy|lifecycle|retry|recover|retire|quarantine|recover-superseded>");
}


if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown Studionet operation failure.";
    console.error(`Studionet operation stopped: ${message}`);
    process.exitCode = 1;
  });
}
