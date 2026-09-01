export type AgreementState =
  | "DRAFT"
  | "ACTIVE"
  | "REVIEW_PENDING"
  | "WITHIN_BASELINE"
  | "NEGOTIATION"
  | "RETRYABLE"
  | "SETTLED"
  | "CLOSED";

export type Agreement = {
  id: string;
  sponsor: string;
  contractor: string;
  state: AgreementState;
  originalPublication: string;
  originalNoticeUuidVersion: string;
  buyerId: string;
  procedureId: string;
  contractReference: string;
  allowance: string;
  ratificationDeadline: number;
  reviewDeadline: number;
  negotiationDeadline: number;
  lockedGen: number;
  sponsorCreditGen: number;
  contractorCreditGen: number;
  modificationPublication?: string;
  verdict?: "WITHIN_BASELINE" | "MATERIAL_AMENDMENT" | "UNVERIFIABLE";
  proposalNonce?: number;
  contractorAllocationGen?: 0 | 1 | 2;
};

export type CreateAgreementInput = {
  contractor: string;
  originalPublication: string;
  originalNoticeUuidVersion: string;
  buyerId: string;
  procedureId: string;
  contractReference: string;
  allowance: string;
  ratificationDeadline: number;
  reviewDeadline: number;
  negotiationWindowSeconds: number;
};
