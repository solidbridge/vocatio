import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { getCaseForToken, getLatestLetter, logEvent } from "@/lib/cases";
import { db, schema } from "@/lib/db";
import { sendFax } from "@/lib/fax";
import { renderLetterPdf } from "@/lib/pdf";

export const maxDuration = 60;

const bodySchema = z.object({
  caseId: z.string().uuid(),
  /** Fax number from the member's own denial notice. */
  toNumber: z.string().regex(/^\+?1?\d{10}$/, "Enter a 10-digit US fax number."),
});

export async function POST(request: NextRequest) {
  const anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  if (!anonToken) {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const caseRow = await getCaseForToken(parsed.data.caseId, anonToken);
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  if (caseRow.tier !== "paid") {
    return NextResponse.json(
      { error: "Fax delivery is part of the Complete Appeal Package." },
      { status: 403 },
    );
  }

  const letter = await getLatestLetter(caseRow.id);
  if (!letter) {
    return NextResponse.json({ error: "No letter to send yet." }, { status: 404 });
  }

  const pdfBytes = await renderLetterPdf(letter.contentMd);
  const result = await sendFax({
    toNumber: parsed.data.toNumber,
    pdfBytes,
    filename: `medicare-appeal-${caseRow.id.slice(0, 8)}.pdf`,
  });

  await db().insert(schema.faxJobs).values({
    caseId: caseRow.id,
    phaxioId: result.phaxioId,
    toNumber: parsed.data.toNumber,
    status: result.status,
    sentAt: new Date(),
  });
  await logEvent(caseRow.id, "fax_sent", { phaxioId: result.phaxioId });

  return NextResponse.json({ ok: true, status: result.status });
}
