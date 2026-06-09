import { and, eq, gte, sql } from "drizzle-orm";
import { db, schema } from "./db";
import { appealDeadline } from "./deadlines";
import type { ConfirmedDetails, Extraction } from "./extraction-schema";
import { matchPayer } from "./payers/payers";

const FREE_RETENTION_DAYS = 30;
const PAID_RETENTION_DAYS = 548; // ~18 months
const FREE_CASES_PER_DAY = 3;

function retentionDate(tier: "free" | "paid"): Date {
  const days = tier === "paid" ? PAID_RETENTION_DAYS : FREE_RETENTION_DAYS;
  return new Date(Date.now() + days * 86_400_000);
}

export async function assertWithinFreeLimit(anonToken: string): Promise<void> {
  const since = new Date(Date.now() - 86_400_000);
  const [row] = await db()
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.cases)
    .where(and(eq(schema.cases.anonToken, anonToken), gte(schema.cases.createdAt, since)));
  if ((row?.count ?? 0) >= FREE_CASES_PER_DAY) {
    throw new RateLimitError(
      "Free limit reached: 3 appeals per day. Come back tomorrow or upgrade.",
    );
  }
}

export class RateLimitError extends Error {}

export async function createCaseWithDocument(params: {
  anonToken: string;
  fileBytes: Buffer;
  mime: string;
}) {
  const [caseRow] = await db()
    .insert(schema.cases)
    .values({
      anonToken: params.anonToken,
      status: "draft",
      tier: "free",
      retentionExpiresAt: retentionDate("free"),
    })
    .returning();

  await db().insert(schema.documents).values({
    caseId: caseRow.id,
    kind: "denial_letter",
    content: params.fileBytes,
    mime: params.mime,
  });

  return caseRow;
}

export async function saveExtraction(caseId: string, extraction: Extraction) {
  const payer = matchPayer(extraction.payer_name.value);
  const [row] = await db()
    .update(schema.cases)
    .set({
      status: "extracted",
      extraction,
      payerSlug: payer?.slug ?? null,
      denialDate: extraction.denial_date.value,
      noticeDate: extraction.notice_date.value,
      serviceDescription: extraction.service_denied.value,
      denialReasonSummary: extraction.denial_reason_verbatim.value,
    })
    .where(eq(schema.cases.id, caseId))
    .returning();
  return row;
}

export async function saveConfirmedDetails(caseId: string, details: ConfirmedDetails) {
  const deadline = appealDeadline(
    details.noticeDate ? new Date(details.noticeDate) : null,
    details.denialDate ? new Date(details.denialDate) : null,
  );

  const payer = matchPayer(details.payerName);
  const [row] = await db()
    .update(schema.cases)
    .set({
      status: "reviewed",
      confirmedDetails: details,
      payerSlug: payer?.slug ?? null,
      denialDate: details.denialDate,
      noticeDate: details.noticeDate,
      serviceDescription: details.serviceDenied,
      denialReasonSummary: details.denialReasonVerbatim,
      appealDeadline: deadline ? deadline.deadline.toISOString().slice(0, 10) : null,
      deadlineEstimated: deadline?.estimated ?? false,
    })
    .where(eq(schema.cases.id, caseId))
    .returning();
  return { caseRow: row, deadline };
}

export async function saveLetter(params: {
  caseId: string;
  contentMd: string;
  model: string;
  promptVersion: string;
  expedited: boolean;
}) {
  const [latest] = await db()
    .select({ version: schema.letters.version })
    .from(schema.letters)
    .where(eq(schema.letters.caseId, params.caseId))
    .orderBy(sql`${schema.letters.version} desc`)
    .limit(1);

  const [letter] = await db()
    .insert(schema.letters)
    .values({
      caseId: params.caseId,
      version: (latest?.version ?? 0) + 1,
      contentMd: params.contentMd,
      model: params.model,
      promptVersion: params.promptVersion,
    })
    .returning();

  await db()
    .update(schema.cases)
    .set({ status: "generated", expedited: params.expedited })
    .where(eq(schema.cases.id, params.caseId));

  return letter;
}

export async function getCaseForToken(caseId: string, anonToken: string) {
  const [row] = await db()
    .select()
    .from(schema.cases)
    .where(and(eq(schema.cases.id, caseId), eq(schema.cases.anonToken, anonToken)));
  return row ?? null;
}

export async function getLatestLetter(caseId: string) {
  const [letter] = await db()
    .select()
    .from(schema.letters)
    .where(eq(schema.letters.caseId, caseId))
    .orderBy(sql`${schema.letters.version} desc`)
    .limit(1);
  return letter ?? null;
}

export async function captureEmail(caseId: string, anonToken: string, email: string) {
  const [row] = await db()
    .update(schema.cases)
    .set({ email })
    .where(and(eq(schema.cases.id, caseId), eq(schema.cases.anonToken, anonToken)))
    .returning();
  return row ?? null;
}

export async function markPaid(caseId: string, tier: "paid") {
  await db()
    .update(schema.cases)
    .set({ tier, status: "paid", retentionExpiresAt: retentionDate("paid") })
    .where(eq(schema.cases.id, caseId));
}

/** Delete cases (and cascading documents/letters) past their retention date. */
export async function purgeExpiredCases(): Promise<number> {
  const deleted = await db()
    .delete(schema.cases)
    .where(sql`${schema.cases.retentionExpiresAt} < now()`)
    .returning({ id: schema.cases.id });
  return deleted.length;
}

export async function logEvent(caseId: string | null, type: string, payload?: unknown) {
  await db().insert(schema.events).values({ caseId, type, payload: payload ?? null });
}
