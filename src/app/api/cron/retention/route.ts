import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredCases } from "@/lib/cases";

/**
 * Retention sweep — wire to Vercel Cron (e.g. daily). Free cases are deleted
 * 30 days after creation, paid cases after ~18 months, per the privacy policy.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const purged = await purgeExpiredCases();
  return NextResponse.json({ purged });
}
