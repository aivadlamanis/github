/**
 * End-to-end test of the chat route with a local mock of the Anthropic API.
 * It exercises auth, validation, the tool loop, document reads, source
 * metadata, conflict warnings and streaming. It does NOT test real model
 * quality, which needs a real ANTHROPIC_API_KEY.
 * Run with: npm run test:chat
 */
import http from "node:http";
import type { AddressInfo } from "node:net";
import assert from "node:assert/strict";

type MockRequest = {
  messages: { role: string; content: unknown }[];
};

const seenRequests: MockRequest[] = [];

function sse(res: http.ServerResponse, events: [string, unknown][]) {
  res.writeHead(200, { "content-type": "text/event-stream" });
  for (const [name, data] of events) {
    res.write(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
  }
  res.end();
}

function messageStart() {
  return [
    "message_start",
    {
      type: "message_start",
      message: {
        id: "msg_mock",
        type: "message",
        role: "assistant",
        model: "mock",
        content: [],
        stop_reason: null,
        stop_sequence: null,
        usage: { input_tokens: 1, output_tokens: 1 },
      },
    },
  ] as [string, unknown];
}

function toolTurn(calls: { id: string; name: string; input: object }[], preamble?: string) {
  const events: [string, unknown][] = [messageStart()];
  let index = 0;
  if (preamble) {
    events.push(
      ["content_block_start", { type: "content_block_start", index, content_block: { type: "text", text: "" } }],
      ["content_block_delta", { type: "content_block_delta", index, delta: { type: "text_delta", text: preamble } }],
      ["content_block_stop", { type: "content_block_stop", index }],
    );
    index++;
  }
  for (const c of calls) {
    events.push(
      ["content_block_start", { type: "content_block_start", index, content_block: { type: "tool_use", id: c.id, name: c.name, input: {} } }],
      ["content_block_delta", { type: "content_block_delta", index, delta: { type: "input_json_delta", partial_json: JSON.stringify(c.input) } }],
      ["content_block_stop", { type: "content_block_stop", index }],
    );
    index++;
  }
  events.push(
    ["message_delta", { type: "message_delta", delta: { stop_reason: "tool_use", stop_sequence: null }, usage: { output_tokens: 5 } }],
    ["message_stop", { type: "message_stop" }],
  );
  return events;
}

function textTurn(text: string) {
  const events: [string, unknown][] = [
    messageStart(),
    ["content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }],
  ];
  for (const piece of text.match(/.{1,12}/gs) ?? []) {
    events.push(["content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: piece } }]);
  }
  events.push(
    ["content_block_stop", { type: "content_block_stop", index: 0 }],
    ["message_delta", { type: "message_delta", delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 20 } }],
    ["message_stop", { type: "message_stop" }],
  );
  return events;
}

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const parsed = JSON.parse(body) as MockRequest;
    seenRequests.push(parsed);
    const toolResults = parsed.messages.filter(
      (m) => Array.isArray(m.content) && (m.content as { type: string }[]).some((b) => b.type === "tool_result"),
    ).length;
    if (toolResults === 0) {
      return sse(res, toolTurn([{ id: "tu_1", name: "read_index", input: { category: "root" } }], "Let me look."));
    }
    if (toolResults === 1) {
      return sse(res, toolTurn([{ id: "tu_2", name: "read_index", input: { category: "pricing" } }]));
    }
    if (toolResults === 2) {
      return sse(
        res,
        toolTurn([
          { id: "tu_3", name: "read_document", input: { filename: "discount_policy.md" } },
          { id: "tu_4", name: "read_document", input: { filename: "pricing_faq.md" } },
          { id: "tu_5", name: "read_document", input: { filename: "../../etc/passwd" } },
        ]),
      );
    }
    return sse(res, textTurn("Mock answer citing [NEXA-009 discount_policy.md, \"Discretionary Discount Approval Matrix\"]."));
  });
});

async function readEvents(res: Response) {
  const text = await res.text();
  return text
    .split("\n\n")
    .filter((f) => f.startsWith("data: "))
    .map((f) => JSON.parse(f.slice(6)) as { type: string; [k: string]: unknown });
}

