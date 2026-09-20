import { TransactionStatus } from "genlayer-js-rc/types";
import { createClient as createRealClient } from "genlayer-js-rc";
import { studioDevnet } from "genlayer-js-rc/chains";
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
const rawCloseout = {
  agreement_id: "scope-1", sponsor: SPONSOR, contractor: CONTRACTOR, state: "OFFERED", verdict: "",
  lot_id: "LOT-0001", completion_standard: "Release after authenticated completion.",
  ratify_deadline: "2026-09-04T00:00:00Z", review_deadline: "2026-09-05T00:00:00Z",
  negotiation_deadline: "", completion_publication: "", proposal_nonce: "0", proposal_contractor_gen: "0",
  locked_amount: (10n ** 18n).toString(), sponsor_credit: "0", contractor_credit: "0",
};


function fakeClient(overrides: Partial<GenLayerClientLike> = {}): GenLayerClientLike {
  return {
    readContract: vi.fn(async ({ functionName, args }) => {
      if (functionName === "get_agreement") return JSON.stringify({ ...rawAgreement, agreement_id: args?.[0] });
      if (functionName === "get_account_agreement_ids") return "scope-1,scope-2";
      if (functionName === "get_credit_gen") return "1";
      if (functionName === "get_closeout") return JSON.stringify(rawCloseout);
      if (functionName === "get_closeout_credit_gen") return "1";
      if (functionName === "get_accounting") return JSON.stringify({
        received_gen: "2", locked_gen: "2", credited_gen: "0", withdrawn_gen: "0",
      });
      throw new Error(`Unexpected read ${functionName}`);
    }),
    writeContract: vi.fn(async () => HASH),
    estimateTransactionFeesForWrite: vi.fn(async () => ({ distribution: { leader: 1n }, feeValue: 5n * 10n ** 17n })),
    waitForDecision: vi.fn(async () => ({ statusName: TransactionStatus.ACCEPTED })),
    waitForFinalization: vi.fn(async () => ({
      statusName: TransactionStatus.FINALIZED,
      txExecutionResultName: "FINISHED_WITH_RETURN",
      feeAccounting: { paid_fee_value: 5n * 10n ** 17n, total_refunded: 10n ** 17n },
    })),
    ...overrides,
  };
}


