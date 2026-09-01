import { createClient as createSdkClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";
import { ExecutionResult, TransactionStatus } from "genlayer-js/types";
import type { Agreement } from "../domain/types";
import { ensureWalletChain } from "../wallet/network";
import type { Eip1193Provider } from "../wallet/types";
import type { ContractAdapter, TransactionReference } from "./contract";


const GEN = 10n ** 18n;
const DEFAULT_READ_PATH = "/genlayer-rpc";
type Address = `0x${string}`;

export interface GenLayerClientLike {
  readContract(args: { address: Address; functionName: string; args?: unknown[]; jsonSafeReturn?: boolean }): Promise<unknown>;
  writeContract(args: { address: Address; functionName: string; args?: unknown[]; value: bigint }): Promise<unknown>;
  waitForTransactionReceipt(args: { hash: Address; status: TransactionStatus | string; retries?: number; interval?: number }): Promise<Record<string, unknown>>;
}

interface ClientConfig {
  chain: typeof studionet;
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
}

type RawAgreement = Record<string, unknown>;


function cloneStudionet(): typeof studionet {
  return {
    ...studionet,
    rpcUrls: { ...studionet.rpcUrls, default: { http: [...studionet.rpcUrls.default.http] } },
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


export function createGenLayerContractAdapter(options: AdapterOptions): ContractAdapter {
  if (!isAddress(options.contractAddress)) throw new Error("A valid deployed contract address is required.");
  const address = options.contractAddress;
  const createClient = options.createClient ?? productionClient;
  const readPath = options.icReadPath ?? DEFAULT_READ_PATH;
  const readClient = createClient({ chain: cloneStudionet(), endpoint: readPath });
  const account = isAddress(options.account) ? options.account : undefined;

  const read = (functionName: string, args: unknown[] = []) => readClient.readContract({
    address, functionName, args, jsonSafeReturn: true,
  });
  const getAgreement: ContractAdapter["getAgreement"] = async (id) => mapAgreement(parseObject(await read("get_agreement", [id])));

  const write = async (functionName: string, args: unknown[], value = 0n): Promise<TransactionReference> => {
    if (!account || !options.provider) throw new Error("Select a wallet account before writing to the contract.");
    await ensureWalletChain(options.provider);
    const client = createClient({ chain: cloneStudionet(), account, provider: options.provider });
    const result = await client.writeContract({ address, functionName, args, value });
    if (!isHash(result)) throw new Error("Wallet submission returned an invalid transaction hash.");
    return { hash: result };
  };

  const waitFor = async (hash: string, status: TransactionStatus) => {
    if (!isHash(hash)) throw new Error("Transaction hash is invalid.");
    const receipt = await readClient.waitForTransactionReceipt({ hash, status, retries: 400, interval: 3_000 });
    if (status === TransactionStatus.FINALIZED && receipt.txExecutionResultName !== ExecutionResult.FINISHED_WITH_RETURN) {
      throw new Error("The finalized transaction ended with an execution error.");
    }
  };

  return {
    configuration: {
      readConfigured: true,
      writeConfigured: Boolean(account && options.provider),
      networkName: "Studionet",
      contractAddress: address,
      icReadPath: readPath,
      walletWriteChainId: "0xf22f",
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
    waitForAccepted: async (hash) => waitFor(hash, TransactionStatus.ACCEPTED),
    waitForFinality: async (hash) => waitFor(hash, TransactionStatus.FINALIZED),
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
  };
}
