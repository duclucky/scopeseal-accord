import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useWallet } from "./WalletProvider";

export function WalletPickerDialog() {
  const { pickerOpen, closePicker, discovering, wallets, selectWallet, error } = useWallet();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePicker();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pickerOpen, closePicker]);

  if (!pickerOpen) return null;

  return createPortal(
    <div className="dialog-scrim" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) closePicker();
    }}>
      <section className="wallet-dialog" role="dialog" aria-modal="true" aria-labelledby="wallet-dialog-title">
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">Browser wallets</p>
            <h2 id="wallet-dialog-title">Choose a wallet</h2>
          </div>
          <button ref={closeRef} className="icon-button" type="button" onClick={closePicker} aria-label="Close wallet picker">
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <p>Select the provider that will request your account and sign ScopeSeal transactions.</p>
        {discovering ? <p role="status">Scanning this browser for compatible wallets...</p> : null}
        {!discovering && wallets.length === 0 && !error ? (
          <p className="inline-notice">No compatible EVM wallets detected.</p>
        ) : null}
        {error ? <p className="inline-error" role="alert">{error}</p> : null}
        <div className="wallet-list">
          {wallets.map((wallet) => (
            <button key={wallet.id} type="button" aria-label={wallet.name} onClick={() => void selectWallet(wallet)}>
              <span className="wallet-glyph" aria-hidden="true">{wallet.name.slice(0, 1).toUpperCase()}</span>
              <span><strong>{wallet.name}</strong><small>{wallet.source === "eip6963" ? "EIP-6963 provider" : "Injected provider"}</small></span>
            </button>
          ))}
        </div>
      </section>
    </div>,
    document.body,
  );
}
