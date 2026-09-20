import type { Agreement, Closeout, CreateAgreementInput, OpenCloseoutInput } from "../domain/types";

export type ProtocolFeeQuote = {
  maximumFeeAtto: bigint;
  applicationValueAtto: bigint;
};

export type TransactionOutcome = {
  actualFeeAtto?: bigint;
  refundedFeeAtto?: bigint;
};

export type TransactionReference = { hash: string; feeQuote?: ProtocolFeeQuote };

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
  waitForFinality(hash: string): Promise<TransactionOutcome | void>;
  createAgreement(input: CreateAgreementInput): Promise<TransactionReference>;
  ratifyAgreement(id: string): Promise<TransactionReference>;
  reviewModification(id: string, modificationPublication: string): Promise<TransactionReference>;
  proposeAllocation(id: string, contractorGen: 0 | 1 | 2): Promise<TransactionReference>;
  acceptAllocation(id: string, proposalNonce: number): Promise<TransactionReference>;
  recoverExpired(id: string): Promise<TransactionReference>;
  withdrawCredit(id: string): Promise<TransactionReference>;
  getCloseout(id: string): Promise<Closeout | null>;
  getCloseoutCredit(id: string, account: string): Promise<number>;
  openCloseout(input: OpenCloseoutInput): Promise<TransactionReference>;
  ratifyCloseout(id: string): Promise<TransactionReference>;
  reviewCloseout(id: string, completionPublication: string): Promise<TransactionReference>;
  proposeCloseoutAllocation(id: string, contractorGen: 0 | 1): Promise<TransactionReference>;
  acceptCloseoutAllocation(id: string, proposalNonce: number): Promise<TransactionReference>;
  recoverCloseout(id: string): Promise<TransactionReference>;
  withdrawCloseoutCredit(id: string): Promise<TransactionReference>;
}
