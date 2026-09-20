import { createClient as createSdkClient, isSuccessful } from "genlayer-js-rc";
import { studioDevnet } from "genlayer-js-rc/chains";
import type { Agreement, Closeout } from "../domain/types";
import { ensureWalletChain } from "../wallet/network";
import type { Eip1193Provider } from "../wallet/types";
import type { ContractAdapter, ProtocolFeeQuote, TransactionOutcome, TransactionReference } from "./contract";


const GEN = 10n ** 18n;
const DEFAULT_READ_PATH = "/genlayer-rpc";
type Address = `0x${string}`;

export interface GenLayerClientLike {
  readContract(args: { address: Address; functionName: string; args?: unknown[]; jsonSafeReturn?: boolean }): Promise<unknown>;
  estimateTransactionFeesForWrite(args: { address: Address; functionName: string; args?: unknown[]; value?: bigint }): Promise<{ distribution: unknown; feeValue: bigint }>;
  writeContract(args: { address: Address; functionName: string; args?: unknown[]; value: bigint; fees: { distribution: unknown; feeValue: bigint } }): Promise<unknown>;
  waitForDecision(args: { hash: Address; retries?: number; interval?: number; fullTransaction?: boolean }): Promise<Record<string, unknown>>;
  waitForFinalization(args: { hash: Address; retries?: number; interval?: number; fullTransaction?: boolean }): Promise<Record<string, unknown>>;
}

interface ClientConfig {
  chain: typeof studioDevnet;
  endpoint?: string;
  account?: Address;
  provider?: Eip1193Provider;
}

interface AdapterOptions {
  contractAddress: string;
  account?: string;
  provider?: Eip1193Provider;
  icReadPath?: string;
  createClient?: (config: ClientConfig) => GenLayerClientLike;
  confirmProtocolFee?: (quote: ProtocolFeeQuote) => boolean | Promise<boolean>;
}

type RawAgreement = Record<string, unknown>;


function cloneStudioDevnet(): typeof studioDevnet {
  return {
    ...studioDevnet,
    rpcUrls: { ...studioDevnet.rpcUrls, default: { http: [...studioDevnet.rpcUrls.default.http] } },
  };
}


function productionClient(config: ClientConfig): GenLayerClientLike {
  return createSdkClient(config as Parameters<typeof createSdkClient>[0]) as unknown as GenLayerClientLike;
}


function isAddress(value: string | undefined): value is Address {
  return Boolean(value && /^0x[a-fA-F0-9]{40}$/u.test(value));
}


function isHash(value: unknown): value is Address {
  return typeof value === "string" && /^0x[a-fA-F0-9]{64}$/u.test(value);
}


function parseObject(value: unknown): RawAgreement {
  if (typeof value === "string") return JSON.parse(value) as RawAgreement;
  if (typeof value === "object" && value !== null) return value as RawAgreement;
  throw new Error("Canonical contract view returned an unexpected shape.");
}


function asText(value: unknown): string {
  return String(value ?? "");
}


function asNumber(value: unknown): number {
  const parsed = Number(typeof value === "bigint" ? value : String(value ?? "0"));
  if (!Number.isFinite(parsed)) throw new Error("Canonical numeric field is invalid.");
  return parsed;
}


function asGen(value: unknown): number {
  return Number(BigInt(asText(value) || "0") / GEN);
}


function finalizedExecutionSucceeded(receipt: Record<string, unknown>): boolean {
  try {
    if (isSuccessful(receipt as never)) return true;
  } catch {
    // Retain the bounded raw Studio fallback while receipt shapes converge.
  }
  const normalized = receipt.txExecutionResultName ?? receipt.executionResultName;
  if (normalized === "FINISHED_WITH_RETURN") return true;
  const consensus = receipt.consensus_data;
  const leaders = typeof consensus === "object" && consensus !== null
    ? (consensus as RawAgreement).leader_receipt
    : undefined;
  const leader = Array.isArray(leaders) && typeof leaders[0] === "object" && leaders[0] !== null
    ? leaders[0] as RawAgreement
    : undefined;
  const execution = receipt.execution_result ?? leader?.execution_result;
  const result = receipt.resultName ?? receipt.result_name ?? receipt.result;
  return execution === "SUCCESS" && (result === "MAJORITY_AGREE" || result === 6);
}

function asOptionalBigInt(value: unknown): bigint | undefined {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && Number.isSafeInteger(value)) return BigInt(value);
    if (typeof value === "string" && /^\d+$/u.test(value)) return BigInt(value);
  } catch {
    return undefined;
  }
  return undefined;
}

function receiptFeeOutcome(receipt: Record<string, unknown>): TransactionOutcome {
  const data = typeof receipt.data === "object" && receipt.data !== null ? receipt.data as RawAgreement : undefined;
  const accountingCandidate = receipt.feeAccounting ?? receipt.fee_accounting ?? data?.feeAccounting ?? data?.fee_accounting;
  const accounting = typeof accountingCandidate === "object" && accountingCandidate !== null
    ? accountingCandidate as RawAgreement
    : undefined;
  if (!accounting) return {};
  const paid = asOptionalBigInt(accounting.paid_fee_value);
  const refunded = asOptionalBigInt(accounting.total_refunded);
  return {
    actualFeeAtto: paid === undefined ? undefined : paid - (refunded ?? 0n),
    refundedFeeAtto: refunded,
  };
}

