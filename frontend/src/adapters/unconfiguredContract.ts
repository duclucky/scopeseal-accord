import type { ContractAdapter } from "./contract";

export class ContractConfigurationError extends Error {
  constructor() {
    super("ScopeSeal contract is not configured");
    this.name = "ContractConfigurationError";
  }
}

function unavailable(): never {
  throw new ContractConfigurationError();
}

export const unconfiguredContract: ContractAdapter = {
  async getAgreement() { return unavailable(); },
  async listAgreements() { return unavailable(); },
  async getCredit() { return unavailable(); },
  async createAgreement() { return unavailable(); },
  async ratifyAgreement() { return unavailable(); },
  async reviewModification() { return unavailable(); },
  async proposeAllocation() { return unavailable(); },
  async acceptAllocation() { return unavailable(); },
  async recoverExpired() { return unavailable(); },
  async withdrawCredit() { return unavailable(); },
};
