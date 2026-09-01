import { useTransactions } from "../transactions/TransactionProvider";


export function TransactionStatus() {
  const { state } = useTransactions();
  if (state.phase === "idle") return null;
  const labels = {
    submitting: "Confirm in your selected wallet",
    submitted: "Submitted — waiting for consensus acceptance",
    accepted: "Accepted — waiting for finalization",
    finalized: "Finalized — canonical state reloaded",
    failed: "Transaction failed",
  };
  return (
    <aside className={`transaction-status transaction-${state.phase}`} role="status" aria-live="polite">
      <strong>{labels[state.phase]}</strong>
      {state.hash ? <code>{state.hash}</code> : null}
      {state.error ? <p>{state.error}</p> : null}
    </aside>
  );
}
