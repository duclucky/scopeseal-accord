import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NetworkStatus, probeStudioDevRpc } from "./NetworkStatus";


describe("Studio Dev browser RPC probe", () => {
  it("uses the same-origin proxy and requires current chain id", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ result: "0xf22d" }), { status: 200 }));
    await expect(probeStudioDevRpc(fetcher as typeof fetch)).resolves.toBe(true);
    expect(fetcher).toHaveBeenCalledWith("/genlayer-rpc", expect.objectContaining({ method: "POST" }));
  });

  it("labels fetch failure honestly", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));
    render(<NetworkStatus />);
    expect(await screen.findByText("Studio Dev RPC unavailable")).toBeVisible();
    vi.unstubAllGlobals();
  });
});
