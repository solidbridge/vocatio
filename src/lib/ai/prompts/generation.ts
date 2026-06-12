import type { ConfirmedDetails } from "../../extraction-schema";
import type { Citation } from "./citations";

export const GENERATION_PROMPT_VERSION = "generate-v1";

export const generationSystemPrompt = `You are an experienced Medicare appeals advocate writing a Level 1 reconsideration (appeal) letter on behalf of a Medicare Advantage enrollee, to be signed and sent by the enrollee or their representative.

MANDATED LETTER STRUCTURE (in this order):
1. Header block: date, enrollee name, plan name, member ID (last 4 only, as "ending in XXXX"), denial reference if known.
2. Subject line: "Request for {Standard|Expedited} Reconsideration of Adverse Organization Determination".
3. Opening paragraph: formal request for reconsideration under the cited federal regulations, identifying the denied service and the denial date.
4. The plan's own stated basis: restate the denial reason and each clinical criterion the plan cited, quoted back accurately.
5. Point-by-point rebuttal: address each cited criterion. Where the user provided clinical context, weave it in. Where information is needed from the treating physician, insert a [BRACKETED PLACEHOLDER] describing exactly what to attach or fill in.
6. Medical-necessity argument grounded in the allowed citations.
7. Requested remedy: full approval/payment of the denied service, and (if expedited) a decision within 72 hours.
8. Reminder of the plan's obligations: decision timeframe, and automatic forwarding to the Independent Review Entity if the denial is upheld.
9. Enclosures list and signature block.

HARD RULES:
- Cite ONLY the authorities provided in the ALLOWED CITATIONS list. Never cite any other statute, regulation, case, or guideline. If you want to make an argument with no allowed citation, make it as a factual/clinical argument without citation.
- NEVER invent facts: no diagnoses, dates, provider names, test results, or clinical history that were not provided. Anything the enrollee must supply goes in [BRACKETED PLACEHOLDERS].
- Plain, assertive, respectful language a senior or caregiver would be comfortable signing. No legalese beyond the citations. Short paragraphs.
- Write the letter in Markdown. No preamble or commentary — output the letter only.
- This is a self-advocacy document, not legal advice, and must not claim to be from an attorney.`;

export interface GenerationInput {
  details: ConfirmedDetails;
  citations: Citation[];
  expedited: boolean;
  deadline: string | null;
  tier: "free" | "paid";
  payerGuidance: string | null;
}

export function buildGenerationUserPrompt(input: GenerationInput): string {
  const { details, citations, expedited, deadline, tier, payerGuidance } = input;

  const citationList = citations
    .map((c) => `- ${c.ref}: ${c.summary}`)
    .join("\n");

  const criteria =
    details.clinicalCriteriaCited.length > 0
      ? details.clinicalCriteriaCited.map((c) => `- "${c}"`).join("\n")
      : "(none stated on the notice)";

  const depth =
    tier === "paid"
      ? `Write the COMPLETE appeal package letter: thorough point-by-point rebuttal of every cited criterion, full medical-necessity argument, an enclosures checklist (denial notice copy, physician letter of medical necessity placeholder, relevant records placeholders), and filing notes.${payerGuidance ? ` Payer filing guidance to incorporate near the end: ${payerGuidance}` : ""}`
      : "Write a concise one-page basic appeal letter covering the structure above in compact form. Skip the enclosures checklist details (one line is enough).";

  return `CASE DETAILS (user-confirmed — the only source of facts):
- Enrollee/patient: ${details.patientName ?? "[ENROLLEE NAME]"}
- Payer: ${details.payerName}
- Plan: ${details.planName ?? "[PLAN NAME]"}
- Member ID ending in: ${details.memberIdLast4 ?? "[LAST 4 OF MEMBER ID]"}
- Service denied: ${details.serviceDenied}
- Denial type: ${details.isPreService ? "pre-service (prior authorization)" : "post-service (payment denial)"}
- Mental/behavioral health service: ${details.isMentalHealth ? "yes" : "no"}
- Denial date: ${details.denialDate ?? "[DENIAL DATE]"}
- Notice date: ${details.noticeDate ?? "unknown"}
- Filing deadline (computed): ${deadline ?? "unknown — letter should note prompt filing"}
- Request type: ${expedited ? "EXPEDITED (72-hour) reconsideration — the enrollee attests that waiting for a standard decision could seriously jeopardize health" : "Standard reconsideration"}
- Denial reason as printed: ${details.denialReasonVerbatim ?? "(not captured — argue from the criteria and facts available)"}
- Clinical criteria the plan cited:
${criteria}
- Additional context from the enrollee/caregiver: ${details.patientContext ?? "(none provided)"}

ALLOWED CITATIONS (cite only these):
${citationList}

TASK: ${depth}`;
}
