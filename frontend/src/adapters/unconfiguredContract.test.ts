import { describe, expect, it } from "vitest";
import { ContractConfigurationError, unconfiguredContract } from "./unconfiguredContract";

describe("unconfigured contract adapter", () => {
  it("fails reads and writes honestly instead of returning canonical-looking fixtures", async () => {
    await expect(unconfiguredContract.getAgreement("AGR-001")).rejects.toBeInstanceOf(
      ContractConfigurationError,
    );
    await expect(unconfiguredContract.createAgreement({} as never)).rejects.toThrow(
      "ScopeSeal contract is not configured",
    );
  });
});
