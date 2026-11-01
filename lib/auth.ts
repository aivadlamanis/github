import crypto from "node:crypto";

/**
 * Shared-passcode gate for the prototype.
 * - APP_PASSCODE: the passcode your team types in.
 * - SESSION_SECRET (optional): signs the session cookie. Falls back to APP_PASSCODE.
 * In production the app refuses to answer if no passcode is configured.
 * In development with no passcode set, the gate is open for convenience.
 */

export const COOKIE_NAME = "nf_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export type AuthConfig =
  | { mode: "open" }
  | { mode: "locked"; passcode: string; secret: string }
  | { mode: "misconfigured" };

export function authConfig(): AuthConfig {
  const passcode = process.env.APP_PASSCODE;
  if (!passcode) {
    return process.env.NODE_ENV === "production"
      ? { mode: "misconfigured" }
      : { mode: "open" };
  }
  return {
    mode: "locked",
    passcode,
    secret: process.env.SESSION_SECRET || passcode,
  };
}

function sha256(value: string): Buffer {
  return crypto.createHash("sha256").update(value).digest();
}

export function passcodeMatches(input: string, expected: string): boolean {
  return crypto.timingSafeEqual(sha256(input), sha256(expected));
}

function sessionToken(secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update("nexaflow-kb-chat-session-v1")
    .digest("hex");
}

export function makeSessionCookie(secret: string): {
  name: string;
  value: string;
  maxAge: number;
} {
  return { name: COOKIE_NAME, value: sessionToken(secret), maxAge: MAX_AGE_SECONDS };
}

function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return undefined;
}

export function isAuthenticated(request: Request): boolean {
  const cfg = authConfig();
  if (cfg.mode === "open") return true;
  if (cfg.mode === "misconfigured") return false;
  const value = readCookie(request.headers.get("cookie"), COOKIE_NAME);
  if (!value) return false;
  const expected = sessionToken(cfg.secret);
  if (value.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}
