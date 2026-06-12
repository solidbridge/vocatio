import { z } from "zod";

/**
 * Structured data pulled from an uploaded denial notice. Produced by the
 * extraction model, then confirmed/corrected by the user on the review
 * screen — only user-confirmed values feed letter generation.
 */

export const confidenceSchema = z.enum(["high", "medium", "low"]);

const field = <T extends z.ZodTypeAny>(value: T) =>
  z.object({ value: value.nullable(), confidence: confidenceSchema });

export const extractionSchema = z.object({
  payer_name: field(z.string()),
  plan_name: field(z.string()),
  /** Last 4 characters only — full IDs are never stored. */
  member_id_last4: field(z.string()),
  patient_name: field(z.string()),
  denial_date: field(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  notice_date: field(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  service_denied: field(z.string()),
  denial_reason_verbatim: field(z.string()),
  /**
   * Specific clinical criteria the plan cited (required on MA denial notices
   * by CMS-0057-F since Jan 2026) — quoted verbatim. The strongest raw
   * material for the rebuttal.
   */
  clinical_criteria_cited: field(z.array(z.string())),
  /** True when the denied service has not yet been provided. */
  is_pre_service: field(z.boolean()),
  /** Appeal filing instructions printed in the letter itself, if any. */
  appeal_instructions_in_letter: field(z.string()),
  /** Whether the denial appears to involve mental/behavioral health care. */
  is_mental_health: field(z.boolean()),
});

export type Extraction = z.infer<typeof extractionSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;

/**
 * Flat, user-confirmed version of the extraction used for generation and
 * persisted on the case after the review step.
 */
export const confirmedDetailsSchema = z.object({
  payerName: z.string().min(1),
  planName: z.string().nullable(),
  memberIdLast4: z.string().nullable(),
  patientName: z.string().nullable(),
  denialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  noticeDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  serviceDenied: z.string().min(1),
  denialReasonVerbatim: z.string().nullable(),
  clinicalCriteriaCited: z.array(z.string()),
  isPreService: z.boolean(),
  isMentalHealth: z.boolean(),
  /** Asked directly in the UI, never inferred by the model. */
  userAttestsSeriousHarm: z.boolean(),
  /** Free-text context from the user: why the service is medically necessary. */
  patientContext: z.string().max(4000).nullable(),
});

export type ConfirmedDetails = z.infer<typeof confirmedDetailsSchema>;
