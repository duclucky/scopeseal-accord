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
  configuration: {
    readConfigured: false,
    writeConfigured: false,
    networkName: "Studio Dev",
    icReadPath: "/genlayer-rpc",
    walletWriteChainId: "0xf22d",
  },
  async getAgreement() { return unavailable(); },
  async listAgreements() { return unavailable(); },
  async getCredit() { return unavailable(); },
  async waitForAccepted() { return unavailable(); },
  async waitForFinality() { return unavailable(); },
  async createAgreement() { return unavailable(); },
  async ratifyAgreement() { return unavailable(); },
  async reviewModification() { return unavailable(); },
  async proposeAllocation() { return unavailable(); },
  async acceptAllocation() { return unavailable(); },
  async recoverExpired() { return unavailable(); },
  async withdrawCredit() { return unavailable(); },
  async getCloseout() { return unavailable(); },
  async getCloseoutCredit() { return unavailable(); },
  async openCloseout() { return unavailable(); },
  async ratifyCloseout() { return unavailable(); },
  async reviewCloseout() { return unavailable(); },
  async proposeCloseoutAllocation() { return unavailable(); },
  async acceptCloseoutAllocation() { return unavailable(); },
  async recoverCloseout() { return unavailable(); },
  async withdrawCloseoutCredit() { return unavailable(); },
};
