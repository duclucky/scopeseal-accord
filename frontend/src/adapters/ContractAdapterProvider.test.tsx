import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ContractAdapter } from "./contract";
import { ContractAdapterProvider, useContractAdapter } from "./ContractAdapterProvider";
import { ContractConfigurationError } from "./unconfiguredContract";

describe("ContractAdapterProvider", () => {
  it("is honestly unconfigured by default and accepts an explicit runtime adapter", async () => {
    const defaultHook = renderHook(() => useContractAdapter(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ContractAdapterProvider>{children}</ContractAdapterProvider>
      ),
    });
    await expect(defaultHook.result.current.getAgreement("AGR-001")).rejects.toBeInstanceOf(
      ContractConfigurationError,
    );

    const adapter = { getAgreement: vi.fn() } as unknown as ContractAdapter;
    const configuredHook = renderHook(() => useContractAdapter(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <ContractAdapterProvider adapter={adapter}>{children}</ContractAdapterProvider>
      ),
    });
    expect(configuredHook.result.current).toBe(adapter);
  });
});