function chatRequest(body: unknown, cookie?: string) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "10.0.0.1",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function main() {
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  const port = (server.address() as AddressInfo).port;
  process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${port}`;
  process.env.ANTHROPIC_API_KEY = "test-key";
  process.env.APP_PASSCODE = "team-pass";

  const { POST } = await import("../app/api/chat/route");
  const login = await import("../app/api/login/route");
  const session = await import("../app/api/session/route");

  // 1. No cookie is rejected.
  let res = await POST(chatRequest({ messages: [{ role: "user", content: "hi" }] }));
  assert.equal(res.status, 401, "unauthenticated chat must be rejected");

  // 2. Wrong passcode is rejected, right passcode sets a cookie.
  const bad = await login.POST(
    new Request("http://localhost/api/login", { method: "POST", body: JSON.stringify({ passcode: "nope" }), headers: { "x-forwarded-for": "10.0.0.2" } }),
  );
  assert.equal(bad.status, 401);
  const good = await login.POST(
    new Request("http://localhost/api/login", { method: "POST", body: JSON.stringify({ passcode: "team-pass" }), headers: { "x-forwarded-for": "10.0.0.2" } }),
  );
  assert.equal(good.status, 200);
  const setCookie = good.headers.get("set-cookie") ?? "";
  assert.match(setCookie, /nf_session=/);
  assert.match(setCookie, /HttpOnly/i);
  const cookie = setCookie.split(";")[0] ?? "";

  const sess = await session.GET(new Request("http://localhost/api/session", { headers: { cookie } }));
  assert.equal(((await sess.json()) as { authenticated: boolean }).authenticated, true);

  // 3. Invalid body is rejected.
  res = await POST(chatRequest({ messages: [] }, cookie));
  assert.equal(res.status, 400);
  res = await POST(chatRequest({ messages: [{ role: "assistant", content: "x" }] }, cookie));
  assert.equal(res.status, 400, "last message must be from the user");

  // 4. Full tool loop.
  res = await POST(
    chatRequest({ messages: [{ role: "user", content: "Who approves a 25% discount?" }] }, cookie),
  );
  assert.equal(res.status, 200);
  const events = await readEvents(res);
  const types = events.map((e) => e.type);
  assert.ok(types.includes("reset"), "preamble text before a tool call must be reset");
  assert.ok(types.includes("done"));
  assert.ok(!types.includes("error"), `unexpected error event: ${JSON.stringify(events.find((e) => e.type === "error"))}`);
  const statuses = events.filter((e) => e.type === "status").map((e) => e.text);
  assert.ok(statuses.includes("Reading index.md"), "should read root index first");
  assert.ok(statuses.includes("Reading pricing/index.md"));
  assert.ok(statuses.includes("Reading pricing/discount_policy.md"));
  assert.ok(statuses.some((s) => String(s).startsWith("Unknown document")), "path traversal attempt must fail safely");

  const finalText = events.filter((e) => e.type === "text").map((e) => e.delta).join("");
  assert.match(finalText, /Mock answer citing/);

  const sourcesEvent = events.find((e) => e.type === "sources") as unknown as {
    sources: { filename: string; authoritative: string; containsOutdated: boolean; internalOnly: boolean; documentId: string }[];
    warnings: { id: string }[];
  };
  assert.deepEqual(sourcesEvent.sources.map((s) => s.filename).sort(), ["discount_policy.md", "pricing_faq.md"]);
  const faq = sourcesEvent.sources.find((s) => s.filename === "pricing_faq.md");
  assert.equal(faq?.documentId, "NEXA-019");
  assert.equal(faq?.containsOutdated, true, "pricing_faq must be flagged outdated");
  assert.ok(faq?.authoritative.startsWith("No"), "pricing_faq must be non-authoritative");
  const policy = sourcesEvent.sources.find((s) => s.filename === "discount_policy.md");
  assert.equal(policy?.internalOnly, true, "discount_policy must be flagged internal");
  assert.deepEqual(sourcesEvent.warnings.map((w) => w.id), ["discount-approval"]);

  // 5. The full document text reached the model as a tool result.
  const lastReq = seenRequests[seenRequests.length - 1];
  const flat = JSON.stringify(lastReq?.messages);
  assert.ok(flat.includes("Discretionary Discount Approval Matrix"), "document body must be sent to the model");
  assert.ok(flat.includes("Unknown document") === false, "error labels stay server side");
  assert.ok(flat.includes("no such document"), "failed lookup returns an error tool result");

  console.log("All chat route checks passed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => server.close());
