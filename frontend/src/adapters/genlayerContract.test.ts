import { TransactionStatus } from "genlayer-js/types";
import { describe, expect, it, vi } from "vitest";
import type { Eip1193Provider } from "../wallet/types";
import { createGenLayerContractAdapter, type GenLayerClientLike } from "./genlayerContract";


const CONTRACT = "0x1111111111111111111111111111111111111111";
const SPONSOR = "0x2222222222222222222222222222222222222222";
const CONTRACTOR = "0x3333333333333333333333333333333333333333";
const HASH = `0x${"a".repeat(64)}`;

const rawAgreement = {
  agreement_id: "scope-1",
  sponsor: SPONSOR,
  contractor: CONTRACTOR,
  state: "NEGOTIATION",
  verdict: "MATERIAL_AMENDMENT",
  original_publication: "00190662-2025",
  original_notice_uuid: "6480e4d5-6f07-4b83-8097-5756d8fbf527",
  original_notice_version: "01",
  buyer_legal_id: "3267368TH",
  procedure_id: "7f56490a-c5ba-4922-853b-07b18b0d14c1",
  contract_id: "417379",
  canonical_objective: "Deliver the procurement scope described by the original official notice.",
  scope_allowance: "Preserve the original purpose, capability set, and delivery boundary.",
  ratify_deadline: "2026-09-02T00:00:00Z",
  review_deadline: "2026-09-03T00:00:00Z",
  negotiation_started_at: "2026-09-01T00:00:00Z",
  negotiation_deadline: "2026-09-01T01:00:00Z",
  modification_publication: "00587863-2026",
  attempt_count: "1",
  proposal_contractor_gen: "1",
  proposal_nonce: "2",
  has_proposal: true,
  locked_amount: (2n * 10n ** 18n).toString(),
  sponsor_credit: "0",
  contractor_credit: "0",
};


function fakeClient(overrides: Partial<GenLayerClientLike> = {}): GenLayerClientLike {
  return {
    readContract: vi.fn(async ({ functionName, args }) => {
      if (functionName === "get_agreement") return JSON.stringify({ ...rawAgreement, agreement_id: args?.[0] });
      if (functionName === "get_account_agreement_ids") return "scope-1,scope-2";
      if (functionName === "get_credit_gen") return "1";
      if (functionName === "get_accounting") return JSON.stringify({
        received_gen: "2", locked_gen: "2", credited_gen: "0", withdrawn_gen: "0",
      });
      throw new Error(`Unexpected read ${functionName}`);
    }),
    writeContract: vi.fn(async () => HASH),
    waitForTransactionReceipt: vi.fn(async ({ status }) => ({
      statusName: status,
      txExecutionResultName: "FINISHED_WITH_RETURN",
    })),
    ...overrides,
  };
}


describe("GenLayer contract adapter", () => {
  it("uses the same-origin IC path and maps canonical GEN state", async () => {
    const configurations: unknown[] = [];
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({
      contractAddress: CONTRACT,
      createClient: (config) => { configurations.push(config); return client; },
    });

    expect(adapter.configuration).toMatchObject({
      readConfigured: true,
      writeConfigured: false,
      icReadPath: "/genlayer-rpc",
      walletWriteChainId: "0xf22f",
    });
    await expect(adapter.getAgreement("scope-1")).resolves.toMatchObject({
      id: "scope-1",
      state: "NEGOTIATION",
      lockedGen: 2,
      proposalNonce: 2,
      contractorAllocationGen: 1,
    });
    expect(configurations[0]).toMatchObject({ endpoint: "/genlayer-rpc" });
  });


  it("lists only canonical account agreements and reads agreement-scoped credit", async () => {
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });

    const agreements = await adapter.listAgreements(SPONSOR);
    expect(agreements.map((agreement) => agreement.id)).toEqual(["scope-1", "scope-2"]);
    await expect(adapter.getCredit("scope-1", SPONSOR)).resolves.toBe(1);
    expect(client.readContract).toHaveBeenCalledWith(expect.objectContaining({
      functionName: "get_account_agreement_ids", args: [SPONSOR],
    }));
  });


  it("writes every lifecycle method through the explicitly selected provider", async () => {
    const provider: Eip1193Provider = { request: vi.fn(async () => "0xf22f") };
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({
      contractAddress: CONTRACT,
      account: SPONSOR,
      provider,
      createClient: () => client,
    });

    await adapter.createAgreement({
      id: "scope-1",
      contractor: CONTRACTOR,
      originalPublication: "00190662-2025",
      originalNoticeUuid: "6480e4d5-6f07-4b83-8097-5756d8fbf527",
      originalNoticeVersion: "01",
      buyerId: "3267368TH",
      procedureId: "7f56490a-c5ba-4922-853b-07b18b0d14c1",
      contractReference: "417379",
      canonicalObjective: "Deliver the procurement scope described by the original official notice.",
      allowance: "Preserve the original purpose, capability set, and delivery boundary.",
      ratificationDeadline: "2026-09-02T00:00:00Z",
      reviewDeadline: "2026-09-03T00:00:00Z",
      negotiationWindowSeconds: 3600,
    });
    await adapter.ratifyAgreement("scope-1");
    await adapter.reviewModification("scope-1", "00587863-2026");
    await adapter.proposeAllocation("scope-1", 1);
    await adapter.acceptAllocation("scope-1", 2);
    await adapter.recoverExpired("scope-1");
    await adapter.withdrawCredit("scope-1");

    expect(vi.mocked(client.writeContract).mock.calls.map(([request]) => request.functionName)).toEqual([
      "create_agreement", "ratify_agreement", "request_review", "propose_split",
      "accept_split", "recover_expired", "withdraw_credit",
    ]);
    expect(client.writeContract).toHaveBeenNthCalledWith(1, expect.objectContaining({
      value: 2n * 10n ** 18n,
      args: expect.arrayContaining(["scope-1", CONTRACTOR, "00190662-2025"]),
    }));
    expect(provider.request).toHaveBeenCalledWith(expect.objectContaining({ method: "wallet_switchEthereumChain" }));
  });


  it("waits for accepted and successful finalized receipts without simulating finality", async () => {
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });

    await adapter.waitForAccepted(HASH);
    await adapter.waitForFinality(HASH);
    expect(client.waitForTransactionReceipt).toHaveBeenNthCalledWith(1, expect.objectContaining({
      hash: HASH, status: TransactionStatus.ACCEPTED,
    }));
    expect(client.waitForTransactionReceipt).toHaveBeenNthCalledWith(2, expect.objectContaining({
      hash: HASH, status: TransactionStatus.FINALIZED,
    }));
  });


  it("rejects finalized execution errors", async () => {
    const client = fakeClient({
      waitForTransactionReceipt: vi.fn(async ({ status }) => ({
        statusName: status,
        txExecutionResultName: status === TransactionStatus.FINALIZED
          ? "FINISHED_WITH_ERROR"
          : "NOT_VOTED",
      })),
    });
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });

    await expect(adapter.waitForFinality(HASH)).rejects.toThrow(/execution error/i);
  });
});
