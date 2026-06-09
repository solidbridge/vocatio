import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { getCaseForToken, logEvent } from "@/lib/cases";
import { createAppealCheckout } from "@/lib/stripe";

const bodySchema = z.object({ caseId: z.string().uuid() });

export async function POST(request: NextRequest) {
  const anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  if (!anonToken) {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const caseRow = await getCaseForToken(parsed.data.caseId, anonToken);
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  if (caseRow.tier === "paid") {
    return NextResponse.json({ error: "This case is already upgraded." }, { status: 409 });
  }

  const session = await createAppealCheckout({
    caseId: caseRow.id,
    email: caseRow.email,
    origin: request.nextUrl.origin,
  });
  await logEvent(caseRow.id, "checkout_started");

  return NextResponse.json({ url: session.url });
}
