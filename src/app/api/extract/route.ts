import { NextRequest, NextResponse } from "next/server";
import { anonCookie, createAnonToken, verifyAnonToken } from "@/lib/anon";
import { extractDenial } from "@/lib/ai/extract";
import {
  assertWithinFreeLimit,
  createCaseWithDocument,
  logEvent,
  RateLimitError,
  saveExtraction,
} from "@/lib/cases";

export const maxDuration = 120;

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export async function POST(request: NextRequest) {
  let anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  const isNewToken = !anonToken;
  if (!anonToken) anonToken = createAnonToken();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large (15 MB max). Try a photo of each page instead." },
        { status: 413 },
      );
    }

    await assertWithinFreeLimit(anonToken);

    const fileBytes = Buffer.from(await file.arrayBuffer());
    const caseRow = await createCaseWithDocument({
      anonToken,
      fileBytes,
      mime: file.type,
    });

    const extraction = await extractDenial(fileBytes, file.type);
    await saveExtraction(caseRow.id, extraction);
    await logEvent(caseRow.id, "extracted");

    const response = NextResponse.json({ caseId: caseRow.id, extraction });
    if (isNewToken) {
      response.cookies.set(anonCookie.name, anonToken, anonCookie.options);
    }
    return response;
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error("extract failed", error);
    return NextResponse.json(
      { error: "We couldn't read that document. Try a clearer photo or a PDF." },
      { status: 500 },
    );
  }
}
