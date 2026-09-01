import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { TransactionProvider, useTransactions } from "./TransactionProvider";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("TransactionProvider", () => {
  it("exposes submitted then finalized and reloads canonical state only after finality", async () => {
    const finality = deferred<void>();
    const reload = vi.fn().mockResolvedValue(undefined);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TransactionProvider>{children}</TransactionProvider>
    );
    const { result } = renderHook(() => useTransactions(), { wrapper });

    let operation!: Promise<void>;
    act(() => {
      operation = result.current.run({
        label: "Create agreement",
        submit: async () => ({ hash: "0xabc" }),
        waitForFinality: async () => finality.promise,
        reload,
      });
    });

    await vi.waitFor(() => expect(result.current.state.phase).toBe("submitted"));
    expect(result.current.state.hash).toBe("0xabc");
    expect(reload).not.toHaveBeenCalled();

    finality.resolve();
    await act(async () => operation);

    expect(reload).toHaveBeenCalledOnce();
    expect(result.current.state.phase).toBe("finalized");
  });

  it("reports failure without fabricating a transaction hash", async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TransactionProvider>{children}</TransactionProvider>
    );
    const { result } = renderHook(() => useTransactions(), { wrapper });

    await act(async () => {
      await result.current.run({
        label: "Ratify",
        submit: async () => { throw new Error("User rejected the request"); },
        waitForFinality: async () => undefined,
        reload: async () => undefined,
      });
    });

    expect(result.current.state).toMatchObject({
      phase: "failed",
      hash: undefined,
      error: "User rejected the request",
    });
  });
});
