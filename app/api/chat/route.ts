import Anthropic from "@anthropic-ai/sdk";
import { clientIp, isAuthenticated } from "@/lib/auth";
import { warningsForDocuments } from "@/lib/conflicts";
import { toSource, type KbDocument } from "@/lib/kb";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { rateLimited } from "@/lib/ratelimit";
import { ChatRequestSchema, type Source, type StreamEvent } from "@/lib/schemas";
import { runTool, toolDefinitions } from "@/lib/tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.NEXAFLOW_MODEL || "claude-sonnet-5-5";
const MAX_STEPS = 10;

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthenticated(request)) {
    return json({ error: "Enter the team passcode to use this app." }, 401);
  }
  if (rateLimited(`chat:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return json({ error: "Too many questions. Wait a few minutes and try again." }, 429);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "The server has no ANTHROPIC_API_KEY configured." }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }
  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: "Invalid request." }, 400);
  }
  const history = parsed.data.messages;
  if (history[history.length - 1]?.role !== "user") {
    return json({ error: "The last message must be from the user." }, 400);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      const opened = new Map<string, KbDocument>();
      try {
        const client = new Anthropic();
        const tools = toolDefinitions();
        const convo: Anthropic.MessageParam[] = history.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        for (let step = 0; step < MAX_STEPS; step++) {
          const live = client.messages.stream({
            model: MODEL,
            max_tokens: 2500,
            system: SYSTEM_PROMPT,
            tools,
            messages: convo,
          });
          let streamedThisTurn = false;
          live.on("text", (delta) => {
            streamedThisTurn = true;
            send({ type: "text", delta });
          });
          const final = await live.finalMessage();
          convo.push({ role: "assistant", content: final.content });

          if (final.stop_reason !== "tool_use") break;

          // Any text written before a tool call is discarded from the UI.
          if (streamedThisTurn) send({ type: "reset" });

          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const block of final.content) {
            if (block.type !== "tool_use") continue;
            const outcome = runTool(block.name, block.input);
            send({ type: "status", text: outcome.label });
            if (outcome.ok && outcome.opened) {
              opened.set(outcome.opened.filename, outcome.opened);
            }
            results.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: outcome.text,
              is_error: !outcome.ok,
            });
          }
          convo.push({ role: "user", content: results });

          if (step === MAX_STEPS - 1) {
            send({ type: "error", message: "Stopped after too many lookup steps." });
          }
        }

        const sources: Source[] = [...opened.values()].map(toSource);
        send({
          type: "sources",
          sources,
          warnings: warningsForDocuments([...opened.keys()]),
        });
        send({ type: "done" });
      } catch (err) {
        console.error("chat error", err);
        const message =
          err instanceof Anthropic.APIError
            ? `The model request failed (${err.status ?? "network"}).`
            : "Something went wrong while answering.";
        send({ type: "error", message });
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      connection: "keep-alive",
    },
  });
}
