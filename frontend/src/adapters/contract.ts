import type { Agreement, CreateAgreementInput } from "../domain/types";

export type TransactionReference = { hash: string };

export type AdapterConfiguration = {
  readConfigured: boolean;
  writeConfigured: boolean;
  networkName: string;
  contractAddress?: string;
  icReadPath: string;
  walletWriteChainId: string;
};

export interface ContractAdapter {
  configuration: AdapterConfiguration;
  getAgreement(id: string): Promise<Agreement>;
  listAgreements(account: string): Promise<Agreement[]>;
  getCredit(id: string, account: string): Promise<number>;
  waitForAccepted(hash: string): Promise<void>;
  waitForFinality(hash: string): Promise<void>;
  createAgreement(input: CreateAgreementInput): Promise<TransactionReference>;
  ratifyAgreement(id: string): Promise<TransactionReference>;
  reviewModification(id: string, modificationPublication: string): Promise<TransactionReference>;
  proposeAllocation(id: string, contractorGen: 0 | 1 | 2): Promise<TransactionReference>;
  acceptAllocation(id: string, proposalNonce: number): Promise<TransactionReference>;
  recoverExpired(id: string): Promise<TransactionReference>;
  withdrawCredit(id: string): Promise<TransactionReference>;
}
