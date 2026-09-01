import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { TransactionReference } from "../adapters/contract";

export type TransactionPhase = "idle" | "submitting" | "submitted" | "accepted" | "finalized" | "failed";

export type TransactionState = {
  phase: TransactionPhase;
  label?: string;
  hash?: string;
  error?: string;
};

type TransactionOperation = {
  label: string;
  submit: () => Promise<TransactionReference>;
  waitForAccepted: (hash: string) => Promise<void>;
  waitForFinality: (hash: string) => Promise<void>;
  reload: () => Promise<void>;
};

type TransactionContextValue = {
  state: TransactionState;
  run: (operation: TransactionOperation) => Promise<void>;
  reset: () => void;
};

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TransactionState>({ phase: "idle" });

  const run = useCallback(async ({ label, submit, waitForAccepted, waitForFinality, reload }: TransactionOperation) => {
    setState({ phase: "submitting", label });
    try {
      const transaction = await submit();
      setState({ phase: "submitted", label, hash: transaction.hash });
      await waitForAccepted(transaction.hash);
      setState({ phase: "accepted", label, hash: transaction.hash });
      await waitForFinality(transaction.hash);
      await reload();
      setState({ phase: "finalized", label, hash: transaction.hash });
    } catch (cause) {
      setState((current) => ({
        phase: "failed",
        label,
        hash: current.phase === "submitted" ? current.hash : undefined,
        error: cause instanceof Error ? cause.message : "Transaction failed",
      }));
    }
  }, []);

  const value = useMemo<TransactionContextValue>(
    () => ({ state, run, reset: () => setState({ phase: "idle" }) }),
    [state, run],
  );

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransactions() {
  const value = useContext(TransactionContext);
  if (!value) throw new Error("useTransactions must be used inside TransactionProvider");
  return value;
}
