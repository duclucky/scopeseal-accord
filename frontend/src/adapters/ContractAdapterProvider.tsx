import { createContext, useContext, type ReactNode } from "react";
import type { ContractAdapter } from "./contract";
import { unconfiguredContract } from "./unconfiguredContract";

const ContractAdapterContext = createContext<ContractAdapter>(unconfiguredContract);

type ContractAdapterProviderProps = {
  adapter?: ContractAdapter;
  children: ReactNode;
};

export function ContractAdapterProvider({
  adapter = unconfiguredContract,
  children,
}: ContractAdapterProviderProps) {
  return (
    <ContractAdapterContext.Provider value={adapter}>
      {children}
    </ContractAdapterContext.Provider>
  );
}

export function useContractAdapter() {
  return useContext(ContractAdapterContext);
}
