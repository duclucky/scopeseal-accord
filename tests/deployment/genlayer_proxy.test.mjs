import test from "node:test";
import assert from "node:assert/strict";

import handler from "../../frontend/api/genlayer-rpc.js";


function responseRecorder() {
  const record = { statusCode: 200, headers: {}, body: undefined };
  return {
    record,
    status(code) { record.statusCode = code; return this; },
    setHeader(name, value) { record.headers[name.toLowerCase()] = value; },
    json(value) { record.body = value; return this; },
    send(value) { record.body = value; return this; },
    end() { return this; },
  };
}


test("production proxy forwards only bounded GenLayer read RPC", async () => {
  const originalFetch = globalThis.fetch;
  let forwarded;
  globalThis.fetch = async (url, init) => {
    forwarded = { url, payload: JSON.parse(init.body) };
    return new Response(JSON.stringify({ jsonrpc: "2.0", id: 7, result: "0xf22f" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  try {
    const response = responseRecorder();
    await handler({
      method: "POST",
      headers: { "content-length": "74" },
      body: { jsonrpc: "2.0", id: 7, method: "eth_chainId", params: [] },
    }, response);
    assert.equal(forwarded.url, "https://studio.genlayer.com/api");
    assert.deepEqual(forwarded.payload, { jsonrpc: "2.0", id: 7, method: "eth_chainId", params: [] });
    assert.equal(response.record.statusCode, 200);
    assert.match(response.record.body, /0xf22f/u);
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test("production proxy refuses wallet writes and oversized bodies", async () => {
  const writeResponse = responseRecorder();
  await handler({
    method: "POST",
    headers: { "content-length": "100" },
    body: { jsonrpc: "2.0", id: 1, method: "eth_sendRawTransaction", params: ["0x00"] },
  }, writeResponse);
  assert.equal(writeResponse.record.statusCode, 403);

  const largeResponse = responseRecorder();
  await handler({
    method: "POST",
    headers: { "content-length": "40000" },
    body: { jsonrpc: "2.0", id: 1, method: "gen_call", params: [] },
  }, largeResponse);
  assert.equal(largeResponse.record.statusCode, 413);
});
