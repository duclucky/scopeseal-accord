import { CaretDown, SignOut } from "@phosphor-icons/react";
import { useState } from "react";
import { useWallet } from "./WalletProvider";

function shorten(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AccountMenu() {
  const { account, selectedWallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  if (!account || !selectedWallet) return null;

  return (
    <div className="account-menu">
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span><small>{selectedWallet.name}</small>{shorten(account)}</span>
        <CaretDown size={17} aria-hidden="true" />
      </button>
      {open ? (
        <div className="account-popover">
          <span>Connected account</span>
          <code>{account}</code>
          <button type="button" onClick={disconnect}>
            <SignOut size={18} aria-hidden="true" />
            Disconnect wallet
          </button>
        </div>
      ) : null}
    </div>
  );
}