function formatGen(atto: bigint): string {
  const whole = atto / GEN;
  const fraction = (atto % GEN).toString().padStart(18, "0").slice(0, 6).replace(/0+$/u, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

function defaultFeeConfirmation(quote: ProtocolFeeQuote): boolean {
  if (typeof window === "undefined" || typeof window.confirm !== "function") {
    throw new Error("Protocol fee confirmation is unavailable in this environment.");
  }
  return window.confirm(
    `Maximum Studio Dev network fee: ${formatGen(quote.maximumFeeAtto)} GEN. `
      + `Application value: ${formatGen(quote.applicationValueAtto)} GEN. Continue to wallet signing?`,
  );
}


function mapAgreement(raw: RawAgreement): Agreement {
  const state = asText(raw.state);
  if (!["DRAFT", "ACTIVE", "NEGOTIATION", "RETRYABLE", "SETTLED", "CLOSED"].includes(state)) {
    throw new Error("Canonical agreement state is unsupported.");
  }
  const allocation = asNumber(raw.proposal_contractor_gen);
  return {
    id: asText(raw.agreement_id),
    sponsor: asText(raw.sponsor),
    contractor: asText(raw.contractor),
    state: state as Agreement["state"],
    verdict: (asText(raw.verdict) || undefined) as Agreement["verdict"],
    originalPublication: asText(raw.original_publication),
    originalNoticeUuid: asText(raw.original_notice_uuid),
    originalNoticeVersion: asText(raw.original_notice_version),
    buyerId: asText(raw.buyer_legal_id),
    procedureId: asText(raw.procedure_id),
    contractReference: asText(raw.contract_id),
    canonicalObjective: asText(raw.canonical_objective),
    allowance: asText(raw.scope_allowance),
    ratificationDeadline: asText(raw.ratify_deadline),
    reviewDeadline: asText(raw.review_deadline),
    negotiationDeadline: asText(raw.negotiation_deadline),
    modificationPublication: asText(raw.modification_publication) || undefined,
    lockedGen: asGen(raw.locked_amount),
    sponsorCreditGen: asGen(raw.sponsor_credit),
    contractorCreditGen: asGen(raw.contractor_credit),
    proposalNonce: asNumber(raw.proposal_nonce),
    contractorAllocationGen: [0, 1, 2].includes(allocation) ? allocation as 0 | 1 | 2 : undefined,
  };
}

function mapCloseout(raw: RawAgreement): Closeout {
  const state = asText(raw.state);
  if (!["OFFERED", "ACTIVE", "NEGOTIATION", "RETRYABLE", "SETTLED", "CLOSED"].includes(state)) {
    throw new Error("Canonical closeout state is unsupported.");
  }
  const allocation = asNumber(raw.proposal_contractor_gen);
  return {
    agreementId: asText(raw.agreement_id), sponsor: asText(raw.sponsor), contractor: asText(raw.contractor),
    state: state as Closeout["state"], verdict: (asText(raw.verdict) || undefined) as Closeout["verdict"],
    lotId: asText(raw.lot_id), completionStandard: asText(raw.completion_standard),
    ratificationDeadline: asText(raw.ratify_deadline), reviewDeadline: asText(raw.review_deadline),
    negotiationDeadline: asText(raw.negotiation_deadline), completionPublication: asText(raw.completion_publication) || undefined,
    lockedGen: asGen(raw.locked_amount), sponsorCreditGen: asGen(raw.sponsor_credit), contractorCreditGen: asGen(raw.contractor_credit),
    proposalNonce: asNumber(raw.proposal_nonce), contractorAllocationGen: allocation === 1 ? 1 : 0,
  };
}


export function createGenLayerContractAdapter(options: AdapterOptions): ContractAdapter {
  if (!isAddress(options.contractAddress)) throw new Error("A valid deployed contract address is required.");
  const address = options.contractAddress;
  const createClient = options.createClient ?? productionClient;
  const readPath = options.icReadPath ?? DEFAULT_READ_PATH;
  const readClient = createClient({ chain: cloneStudioDevnet(), endpoint: readPath });
  const account = isAddress(options.account) ? options.account : undefined;
  const walletClient = account && options.provider
    ? createClient({ chain: cloneStudioDevnet(), account, provider: options.provider })
    : undefined;
  const confirmProtocolFee = options.confirmProtocolFee ?? defaultFeeConfirmation;

  const read = (functionName: string, args: unknown[] = []) => readClient.readContract({
    address, functionName, args, jsonSafeReturn: true,
  });
  const getAgreement: ContractAdapter["getAgreement"] = async (id) => mapAgreement(parseObject(await read("get_agreement", [id])));

  const write = async (functionName: string, args: unknown[], value = 0n): Promise<TransactionReference> => {
    if (!account || !options.provider) throw new Error("Select a wallet account before writing to the contract.");
    await ensureWalletChain(options.provider);
    const estimate = await walletClient!.estimateTransactionFeesForWrite({ address, functionName, args, value });
    if (typeof estimate.feeValue !== "bigint" || estimate.feeValue <= 0n || !estimate.distribution) {
      throw new Error("Studio Dev returned an invalid protocol-fee estimate.");
    }
    const feeQuote: ProtocolFeeQuote = { maximumFeeAtto: estimate.feeValue, applicationValueAtto: value };
    if (!await confirmProtocolFee(feeQuote)) throw new Error("Protocol fee was not approved.");
    const result = await walletClient!.writeContract({
      address, functionName, args, value,
      fees: { distribution: estimate.distribution, feeValue: estimate.feeValue },
    });
    if (!isHash(result)) throw new Error("Wallet submission returned an invalid transaction hash.");
    return { hash: result, feeQuote };
  };

  const waitForAccepted = async (hash: string) => {
    if (!isHash(hash)) throw new Error("Transaction hash is invalid.");
    await (walletClient ?? readClient).waitForDecision({ hash, retries: 400, interval: 3_000, fullTransaction: true });
  };

  const waitForFinality = async (hash: string): Promise<TransactionOutcome> => {
    if (!isHash(hash)) throw new Error("Transaction hash is invalid.");
    const receipt = await (walletClient ?? readClient).waitForFinalization({ hash, retries: 400, interval: 3_000, fullTransaction: true });
    if (!finalizedExecutionSucceeded(receipt)) throw new Error("The finalized transaction ended with an execution error.");
    return receiptFeeOutcome(receipt);
  };

  return {
    configuration: {
      readConfigured: true,
      writeConfigured: Boolean(account && options.provider),
      networkName: "Studio Dev",
      contractAddress: address,
      icReadPath: readPath,
      walletWriteChainId: "0xf22d",
    },
    getAgreement,
    listAgreements: async (requestedAccount) => {
      if (!isAddress(requestedAccount)) throw new Error("A valid account is required.");
      const raw = asText(await read("get_account_agreement_ids", [requestedAccount]));
      const ids = raw.split(",").map((id) => id.trim()).filter(Boolean);
      return Promise.all(ids.map(getAgreement));
    },
    getCredit: async (id, requestedAccount) => {
      if (!isAddress(requestedAccount)) throw new Error("A valid account is required.");
      return asNumber(await read("get_credit_gen", [id, requestedAccount]));
    },
    waitForAccepted,
    waitForFinality,
    createAgreement: (input) => write("create_agreement", [
      input.id,
      input.contractor,
      input.originalPublication,
      input.originalNoticeUuid,
      input.originalNoticeVersion,
      input.buyerId,
      input.procedureId,
      input.contractReference,
      input.canonicalObjective,
      input.allowance,
      input.ratificationDeadline,
      input.reviewDeadline,
      input.negotiationWindowSeconds,
    ], 2n * GEN),
    ratifyAgreement: (id) => write("ratify_agreement", [id]),
    reviewModification: (id, publication) => write("request_review", [id, publication]),
    proposeAllocation: (id, contractorGen) => write("propose_split", [id, contractorGen]),
    acceptAllocation: (id, nonce) => write("accept_split", [id, nonce]),
    recoverExpired: (id) => write("recover_expired", [id]),
    withdrawCredit: (id) => write("withdraw_credit", [id]),
    getCloseout: async (id) => {
      try {
        const parsed = parseObject(await read("get_closeout", [id]));
        if (Object.prototype.hasOwnProperty.call(parsed, "error")) return null;
        return mapCloseout(parsed);
      }
      catch (cause) {
        if (cause instanceof Error && /not found|missing key|KeyError|gen_call\).*execution failed|Missing or invalid parameters[\s\S]*Details: execution failed/iu.test(cause.message)) return null;
        throw cause;
      }
    },
    getCloseoutCredit: async (id, requestedAccount) => {
      if (!isAddress(requestedAccount)) throw new Error("A valid account is required.");
      return asNumber(await read("get_closeout_credit_gen", [id, requestedAccount]));
    },
    openCloseout: (input) => write("open_closeout", [input.agreementId, input.lotId, input.completionStandard, input.ratificationDeadline, input.reviewDeadline, input.negotiationWindowSeconds], GEN),
    ratifyCloseout: (id) => write("ratify_closeout", [id]),
    reviewCloseout: (id, publication) => write("request_closeout_review", [id, publication]),
    proposeCloseoutAllocation: (id, contractorGen) => write("propose_closeout_split", [id, contractorGen]),
    acceptCloseoutAllocation: (id, nonce) => write("accept_closeout_split", [id, nonce]),
    recoverCloseout: (id) => write("recover_closeout", [id]),
    withdrawCloseoutCredit: (id) => write("withdraw_closeout_credit", [id]),
  };
}
