import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { GENERATION_PROMPT_VERSION, streamAppealLetter } from "@/lib/ai/generate";
import { GENERATION_MODEL } from "@/lib/ai/client";
import {
  getCaseForToken,
  logEvent,
  saveConfirmedDetails,
  saveLetter,
} from "@/lib/cases";
import { confirmedDetailsSchema } from "@/lib/extraction-schema";

export const maxDuration = 120;

const bodySchema = z.object({
  caseId: z.string().uuid(),
  details: confirmedDetailsSchema,
});

export async function POST(request: NextRequest) {
  const anonToken = verifyAnonToken(request.cookies.get(anonCookie.name)?.value);
  if (!anonToken) {
    return NextResponse.json({ error: "Session expired. Start over." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { caseId, details } = parsed.data;

  const caseRow = await getCaseForToken(caseId, anonToken);
  if (!caseRow) {
    return NextResponse.json({ error: "Case not found." }, { status: 404 });
  }

  const { deadline } = await saveConfirmedDetails(caseId, details);
  const { stream, expedited } = streamAppealLetter({
    details,
    deadline: deadline ? deadline.deadline.toISOString().slice(0, 10) : null,
    tier: caseRow.tier === "paid" ? "paid" : "free",
  });

  const encoder = new TextEncoder();
  let fullText = "";

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            fullText += chunk.delta.text;
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        if (fullText.trim()) {
          await saveLetter({
            caseId,
            contentMd: fullText,
            model: GENERATION_MODEL,
            promptVersion: GENERATION_PROMPT_VERSION,
            expedited,
          });
          await logEvent(caseId, "letter_generated", {
            tier: caseRow.tier,
            expedited,
          });
        }
        controller.close();
      } catch (error) {
        console.error("generate stream failed", error);
        controller.error(error);
      }
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Expedited": expedited ? "1" : "0",
      "X-Deadline": deadline ? deadline.deadline.toISOString().slice(0, 10) : "",
      "X-Deadline-Estimated": deadline?.estimated ? "1" : "0",
    },
  });
}
