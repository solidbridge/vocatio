import { NextRequest, NextResponse } from "next/server";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { getCaseForToken, getLatestLetter } from "@/lib/cases";
import { renderLetterPdf } from "@/lib/pdf";

export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await params;
  const anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  if (!anonToken) {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }

  const caseRow = await getCaseForToken(caseId, anonToken);
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }
  if (!caseRow.email) {
    return NextResponse.json(
      { error: "Enter your email on the case page to download." },
      { status: 403 },
    );
  }

  const letter = await getLatestLetter(caseId);
  if (!letter) {
    return NextResponse.json({ error: "No letter generated yet." }, { status: 404 });
  }

  const pdfBytes = await renderLetterPdf(letter.contentMd);
  return new NextResponse(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="medicare-appeal-${caseId.slice(0, 8)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
