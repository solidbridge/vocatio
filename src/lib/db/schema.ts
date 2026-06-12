import {
  boolean,
  customType,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const userRole = pgEnum("user_role", ["consumer", "provider"]);
export const caseStatus = pgEnum("case_status", [
  "draft",
  "extracted",
  "reviewed",
  "generated",
  "paid",
  "filed",
  "won",
  "lost",
]);
export const caseTier = pgEnum("case_tier", ["free", "paid"]);
export const documentKind = pgEnum("document_kind", [
  "denial_letter",
  "supporting",
  "generated_letter",
]);
export const paymentType = pgEnum("payment_type", ["one_off", "subscription"]);

export const orgs = pgTable("orgs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  planStatus: text("plan_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: userRole("role").notNull().default("consumer"),
  orgId: uuid("org_id").references(() => orgs.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cases = pgTable("cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  /** Signed cookie token for the anonymous (no-login) free flow. */
  anonToken: text("anon_token"),
  email: text("email"),
  status: caseStatus("status").notNull().default("draft"),
  tier: caseTier("tier").notNull().default("free"),
  payerSlug: text("payer_slug"),
  denialDate: date("denial_date"),
  noticeDate: date("notice_date"),
  appealDeadline: date("appeal_deadline"),
  deadlineEstimated: boolean("deadline_estimated").notNull().default(false),
  expedited: boolean("expedited").notNull().default(false),
  serviceDescription: text("service_description"),
  denialReasonSummary: text("denial_reason_summary"),
  /** Raw model extraction (pre-review), kept for eval/debugging. */
  extraction: jsonb("extraction"),
  /** User-confirmed details (ConfirmedDetails) — the generation input. */
  confirmedDetails: jsonb("confirmed_details"),
  retentionExpiresAt: timestamp("retention_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  kind: documentKind("kind").notNull(),
  /**
   * MVP simplification: file bytes live in Postgres (denial letters are a
   * few MB at most) so no storage bucket is required. Swap to object
   * storage + a path column before the provider tier / BAA work.
   */
  content: bytea("content").notNull(),
  mime: text("mime").notNull(),
  pageCount: integer("page_count"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const letters = pgTable("letters", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  contentMd: text("content_md").notNull(),
  model: text("model").notNull(),
  promptVersion: text("prompt_version").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").references(() => cases.id),
  orgId: uuid("org_id").references(() => orgs.id),
  stripeId: text("stripe_id").notNull().unique(),
  amountCents: integer("amount_cents").notNull(),
  type: paymentType("type").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faxJobs = pgTable("fax_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").notNull().references(() => cases.id),
  phaxioId: text("phaxio_id"),
  toNumber: text("to_number").notNull(),
  status: text("status").notNull().default("queued"),
  pages: integer("pages"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Append-only audit log — groundwork for the BAA/provider tier. */
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  caseId: uuid("case_id").references(() => cases.id),
  type: text("type").notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
