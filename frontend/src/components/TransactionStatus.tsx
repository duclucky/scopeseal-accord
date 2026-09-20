import { useTransactions } from "../transactions/TransactionProvider";


export function TransactionStatus() {
  const { state } = useTransactions();
  if (state.phase === "idle") return null;
  const labels = {
    submitting: "Preparing Studio Dev fee quote",
    submitted: "Submitted — waiting for consensus acceptance",
    accepted: "Accepted — waiting for finalization",
    finalized: "Finalized — canonical state reloaded",
    failed: "Transaction failed",
  };
  const formatGen = (value: bigint) => {
    const gen = 10n ** 18n;
    const whole = value / gen;
    const fraction = (value % gen).toString().padStart(18, "0").slice(0, 6).replace(/0+$/u, "");
    return fraction ? `${whole}.${fraction} GEN` : `${whole} GEN`;
  };
  return (
    <aside className={`transaction-status transaction-${state.phase}`} role="status" aria-live="polite">
      <strong>{labels[state.phase]}</strong>
      {state.feeQuote ? <p>Maximum network fee authorized: {formatGen(state.feeQuote.maximumFeeAtto)} · application value: {formatGen(state.feeQuote.applicationValueAtto)}</p> : null}
      {state.feeOutcome?.actualFeeAtto !== undefined ? <p>Actual network fee: {formatGen(state.feeOutcome.actualFeeAtto)}</p> : null}
      {state.feeOutcome?.refundedFeeAtto !== undefined ? <p>Network fee refunded: {formatGen(state.feeOutcome.refundedFeeAtto)}</p> : null}
      {state.hash ? <code>{state.hash}</code> : null}
      {state.error ? <p>{state.error}</p> : null}
    </aside>
  );
}
