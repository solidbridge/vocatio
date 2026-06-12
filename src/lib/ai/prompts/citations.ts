/**
 * Curated, hand-verified citation bank. The generation prompt may ONLY cite
 * authorities listed here — this is the guardrail against hallucinated
 * regulations. Each entry carries `appliesWhen` tags; selection happens in
 * code (selectCitations) before the model ever sees them.
 */

export type CitationTag =
  | "always"
  | "pre_service"
  | "post_service"
  | "expedited"
  | "mental_health"
  | "medical_necessity"
  | "criteria_transparency";

export interface Citation {
  ref: string;
  summary: string;
  appliesWhen: CitationTag[];
}

export const citationBank: Citation[] = [
  {
    ref: "42 C.F.R. § 422.580–582",
    summary:
      "Establishes the enrollee's right to request reconsideration of an adverse organization determination, filed within 65 calendar days of the notice.",
    appliesWhen: ["always"],
  },
  {
    ref: "42 C.F.R. § 422.566",
    summary:
      "Defines organization determinations and requires the MA plan to make determinations based on the enrollee's medical needs and applicable coverage rules.",
    appliesWhen: ["always"],
  },
  {
    ref: "42 C.F.R. § 422.101(b)",
    summary:
      "An MA plan must provide coverage of all services that Traditional Medicare covers and may not impose coverage criteria more restrictive than Traditional Medicare's national and local coverage determinations.",
    appliesWhen: ["always", "medical_necessity"],
  },
  {
    ref: "42 C.F.R. § 422.101(c)(1) (2024 MA Final Rule, CMS-4201-F)",
    summary:
      "When no applicable Medicare coverage criteria exist, internal plan criteria must be based on current evidence and made publicly accessible; coverage may not be denied based on non-public internal rules.",
    appliesWhen: ["medical_necessity", "criteria_transparency"],
  },
  {
    ref: "42 C.F.R. § 422.568 & § 422.572",
    summary:
      "Timeframes for standard and expedited organization determinations; a plan must expedite when the standard timeframe could seriously jeopardize the enrollee's life, health, or ability to regain maximum function.",
    appliesWhen: ["expedited"],
  },
  {
    ref: "42 C.F.R. § 422.584",
    summary:
      "Right to an expedited (72-hour) reconsideration for pre-service denials when delay could seriously jeopardize life, health, or maximum function; a physician's support compels expedited handling.",
    appliesWhen: ["expedited", "pre_service"],
  },
  {
    ref: "42 C.F.R. § 422.590",
    summary:
      "If the plan affirms its denial in whole or in part, it must automatically forward the case to the CMS Independent Review Entity (IRE) — the enrollee does not need to request this.",
    appliesWhen: ["always"],
  },
  {
    ref: "CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F)",
    summary:
      "Requires MA plans to include the specific reason for a prior-authorization denial, including the clinical criteria relied upon, in the denial notice — enabling a point-by-point rebuttal.",
    appliesWhen: ["criteria_transparency", "pre_service"],
  },
  {
    ref: "42 C.F.R. § 422.629 et seq. (Parity principles; MHPAEA, 29 U.S.C. § 1185a analog)",
    summary:
      "Mental-health and substance-use services must not be subject to more restrictive utilization-management practices than comparable medical/surgical services.",
    appliesWhen: ["mental_health"],
  },
  {
    ref: "Medicare Managed Care Manual, Ch. 13",
    summary:
      "CMS guidance on enrollee grievances, organization determinations and appeals, including the requirement to consider all evidence submitted at reconsideration de novo.",
    appliesWhen: ["always"],
  },
];

export interface CitationContext {
  isPreService: boolean;
  expedited: boolean;
  isMentalHealth: boolean;
  hasCitedCriteria: boolean;
}

export function selectCitations(ctx: CitationContext): Citation[] {
  const active = new Set<CitationTag>(["always", "medical_necessity"]);
  if (ctx.isPreService) active.add("pre_service");
  else active.add("post_service");
  if (ctx.expedited) active.add("expedited");
  if (ctx.isMentalHealth) active.add("mental_health");
  if (ctx.hasCitedCriteria) active.add("criteria_transparency");

  return citationBank.filter((c) => c.appliesWhen.some((tag) => active.has(tag)));
}
