"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  StreamEventSchema,
  type Source,
  type Warning,
} from "@/lib/schemas";

type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: string;
  sources?: Source[];
  warnings?: Warning[];
  error?: string;
  pending?: boolean;
};

type SessionState =
  | { phase: "loading" }
  | { phase: "locked"; misconfigured: boolean }
  | { phase: "ready" };

const SAMPLE_QUESTIONS = [
  "What is the onboarding process and typical timeline for an enterprise customer?",
  "What does the Enterprise plan cost, and are annual discounts available?",
  "Does the platform support SSO, audit logs and role-based access?",
  "Who needs to approve a 25% discount on a Professional deal?",
  "Which customer case study shows results for a healthcare organisation?",
];

let counter = 0;
const nextId = () => `m${Date.now()}-${counter++}`;

export function Chat() {
  const [session, setSession] = useState<SessionState>({ phase: "loading" });
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/session")
      .then((r) => r.json())
      .then((s: { authenticated: boolean; misconfigured: boolean }) => {
        if (cancelled) return;
        setSession(
          s.authenticated
            ? { phase: "ready" }
            : { phase: "locked", misconfigured: s.misconfigured },
        );
      })
      .catch(() => {
        if (!cancelled) setSession({ phase: "locked", misconfigured: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const patchLast = useCallback((patch: (m: UiMessage) => UiMessage) => {
    setMessages((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last) copy[copy.length - 1] = patch(last);
      return copy;
    });
  }, []);

  const ask = useCallback(
    async (question: string) => {
      const text = question.trim();
      if (!text || busy) return;
      setBusy(true);
      setInput("");

      const history = [
        ...messages
          .filter((m) => m.content && !m.error)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: text },
      ].slice(-12);

      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", content: text },
        { id: nextId(), role: "assistant", content: "", pending: true, status: "Starting" },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (res.status === 401) {
          setSession({ phase: "locked", misconfigured: false });
          patchLast((m) => ({ ...m, pending: false, error: "Your session expired. Enter the passcode again." }));
          return;
        }
        if (!res.ok || !res.body) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          patchLast((m) => ({
            ...m,
            pending: false,
            error: body?.error ?? "The request failed.",
          }));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let boundary: number;
          while ((boundary = buffer.indexOf("\n\n")) !== -1) {
            const frame = buffer.slice(0, boundary);
            buffer = buffer.slice(boundary + 2);
            if (!frame.startsWith("data: ")) continue;
            const parsed = StreamEventSchema.safeParse(JSON.parse(frame.slice(6)));
            if (!parsed.success) continue;
            const ev = parsed.data;
            switch (ev.type) {
              case "status":
                patchLast((m) => ({ ...m, status: ev.text }));
                break;
              case "text":
                patchLast((m) => ({ ...m, content: m.content + ev.delta, status: "Writing answer" }));
                break;
              case "reset":
                patchLast((m) => ({ ...m, content: "" }));
                break;
              case "sources":
                patchLast((m) => ({ ...m, sources: ev.sources, warnings: ev.warnings }));
                break;
              case "error":
                patchLast((m) => ({ ...m, error: ev.message }));
                break;
              case "done":
                patchLast((m) => ({ ...m, pending: false, status: undefined }));
                break;
            }
          }
        }
        patchLast((m) => ({ ...m, pending: false, status: undefined }));
      } catch {
        patchLast((m) => ({
          ...m,
          pending: false,
          error: "Could not reach the server. Check your connection and try again.",
        }));
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, patchLast],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void ask(input);
    }
  };

  if (session.phase === "loading") {
    return <main className="center muted">Loading</main>;
  }
  if (session.phase === "locked") {
    return (
      <Gate
        misconfigured={session.misconfigured}
        onUnlocked={() => setSession({ phase: "ready" })}
      />
    );
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <h1>NexaFlow Knowledge Base</h1>
          <p className="muted">Ask a question. Answers come only from the company documents and cite them.</p>
        </div>
        {messages.length > 0 && (
          <button className="ghost" onClick={() => setMessages([])} disabled={busy}>
            New chat
          </button>
        )}
      </header>

      <main className="thread" aria-live="polite">
        {messages.length === 0 && (
          <section className="empty">
            <h2>Try a question</h2>
            <div className="chips">
              {SAMPLE_QUESTIONS.map((q) => (
                <button key={q} className="chip" onClick={() => void ask(q)} disabled={busy}>
                  {q}
                </button>
              ))}
            </div>
            <p className="muted small">
              Some source documents are internal only. Do not paste internal pricing or discount limits into customer messages.
            </p>
          </section>
        )}

        {messages.map((m) => (
          <MessageView key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </main>

      <form className="composer" onSubmit={onSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about pricing, onboarding, security, case studies..."
          rows={2}
          maxLength={4000}
          aria-label="Your question"
        />
        <button type="submit" disabled={busy || !input.trim()}>
          {busy ? "Working" : "Ask"}
        </button>
      </form>
      <p className="footnote muted small">
        Check exact figures in the cited document before sending them to a customer.
      </p>
    </div>
  );
}

function MessageView({ message }: { message: UiMessage }) {
  if (message.role === "user") {
    return (
      <div className="row user">
        <div className="bubble">{message.content}</div>
      </div>
    );
  }
  return (
    <div className="row assistant">
      <div className="answer">
        {message.pending && message.status && (
          <p className="status" role="status">
            <span className="dot" aria-hidden="true" /> {message.status}
          </p>
        )}
        {message.content && (
          <div className="md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
        {message.error && <p className="error" role="alert">{message.error}</p>}

        {message.warnings && message.warnings.length > 0 && (
          <details className="warnings">
            <summary>
              {message.warnings.length} known {message.warnings.length === 1 ? "conflict" : "conflicts"} in the documents opened
            </summary>
            <ul>
              {message.warnings.map((w) => (
                <li key={w.id}>
                  <strong>{w.title}</strong>
                  <span>{w.detail}</span>
                </li>
              ))}
            </ul>
          </details>
        )}

        {message.sources && message.sources.length > 0 && (
          <div className="sources">
            <h3>Documents used</h3>
            <ul>
              {message.sources.map((s) => (
                <li key={s.filename} className="card">
                  <div className="card-head">
                    <strong>{s.title}</strong>
                    <code>
                      {s.documentId} · {s.path}
                    </code>
                  </div>
                  <div className="badges">
                    <span className="badge">{s.category}</span>
                    <span className="badge">v{s.version}</span>
                    <span className="badge">{s.status}</span>
                    <span className="badge">Updated {s.lastUpdated}</span>
                    {s.authoritative.startsWith("Yes") ? (
                      <span className="badge ok">Authoritative</span>
                    ) : (
                      <span className="badge warn">Not authoritative</span>
                    )}
                    {s.containsOutdated && (
                      <span className="badge bad">Contains outdated info</span>
                    )}
                    {s.internalOnly && <span className="badge neutral">Internal only</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Gate({
  misconfigured,
  onUnlocked,
}: {
  misconfigured: boolean;
  onUnlocked: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        onUnlocked();
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Could not sign in.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="center">
      <form className="gate" onSubmit={submit}>
        <h1>NexaFlow Knowledge Base</h1>
        <p className="muted">Enter the team passcode to continue.</p>
        {misconfigured ? (
          <p className="error" role="alert">
            This deployment has no passcode configured yet, so it is locked.
          </p>
        ) : (
          <>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              autoComplete="current-password"
              autoFocus
              aria-label="Team passcode"
            />
            <button type="submit" disabled={busy || !passcode}>
              {busy ? "Checking" : "Continue"}
            </button>
            {error && <p className="error" role="alert">{error}</p>}
          </>
        )}
      </form>
    </main>
  );
}
