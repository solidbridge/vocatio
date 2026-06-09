# Privacy Architecture

Consumer self-upload of one's own records does not by itself make this app a
HIPAA covered entity, but we build to health-data standards from day one and
keep a clean upgrade path to a BAA-compliant provider tier.

## Current controls (consumer tiers)

- **Data minimization**: member IDs stored as last-4 only (enforced in the
  extraction prompt and schema). No SSNs requested anywhere.
- **Retention**: free cases hard-deleted 30 days after creation; paid cases
  after ~18 months. Enforced by `cases.retention_expires_at` and the
  `/api/cron/retention` sweep (deletes cascade to documents and letters).
- **Access**: anonymous cases are reachable only with the HMAC-signed cookie
  token that created them. Case pages are `noindex` via robots disallow.
- **Transport/storage**: HTTPS everywhere (platform-enforced); documents
  stored in Postgres alongside case data — encrypted at rest by the database
  provider.
- **No PHI in telemetry**: log errors without document contents; analytics is
  page-level only.
- **Email**: capture is consent-by-action (user requests their letter); used
  for the letter link and deadline reminders for that case only.

## Before the provider tier launches (BAA checklist)

1. Anthropic: zero-data-retention agreement / BAA for the API organization.
2. Database/storage: move documents from Postgres bytea to a private object
   store under a BAA (e.g. Supabase Team plan storage), path-referenced.
3. Audit: expand the `events` table into a complete access log (who viewed
   which case when); add org-scoped roles.
4. Retention controls configurable per organization.
5. Subprocessor inventory + DPAs: Stripe, Resend, Phaxio, hosting.

## Disclaimers

Every page footer: self-advocacy tool, not legal advice, not a law firm, not
affiliated with Medicare/CMS or any insurer. The letter output instructs users
to verify bracketed placeholders with their clinician before sending.