describe("GenLayer contract adapter", () => {
  it("constructs the real RC SDK client with the selected account at client creation", () => {
    const provider: Eip1193Provider = { request: vi.fn(async () => "0xf22d") };
    const client = createRealClient({ chain: studioDevnet, account: SPONSOR, provider: provider as never });
    expect(client.writeContract).toBeTypeOf("function");
    expect(client.estimateTransactionFeesForWrite).toBeTypeOf("function");
    expect(client.waitForFinalization).toBeTypeOf("function");
  });

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
      walletWriteChainId: "0xf22d",
      networkName: "Studio Dev",
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
    const provider: Eip1193Provider = { request: vi.fn(async () => "0xf22d") };
    const client = fakeClient();
    const confirmProtocolFee = vi.fn(async () => true);
    const adapter = createGenLayerContractAdapter({
      contractAddress: CONTRACT,
      account: SPONSOR,
      provider,
      confirmProtocolFee,
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
    await adapter.openCloseout({ agreementId: "scope-1", lotId: "LOT-0001", completionStandard: "Release after authenticated completion.", ratificationDeadline: "2026-09-04T00:00:00Z", reviewDeadline: "2026-09-05T00:00:00Z", negotiationWindowSeconds: 3600 });
    await adapter.ratifyCloseout("scope-1");
    await adapter.reviewCloseout("scope-1", "00734925-2025");
    await adapter.proposeCloseoutAllocation("scope-1", 1);
    await adapter.acceptCloseoutAllocation("scope-1", 1);
    await adapter.recoverCloseout("scope-1");
    await adapter.withdrawCloseoutCredit("scope-1");

    expect(vi.mocked(client.writeContract).mock.calls.map(([request]) => request.functionName)).toEqual([
      "create_agreement", "ratify_agreement", "request_review", "propose_split",
      "accept_split", "recover_expired", "withdraw_credit", "open_closeout", "ratify_closeout",
      "request_closeout_review", "propose_closeout_split", "accept_closeout_split", "recover_closeout",
      "withdraw_closeout_credit",
    ]);
    expect(client.writeContract).toHaveBeenNthCalledWith(1, expect.objectContaining({
      value: 2n * 10n ** 18n,
      fees: expect.objectContaining({ feeValue: 5n * 10n ** 17n }),
      args: expect.arrayContaining(["scope-1", CONTRACTOR, "00190662-2025"]),
    }));
    expect(vi.mocked(client.writeContract).mock.calls[0][0]).not.toHaveProperty("account");
    expect(confirmProtocolFee).toHaveBeenCalledTimes(14);
    expect(confirmProtocolFee).toHaveBeenNthCalledWith(1, expect.objectContaining({
      maximumFeeAtto: 5n * 10n ** 17n,
      applicationValueAtto: 2n * 10n ** 18n,
    }));
    expect(provider.request).toHaveBeenCalledWith(expect.objectContaining({ method: "wallet_switchEthereumChain" }));
    expect(client.writeContract).toHaveBeenNthCalledWith(8, expect.objectContaining({ value: 10n ** 18n }));
  });

  it("never opens the wallet when the measured Studio Dev fee is rejected", async () => {
    const provider: Eip1193Provider = { request: vi.fn(async () => "0xf22d") };
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({
      contractAddress: CONTRACT,
      account: SPONSOR,
      provider,
      confirmProtocolFee: async () => false,
      createClient: () => client,
    });

    await expect(adapter.ratifyAgreement("scope-1")).rejects.toThrow(/fee was not approved/i);
    expect(client.estimateTransactionFeesForWrite).toHaveBeenCalledOnce();
    expect(client.writeContract).not.toHaveBeenCalled();
  });

  it("maps canonical closeout state in GEN", async () => {
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => fakeClient() });
    await expect(adapter.getCloseout("scope-1")).resolves.toMatchObject({ agreementId: "scope-1", state: "OFFERED", lockedGen: 1, lotId: "LOT-0001" });
    await expect(adapter.getCloseoutCredit("scope-1", CONTRACTOR)).resolves.toBe(1);
  });


  it("treats the GenLayer missing-key execution error as an absent closeout", async () => {
    const client = fakeClient({
      readContract: vi.fn(async ({ functionName }) => {
        if (functionName === "get_closeout") throw new Error("Missing or invalid parameters. Double check you have provided the correct parameters. Details: execution failed Version: viem@2.56.1");
        throw new Error(`Unexpected read ${functionName}`);
      }),
    });
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });
    await expect(adapter.getCloseout("scope-1")).resolves.toBeNull();
  });


  it("treats an error-shaped canonical closeout response as absent", async () => {
    const client = fakeClient({
      readContract: vi.fn(async ({ functionName }) => {
        if (functionName === "get_closeout") return JSON.stringify({ error: { message: "execution failed" } });
        throw new Error(`Unexpected read ${functionName}`);
      }),
    });
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });
    await expect(adapter.getCloseout("scope-1")).resolves.toBeNull();
  });


  it("waits for accepted and successful finalized receipts without simulating finality", async () => {
    const client = fakeClient();
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });

    await adapter.waitForAccepted(HASH);
    await expect(adapter.waitForFinality(HASH)).resolves.toEqual({
      actualFeeAtto: 4n * 10n ** 17n,
      refundedFeeAtto: 10n ** 17n,
    });
    expect(client.waitForDecision).toHaveBeenCalledWith(expect.objectContaining({ hash: HASH }));
    expect(client.waitForFinalization).toHaveBeenCalledWith(expect.objectContaining({ hash: HASH }));
  });


  it("uses the selected wallet provider for receipt polling and accepts raw Studio success receipts", async () => {
    const provider: Eip1193Provider = { request: vi.fn(async () => "0xf22d") };
    const readClient = fakeClient({
      waitForDecision: vi.fn(async () => { throw new Error("IC read proxy must not poll wallet transactions"); }),
      waitForFinalization: vi.fn(async () => { throw new Error("IC read proxy must not poll wallet transactions"); }),
    });
    const walletClient = fakeClient({
      waitForDecision: vi.fn(async () => ({ status: 5, status_name: "ACCEPTED" })),
      waitForFinalization: vi.fn(async () => ({
            status: 7,
            status_name: "FINALIZED",
            result: 6,
            result_name: "MAJORITY_AGREE",
            consensus_data: { leader_receipt: [{ execution_result: "SUCCESS" }] },
          })),
    });
    const configurations: unknown[] = [];
    const adapter = createGenLayerContractAdapter({
      contractAddress: CONTRACT,
      account: SPONSOR,
      provider,
      createClient: (config) => {
        configurations.push(config);
        return config.provider ? walletClient : readClient;
      },
    });

    await expect(adapter.waitForAccepted(HASH)).resolves.toBeUndefined();
    await expect(adapter.waitForFinality(HASH)).resolves.toEqual({});
    expect(readClient.waitForDecision).not.toHaveBeenCalled();
    expect(walletClient.waitForDecision).toHaveBeenCalledOnce();
    expect(walletClient.waitForFinalization).toHaveBeenCalledOnce();
    expect(configurations).toHaveLength(2);
    expect(configurations[0]).toMatchObject({ endpoint: "/genlayer-rpc" });
    expect(configurations[1]).toMatchObject({ account: SPONSOR, provider });
  });


  it("rejects finalized execution errors", async () => {
    const client = fakeClient({
      waitForFinalization: vi.fn(async () => ({
        statusName: TransactionStatus.FINALIZED,
        txExecutionResultName: "FINISHED_WITH_ERROR",
      })),
    });
    const adapter = createGenLayerContractAdapter({ contractAddress: CONTRACT, createClient: () => client });

    await expect(adapter.waitForFinality(HASH)).rejects.toThrow(/execution error/i);
  });
});
