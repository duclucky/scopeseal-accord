import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NetworkStatus, probeStudionetRpc } from "./NetworkStatus";


describe("Studionet browser RPC probe", () => {
  it("uses the same-origin proxy and requires current chain id", async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ result: "0xf22f" }), { status: 200 }));
    await expect(probeStudionetRpc(fetcher as typeof fetch)).resolves.toBe(true);
    expect(fetcher).toHaveBeenCalledWith("/genlayer-rpc", expect.objectContaining({ method: "POST" }));
  });

  it("labels fetch failure honestly", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("Failed to fetch"); }));
    render(<NetworkStatus />);
    expect(await screen.findByText("Studionet RPC unavailable")).toBeVisible();
    vi.unstubAllGlobals();
  });
});
