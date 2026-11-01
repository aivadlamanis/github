import { NextResponse } from "next/server";
import { authConfig, isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const cfg = authConfig();
  return NextResponse.json({
    authenticated: isAuthenticated(request),
    required: cfg.mode !== "open",
    misconfigured: cfg.mode === "misconfigured",
  });
}
