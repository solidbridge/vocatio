/**
 * Denial-type topics powering the programmatic SEO pages at /denials/[slug].
 * Each blurb is hand-written page copy; the rest of each page is shared
 * process content.
 */

export interface Topic {
  slug: string;
  title: string;
  /** What the H1 calls the denial. */
  heading: string;
  blurb: string;
  /** Arguments that tend to win this denial type. */
  appealAngles: string[];
}

export const topics: Topic[] = [
  {
    slug: "prior-authorization",
    title: "Prior authorization",
    heading: "Prior Authorization Denial",
    blurb:
      "Prior-authorization denials are the single most common Medicare Advantage denial — and the most overturned on appeal. Since 2026, your plan must state the specific clinical criteria it used, which gives your appeal a concrete target.",
    appealAngles: [
      "The plan's criteria cannot be more restrictive than Traditional Medicare coverage rules.",
      "Rebut each stated criterion with your doctor's clinical notes.",
      "Ask your doctor to support an expedited (72-hour) review if waiting could harm you.",
    ],
  },
  {
    slug: "skilled-nursing",
    title: "Skilled nursing facility",
    heading: "Skilled Nursing Facility (SNF) Denial",
    blurb:
      "Cutting short skilled-nursing stays is one of the most criticized Medicare Advantage practices, often driven by algorithmic length-of-stay predictions rather than your actual recovery. These denials are frequently reversed when a treating clinician documents continued skilled need.",
    appealAngles: [
      "Traditional Medicare covers up to 100 days of SNF care when skilled need continues — your plan cannot be stricter.",
      "An algorithm's predicted discharge date is not a clinical assessment of you.",
      "Get the facility therapist's notes documenting why skilled care is still required.",
    ],
  },
  {
    slug: "home-health",
    title: "Home health",
    heading: "Home Health Care Denial",
    blurb:
      "Home-health denials often claim the patient is \"not homebound\" or \"stable.\" Medicare's homebound definition is broader than plans often apply, and improvement is not required — maintenance care is covered.",
    appealAngles: [
      "Under Medicare rules, leaving home infrequently with considerable effort still counts as homebound.",
      "Skilled care to maintain condition or prevent decline is covered (Jimmo standard).",
      "Have the home-health agency document the skilled tasks performed each visit.",
    ],
  },
  {
    slug: "mental-health",
    title: "Mental health & therapy",
    heading: "Mental Health / Therapy Session Denial",
    blurb:
      "Denials for psychotherapy, psychiatric care, and intensive outpatient programs frequently rest on utilization rules stricter than those applied to medical care — which parity principles do not allow. Seniors' mental-health care is chronically under-approved and under-appealed.",
    appealAngles: [
      "Mental-health services may not face more restrictive review than comparable medical services.",
      "Session-count limits must have a clinical basis, not a blanket cap.",
      "Your clinician's treatment plan and progress notes are strong rebuttal evidence.",
    ],
  },
  {
    slug: "dme",
    title: "Medical equipment (DME)",
    heading: "Durable Medical Equipment (DME) Denial",
    blurb:
      "Wheelchairs, oxygen, CPAP machines, and diabetic supplies are routinely denied as \"not medically necessary\" based on checklist criteria. A precise physician attestation matched to Medicare's coverage criteria reverses many of these denials.",
    appealAngles: [
      "Match your doctor's letter to each element of the applicable Medicare coverage determination.",
      "Document failed cheaper alternatives where step requirements are cited.",
      "In-home assessments often satisfy mobility-related criteria plans claim are unmet.",
    ],
  },
  {
    slug: "not-medically-necessary",
    title: "\"Not medically necessary\"",
    heading: "\"Not Medically Necessary\" Denial",
    blurb:
      "\"Not medically necessary\" is the catch-all reason on Medicare Advantage denial notices. It usually means your case didn't match an internal checklist — not that your doctor is wrong. Plans must now disclose that checklist, and your appeal can answer it line by line.",
    appealAngles: [
      "Request and rebut the specific internal criteria the plan applied.",
      "A treating physician's individualized assessment outweighs a generic guideline.",
      "Plans must follow Traditional Medicare's coverage standards as the floor.",
    ],
  },
];

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug);
}
