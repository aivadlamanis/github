import { NextResponse } from "next/server";
import {
  authConfig,
  clientIp,
  makeSessionCookie,
  passcodeMatches,
} from "@/lib/auth";
import { rateLimited } from "@/lib/ratelimit";
import { LoginRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const cfg = authConfig();
  if (cfg.mode === "misconfigured") {
    return NextResponse.json(
      { error: "The server has no APP_PASSCODE configured." },
      { status: 503 },
    );
  }
  if (cfg.mode === "open") {
    return NextResponse.json({ ok: true });
  }
  if (rateLimited(`login:${clientIp(request)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const parsed = LoginRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !passcodeMatches(parsed.data.passcode, cfg.passcode)) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const cookie = makeSessionCookie(cfg.secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cookie.maxAge,
  });
  return res;
}
