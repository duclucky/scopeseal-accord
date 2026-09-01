import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ContractAdapter } from "./adapters/contract";
import { App } from "./App";
import type { Agreement } from "./domain/types";
import type { DetectedWallet } from "./wallet/types";


const SPONSOR = "0x2222222222222222222222222222222222222222";
const CONTRACTOR = "0x3333333333333333333333333333333333333333";
const HASH = `0x${"a".repeat(64)}`;

function agreement(state: Agreement["state"], extras: Partial<Agreement> = {}): Agreement {
  return {
    id: "scope-1", sponsor: SPONSOR, contractor: CONTRACTOR, state,
    originalPublication: "00190662-2025", originalNoticeUuid: "6480e4d5-6f07-4b83-8097-5756d8fbf527",
    originalNoticeVersion: "01", buyerId: "3267368TH", procedureId: "procedure-1",
    contractReference: "417379", canonicalObjective: "Official bounded procurement objective.",
    allowance: "Preserve the original purpose and material delivery boundary.",
    ratificationDeadline: "2026-09-02T00:00:00Z", reviewDeadline: "2026-09-03T00:00:00Z",
    negotiationDeadline: "2026-09-04T00:00:00Z", lockedGen: 2,
    sponsorCreditGen: 0, contractorCreditGen: 0, ...extras,
  };
}

function adapter(value: Agreement): ContractAdapter {
  const transaction = async () => ({ hash: HASH });
  return {
    configuration: { readConfigured: true, writeConfigured: true, networkName: "Studionet", contractAddress: "0x" + "1".repeat(40), icReadPath: "/genlayer-rpc", walletWriteChainId: "0xf22f" },
    getAgreement: vi.fn(async () => value), listAgreements: vi.fn(async () => [value]), getCredit: vi.fn(async () => 0),
    waitForAccepted: vi.fn(async () => undefined), waitForFinality: vi.fn(async () => undefined),
    createAgreement: vi.fn(transaction), ratifyAgreement: vi.fn(transaction), reviewModification: vi.fn(transaction),
    proposeAllocation: vi.fn(transaction), acceptAllocation: vi.fn(transaction), recoverExpired: vi.fn(transaction), withdrawCredit: vi.fn(transaction),
  };
}

function wallet(account: string): DetectedWallet {
  return { id: account, name: "Test wallet", source: "eip6963", provider: { request: vi.fn(async ({ method }) => method === "eth_requestAccounts" ? [account] : "0xf22f") } };
}

async function renderConnected(path: string, contract: ContractAdapter, account: string) {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={[path]}><App adapter={contract} discoverWallets={async () => [wallet(account)]} /></MemoryRouter>);
  await user.click(screen.getByRole("button", { name: "Connect a wallet" }));
  await user.click(await screen.findByRole("button", { name: "Test wallet" }));
  return user;
}

describe("browser lifecycle controls", () => {
  it("submits the create form as an exact 2 GEN contract action", async () => {
    const contract = adapter(agreement("DRAFT"));
    await renderConnected("/agreements/new", contract, SPONSOR);
    fireEvent.change(screen.getByLabelText("Agreement ID"), { target: { value: "scope-1" } });
    fireEvent.change(screen.getByLabelText("Ratification deadline"), { target: { value: "2026-09-02T00:00" } });
    fireEvent.change(screen.getByLabelText("Review deadline"), { target: { value: "2026-09-03T00:00" } });
    fireEvent.change(screen.getByLabelText("Negotiation window in hours"), { target: { value: "1" } });
    fireEvent.submit(screen.getByRole("button", { name: "Create and fund with 2 GEN" }).closest("form")!);
    await vi.waitFor(() => expect(contract.createAgreement).toHaveBeenCalledWith(expect.objectContaining({ id: "scope-1", negotiationWindowSeconds: 3600 })));
  });

  it("lets only the contractor ratify and reloads after accepted/finalized", async () => {
    const contract = adapter(agreement("DRAFT"));
    const user = await renderConnected("/agreements/scope-1", contract, CONTRACTOR);
    await user.click(await screen.findByRole("button", { name: "Ratify locked terms" }));
    await vi.waitFor(() => expect(contract.ratifyAgreement).toHaveBeenCalledWith("scope-1"));
    expect(contract.waitForAccepted).toHaveBeenCalledWith(HASH);
    expect(contract.waitForFinality).toHaveBeenCalledWith(HASH);
    expect(contract.getAgreement).toHaveBeenCalledTimes(2);
  });

  it("surfaces review, retry, recovery, and withdrawal only in matching canonical states", async () => {
    const active = adapter(agreement("ACTIVE"));
    const user = await renderConnected("/agreements/scope-1", active, SPONSOR);
    await user.type(await screen.findByLabelText("Modification TED publication"), "00587863-2026");
    await user.click(screen.getByRole("button", { name: "Request official review" }));
    expect(active.reviewModification).toHaveBeenCalledWith("scope-1", "00587863-2026");
    await user.click(screen.getByRole("button", { name: "Recover after expiry" }));
    expect(active.recoverExpired).toHaveBeenCalledWith("scope-1");
  });

  it("keeps retry explicit when canonical state is RETRYABLE", async () => {
    const retryable = adapter(agreement("RETRYABLE", { modificationPublication: "00587863-2026" }));
    const user = await renderConnected("/agreements/scope-1", retryable, CONTRACTOR);
    await user.type(await screen.findByLabelText("Modification TED publication"), "00587863-2026");
    await user.click(screen.getByRole("button", { name: "Retry official review" }));
    expect(retryable.reviewModification).toHaveBeenCalledWith("scope-1", "00587863-2026");
  });

  it("maps sponsor proposal and contractor acceptance controls", async () => {
    const proposed = agreement("NEGOTIATION", { proposalNonce: 2, contractorAllocationGen: 1 });
    const sponsorAdapter = adapter(proposed);
    const sponsorView = await renderConnected("/agreements/scope-1/negotiate", sponsorAdapter, SPONSOR);
    await sponsorView.selectOptions(await screen.findByLabelText("Contractor allocation"), "2");
    await sponsorView.click(screen.getByRole("button", { name: "Propose allocation" }));
    expect(sponsorAdapter.proposeAllocation).toHaveBeenCalledWith("scope-1", 2);
  });

  it("accepts only the current canonical proposal nonce", async () => {
    const proposed = adapter(agreement("NEGOTIATION", { proposalNonce: 2, contractorAllocationGen: 1 }));
    const user = await renderConnected("/agreements/scope-1/negotiate", proposed, CONTRACTOR);
    await user.click(await screen.findByRole("button", { name: "Accept proposal nonce 2" }));
    expect(proposed.acceptAllocation).toHaveBeenCalledWith("scope-1", 2);
  });

  it("shows agreement-scoped withdrawal for a finalized credit", async () => {
    const settled = adapter(agreement("SETTLED", { contractorCreditGen: 2, lockedGen: 0 }));
    const user = await renderConnected("/agreements/scope-1", settled, CONTRACTOR);
    await user.click(await screen.findByRole("button", { name: "Withdraw credit" }));
    expect(settled.withdrawCredit).toHaveBeenCalledWith("scope-1");
  });
});
