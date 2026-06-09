import type { ConfirmedDetails } from "../extraction-schema";
import { isExpeditedEligible } from "../deadlines";
import { matchPayer } from "../payers/payers";
import { anthropic, GENERATION_MODEL } from "./client";
import { selectCitations } from "./prompts/citations";
import {
  buildGenerationUserPrompt,
  generationSystemPrompt,
  GENERATION_PROMPT_VERSION,
} from "./prompts/generation";

export { GENERATION_PROMPT_VERSION };

export interface GenerateLetterOptions {
  details: ConfirmedDetails;
  /** ISO date string of the computed filing deadline, if known. */
  deadline: string | null;
  tier: "free" | "paid";
}

function buildPrompt({ details, deadline, tier }: GenerateLetterOptions) {
  const expedited = isExpeditedEligible({
    isPreService: details.isPreService,
    userAttestsSeriousHarm: details.userAttestsSeriousHarm,
  });

  const citations = selectCitations({
    isPreService: details.isPreService,
    expedited,
    isMentalHealth: details.isMentalHealth,
    hasCitedCriteria: details.clinicalCriteriaCited.length > 0,
  });

  const payer = matchPayer(details.payerName);
  const payerGuidance =
    tier === "paid" && payer
      ? `File with ${payer.name} using the appeal address or fax number printed on the denial notice (it is plan-specific). Member appeals info: ${payer.appealsUrl ?? "see your plan documents"}.`
      : null;

  return {
    expedited,
    userPrompt: buildGenerationUserPrompt({
      details,
      citations,
      expedited,
      deadline,
      tier,
      payerGuidance,
    }),
  };
}

/** Stream the appeal letter as Markdown text chunks. */
export function streamAppealLetter(options: GenerateLetterOptions) {
  const { userPrompt, expedited } = buildPrompt(options);

  const stream = anthropic().messages.stream({
    model: GENERATION_MODEL,
    max_tokens: options.tier === "paid" ? 6000 : 2500,
    system: generationSystemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return { stream, expedited };
}

/** Non-streaming variant used by server-side regeneration (e.g. post-payment). */
export async function generateAppealLetter(
  options: GenerateLetterOptions,
): Promise<{ contentMd: string; expedited: boolean; model: string }> {
  const { userPrompt, expedited } = buildPrompt(options);

  const response = await anthropic().messages.create({
    model: GENERATION_MODEL,
    max_tokens: options.tier === "paid" ? 6000 : 2500,
    system: generationSystemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const contentMd = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  if (!contentMd.trim()) {
    throw new Error("Letter generation returned no content.");
  }

  return { contentMd, expedited, model: GENERATION_MODEL };
}
