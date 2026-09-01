import { Wallet } from "@phosphor-icons/react";
import { AccountMenu } from "./AccountMenu";
import { useWallet } from "./WalletProvider";
import { WalletPickerDialog } from "./WalletPickerDialog";

export function WalletControls() {
  const { account, openPicker } = useWallet();
  return (
    <>
      {account ? (
        <AccountMenu />
      ) : (
        <button className="button button-accent" type="button" onClick={() => void openPicker()}>
          <Wallet size={19} aria-hidden="true" />
          Connect a wallet
        </button>
      )}
      <WalletPickerDialog />
    </>
  );
}
