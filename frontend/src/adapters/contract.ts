import type { Agreement, CreateAgreementInput } from "../domain/types";

export type TransactionReference = { hash: string };

export interface ContractAdapter {
  getAgreement(id: string): Promise<Agreement>;
  listAgreements(account: string): Promise<Agreement[]>;
  getCredit(account: string): Promise<{ sponsorGen: number; contractorGen: number }>;
  createAgreement(input: CreateAgreementInput): Promise<TransactionReference>;
  ratifyAgreement(id: string): Promise<TransactionReference>;
  reviewModification(id: string, modificationPublication: string): Promise<TransactionReference>;
  proposeAllocation(id: string, contractorGen: 0 | 1 | 2): Promise<TransactionReference>;
  acceptAllocation(id: string, proposalNonce: number): Promise<TransactionReference>;
  recoverExpired(id: string): Promise<TransactionReference>;
  withdrawCredit(): Promise<TransactionReference>;
}
