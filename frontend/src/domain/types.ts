export type AgreementState =
  | "DRAFT"
  | "ACTIVE"
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
  originalNoticeUuid: string;
  originalNoticeVersion: string;
  buyerId: string;
  procedureId: string;
  contractReference: string;
  canonicalObjective: string;
  allowance: string;
  ratificationDeadline: string;
  reviewDeadline: string;
  negotiationDeadline: string;
  lockedGen: number;
  sponsorCreditGen: number;
  contractorCreditGen: number;
  modificationPublication?: string;
  verdict?: "WITHIN_BASELINE" | "MATERIAL_AMENDMENT" | "UNVERIFIABLE" | "NEGOTIATED" | "EXPIRED_RECOVERY";
  proposalNonce?: number;
  contractorAllocationGen?: 0 | 1 | 2;
};

export type CreateAgreementInput = {
  id: string;
  contractor: string;
  originalPublication: string;
  originalNoticeUuid: string;
  originalNoticeVersion: string;
  buyerId: string;
  procedureId: string;
  contractReference: string;
  canonicalObjective: string;
  allowance: string;
  ratificationDeadline: string;
  reviewDeadline: string;
  negotiationWindowSeconds: number;
};
