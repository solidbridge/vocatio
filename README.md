# MA Appeal Helper

Turn a Medicare Advantage denial letter into a ready-to-send appeal in minutes.

Most Medicare Advantage appeals win (57–82% of appealed prior-auth denials are
overturned), but fewer than 12% of denials are ever appealed. This app closes
that gap: upload a photo or PDF of a denial notice, confirm what the AI
extracted, and get a reconsideration letter that cites the plan's own clinical
criteria and the federal regulations that protect enrollees.

## Product tiers

| Tier | Price | What you get |
|---|---|---|
| Free letter | $0 | Extraction → review → basic appeal letter, computed 65-day deadline (email-gated) |
| Complete Appeal Package | $39 one-time | Point-by-point rebuttal letter with regulation citations, payer filing instructions, PDF, fax delivery, deadline reminders |
| For practices | $99/mo (waitlist) | Unlimited appeals, multi-patient dashboard |

## Stack

Next.js 15 (App Router, TS, Tailwind 4) · Postgres via Drizzle ORM (Supabase-ready) ·
Anthropic Claude (PDF/vision extraction + letter generation) · Stripe Checkout ·
Phaxio fax · Resend email · Installable PWA (manifest + service worker).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys (DATABASE_URL, APP_SECRET, ANTHROPIC_API_KEY minimum)
npm run db:migrate           # apply drizzle/ migrations to your Postgres
npm run dev
```

Visit `/new` for the appeal flow. Stripe webhooks in dev:
`stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

## Key paths

- `src/lib/deadlines.ts` — deterministic 65-day/expedited rules (unit-tested, no LLM)
- `src/lib/ai/` — extraction + generation pipeline; `prompts/citations.ts` is the
  curated citation bank (the model may cite ONLY from it)
- `src/lib/payers/payers.ts` — payer registry powering filing guidance and the
  programmatic SEO pages at `/appeals/[payer]`
- `src/lib/topics.ts` — denial-type SEO pages at `/denials/[topic]`
- `src/app/api/cron/retention` — retention sweep (wire to Vercel Cron, daily)

## Testing

```bash
npm test         # vitest unit tests (deadline math, etc.)
npm run build    # production build
```

## Privacy

See `docs/PRIVACY-ARCHITECTURE.md`. Headlines: free cases auto-delete after 30
days; member IDs are stored last-4 only; uploaded documents live in Postgres
(swap to object storage before the provider/BAA tier); no PHI in logs or
analytics. This is a self-advocacy tool, not legal advice.
