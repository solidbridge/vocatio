import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { captureEmail, logEvent } from "@/lib/cases";
import { sendLetterReadyEmail } from "@/lib/email";

const bodySchema = z.object({
  caseId: z.string().uuid(),
  email: z.string().email().max(254),
});

export async function POST(request: NextRequest) {
  const anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  if (!anonToken) {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const { caseId, email } = parsed.data;
  const caseRow = await captureEmail(caseId, anonToken, email);
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  await logEvent(caseId, "email_captured");

  // Best-effort notification; the unlock must not depend on email delivery.
  try {
    const origin = request.nextUrl.origin;
    await sendLetterReadyEmail({
      to: email,
      caseUrl: `${origin}/case/${caseId}`,
      deadline: caseRow.appealDeadline,
    });
  } catch (error) {
    console.error("letter-ready email failed", error);
  }

  return NextResponse.json({ ok: true });
}
