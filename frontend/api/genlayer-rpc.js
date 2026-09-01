const STUDIONET_RPC = "https://studio.genlayer.com/api";
const MAX_REQUEST_BYTES = 32_768;
const MAX_RESPONSE_BYTES = 524_288;
const READ_METHODS = new Set(["eth_chainId", "gen_call"]);


function fail(response, status, message) {
  return response.status(status).json({ error: message });
}


export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("allow", "POST");
    return fail(response, 405, "POST is required.");
  }
  const declaredLength = Number(request.headers?.["content-length"] ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return fail(response, 413, "RPC request is too large.");
  }
  let payload = request.body;
  if (typeof payload === "string") {
    if (Buffer.byteLength(payload, "utf8") > MAX_REQUEST_BYTES) {
      return fail(response, 413, "RPC request is too large.");
    }
    try {
      payload = JSON.parse(payload);
    } catch {
      return fail(response, 400, "RPC request must be valid JSON.");
    }
  }
  if (
    !payload
    || typeof payload !== "object"
    || Array.isArray(payload)
    || payload.jsonrpc !== "2.0"
    || !READ_METHODS.has(payload.method)
    || !Array.isArray(payload.params)
  ) {
    const forbidden = payload?.method && !READ_METHODS.has(payload.method);
    return fail(response, forbidden ? 403 : 400, "Only bounded GenLayer read RPC is allowed.");
  }
  const serialized = JSON.stringify(payload);
  if (Buffer.byteLength(serialized, "utf8") > MAX_REQUEST_BYTES) {
    return fail(response, 413, "RPC request is too large.");
  }
  try {
    const upstream = await fetch(STUDIONET_RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: serialized,
    });
    const body = await upstream.text();
    if (Buffer.byteLength(body, "utf8") > MAX_RESPONSE_BYTES) {
      return fail(response, 502, "RPC response exceeded the safe limit.");
    }
    response.setHeader("content-type", "application/json; charset=utf-8");
    return response.status(upstream.status).send(body);
  } catch {
    return fail(response, 502, "Studionet read RPC is temporarily unavailable.");
  }
}
