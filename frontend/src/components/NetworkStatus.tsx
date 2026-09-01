import { useEffect, useState } from "react";


type NetworkState = "checking" | "ready" | "unavailable";

export async function probeStudionetRpc(fetcher: typeof fetch = fetch): Promise<boolean> {
  const response = await fetcher("/genlayer-rpc", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_chainId", params: [] }),
  });
  if (!response.ok) return false;
  const body = await response.json() as { result?: string };
  return body.result === "0xf22f";
}


export function NetworkStatus() {
  const [state, setState] = useState<NetworkState>("checking");
  useEffect(() => {
    let active = true;
    void probeStudionetRpc().then((ready) => { if (active) setState(ready ? "ready" : "unavailable"); }).catch(() => { if (active) setState("unavailable"); });
    return () => { active = false; };
  }, []);
  return <span className={`network-status network-${state}`} role="status">Studionet RPC {state}</span>;
}
