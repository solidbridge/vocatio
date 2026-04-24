# Ultraplan — Vocatio AI Itinerary Builder

**Reference model:** raindango.com/x (Cabo San Lucas trip guide, 14-tab single-file HTML)
**Target deployment:** vocatiotravel.com (Webflow, Catholic pilgrimage & custom group travel)
**Author:** MJ Lowry / Raindango Consulting
**Date:** April 2026
**Status:** Draft v1

---

## 0. TL;DR

Build an AI-powered itinerary generator that takes a short form (trip purpose, party composition, length, multi-city list) and produces a raindango-quality, personalized trip guide on the spot. Instead of Vocatio's current "Contact us and we'll call you" funnel, a user gets an instant, polished preview of their trip — then books a consultation to finalize. The generator doubles as (1) a lead magnet, (2) a qualifying tool (it captures intent and trip scope before sales ever sees the lead), and (3) a deliverable Vocatio's travel planners can hand to clients after booking.

**Why this works for Vocatio specifically:** Their Plan-Your-Journey page already promises "as much structure as you want" and lists eight destination frameworks (Italy, Spain, Portugal, France, Ireland, Israel-Egypt-Jordan, Mexico, USA). An AI generator is the execution of a promise they've already made. It's additive, not brand-diluting.

---

## 1. Reference Analysis — What Makes raindango.com/x Work

The Cabo guide is the target quality bar. Distilling what produces the "this isn't a Word doc, this is a product" feel:

| Element | Why it matters | Generator equivalent |
|---|---|---|
| Single-file HTML | Shareable, hostable anywhere, no login | Same — each generated trip = one self-contained `.html` |
| 14 tabbed sections | Depth without overwhelm | Parameterize tab set by trip type (pilgrimage adds "Mass Schedule & Shrines", business adds "Meeting Logistics") |
| Live weather via Open-Meteo | "This thing is alive" feeling | Same API, coordinates per city |
| Live countdown timer | Anticipation, emotional hook | Keep |
| Spanish phrases with TTS audio | Functional + delightful | Generalize to destination language(s) via Web Speech API |
| Day-by-day itinerary with time blocks | Actually useful, not generic | Core AI-generated content |
| Dining / nightlife / shopping | Local expertise signal | AI + Google Places API |
| Packing checklist with `<input type="checkbox">` | User gets to DO something | Parameterize by climate, trip type, party composition |
| Emergency info, tap-to-call | "Someone thought of everything" | Destination-aware consular/police numbers |
| Personal touches (the Stevie/Travis cannabis warning) | Personality defeats genericness | Conditional inserts based on party type, kids, purpose |

**The insight:** raindango.com/x is 60% structure, 30% destination data, 10% personality. The first 60% is templatable. The next 30% is data-pulled. The last 10% is where an LLM earns its keep.

---

## 2. Current State — vocatiotravel.com

**Platform:** Webflow. CDN-hosted assets. No dynamic backend currently visible.
**Brand positioning:** "Trips you were meant to take." Catholic pilgrimage + group travel. Premium, custom, anti-mass-market. Offices US + Europe.
**Destination frameworks already published:** Italy (Rome, Assisi, Milan, Turin, S. Giovanni Rotondo), Spain (Madrid, Avila, Barcelona, Montserrat, Granada, Seville), Portugal (Lisbon, Fatima, Porto), France (Lourdes, Paris, Lisieux), Ireland (Dublin, Cork, Knock), Israel-Egypt-Jordan, Mexico City, USA pilgrimage circuits.
**Audience segments:** Parish & Ministry Groups, School Groups, Business/Men's/Women's Groups.
**Existing CTA flow:** "Plan Your Journey" → marketing copy → "Start Planning Now" button → Contact form.

**Gap:** The funnel has no intermediate step between curiosity and contact. A prospect with an idea has to commit to a sales call before seeing anything tangible. High friction. High drop-off.

**Opportunity:** Insert the generator between curiosity and contact. Prospect spends 2 minutes filling a form, gets a 14-tab draft trip guide branded Vocatio, then the CTA is "Book a 30-min call to finalize with a Vocatio planner." Sales gets a pre-qualified lead with full trip scope.

---

## 3. Strategic Positioning

**Do not** position this as "AI trip planner" — that's commodified (WonderTrip, Mindtrip, Layla, etc. all exist). Vocatio's moat is the human expertise. Position this as:

> "Get a personalized Vocatio itinerary draft in 90 seconds — then let our planners perfect it with on-the-ground partners."

The AI is the first draft. The human is the finish. That framing:
- Preserves Vocatio's premium brand
- Doesn't threaten their planners' jobs (they're *augmented*, not replaced)
- Differentiates from every pure-AI competitor
- Matches their existing "custom, not conformed" promise

**Catholic/pilgrimage tone overlay:** When trip purpose = pilgrimage or party profile = parish/ministry, generator surfaces shrines, Mass schedules, spiritual readings per stop. When purpose = business/pleasure and no Catholic signals, it surfaces normal travel content. Same engine, different content layer — configurable per tenant. This lets the same codebase serve Vocatio *and* other verticals later (estate planning firm retreats, dental practice CE trips, etc.).

---

## 4. User Flow

### 4.1 Intake form (the front door)

Single-page form, progressive disclosure, mobile-first. Fields:

1. **Trip purpose** — radio: Pilgrimage · Business · Pleasure · Mixed · Education · Retreat · Other (free text)
2. **Party composition** — number steppers: Adults, Children (if Children > 0, conditional field: ages)
3. **Length of stay** — date picker with departure + return, OR "I'm flexible — [N] nights"
4. **Destinations** — multi-entry city picker with drag-reorder (e.g., Rome → Florence → Capri). Each city gets an auto-suggested nights split the user can override.
5. **Travel style** — pills: Luxury · Premium · Comfort · Value. Also: Pace (Packed · Balanced · Slow).
6. **Must-have experiences** — free text + suggested chips seeded by destination (e.g., Rome → "Vatican · Colosseum · Papal Audience · Trattoria dinner")
7. **Dietary / accessibility** — free text
8. **Contact** — name + email (required to generate), phone (optional, unlocks "call-me" CTA on output)

Total time to complete: target 90–120 seconds.

### 4.2 Generation (the middle)

On submit:
- Form payload written to Postgres (lead record) + pushed to HubSpot CRM via webhook
- LLM orchestration kicks off (§7)
- User sees a branded loading screen with real progress: "Researching Rome shrines… Building Day 3… Pulling live weather for Capri…"
- Typical generation: 20–40 seconds end-to-end

### 4.3 Output (the hook)

A unique URL: `vocatiotravel.com/trip/<slug>-<shortid>` — a fully rendered, raindango-style trip guide. 10–14 tabs depending on trip config. Key differences from raindango reference:
- Vocatio branding (logo, palette, typography)
- Per-city weather and local time
- A "Refine with a Vocatio planner" CTA pinned in the top-right on every tab
- A "Share with your group" action (copy link / email invite)
- A "Download as PDF" action (for the parish bulletin, the school principal, etc.)
- Tabs adapt to party: "Kids' Corner" tab only appears if children > 0

### 4.4 Handoff to sales

Output page has three conversion paths:
- **Book a call** — opens Calendly/native scheduler, pre-fills trip details
- **Email me this** — sends the guide to the submitted email + copies a Vocatio planner
- **Request changes** — free-text box; submissions regenerate the guide (rate-limited to 3 regens to prevent abuse)

---

## 5. Data Model

Postgres schema, minimum viable:

```
trips
  id (uuid, pk)
  slug (text, unique)           -- rome-florence-capri-jan2027-a7f3
  short_id (text, 6 chars)      -- a7f3e2
  tenant_id (fk)                -- multi-tenant from day one
  created_at, updated_at
  status                        -- draft | generating | ready | failed
  input_payload (jsonb)         -- the full form submission
  itinerary_payload (jsonb)     -- the LLM-generated structured itinerary
  html_rendered (text)          -- cached final HTML
  regen_count (int)
  contact_email, contact_phone, contact_name

trip_destinations
  id, trip_id, order_index
  city, country, lat, lng
  nights, arrival_date, departure_date
  notes

tenants
  id, name, slug, theme_config (jsonb), branding_config (jsonb)
  -- vocatio is tenant #1; mark's other clients become tenants #2+

leads
  id, trip_id, hubspot_contact_id, status, first_touch, last_touch
```

Multi-tenancy from day one costs almost nothing up front and is the difference between this being a Vocatio-only project and a productized service Raindango can resell.

---

## 6. Technical Architecture

**Stack recommendation (aligned to your existing kit):**

- **Frontend:** Next.js 15 (App Router) + Tailwind. Deployed to Netlify or Vercel. Why not pure HTML like raindango.com/x? Because now we need a form, auth, lead capture, and tenant theming — Next.js earns its weight. *The generated trip page itself is still server-rendered to static HTML and cached, preserving raindango's "just a fast webpage" feel.*
- **Backend:** Next.js API routes + Supabase (Postgres + Auth + Storage). Lightweight, cheap, fast to ship.
- **Orchestration:** n8n for the webhook → HubSpot → email flows. Keeps business logic out of app code and lets Vocatio ops tweak lead routing without a deploy.
- **LLM:** Claude Sonnet 4.7 via Anthropic API for itinerary generation. Opus 4.7 for a premium "deep plan" tier if pricing allows.
- **External APIs:**
  - Google Places (dining, attractions, hotels)
  - Open-Meteo (weather, free, no key) — already proven in raindango.com/x
  - Mapbox or Google Maps (embedded routes between stops)
  - Unsplash API (hero imagery per destination) — already used in raindango.com/x
- **Hosting:** Netlify for the frontend, Supabase for data, n8n self-hosted or n8n Cloud for automation. All services Mark already operates.

**Deployment to vocatiotravel.com:** Three options, in order of recommendation:

1. **Subdomain:** `plan.vocatiotravel.com` runs the Next.js app. Webflow site stays untouched. "Plan Your Journey" button updates to link to subdomain. *Recommended — cleanest, no Webflow surgery, independent deploy pipeline.*
2. **Reverse proxy at path:** `vocatiotravel.com/plan/*` proxies to the Next.js app via Netlify/Cloudflare rewrites. Looks like same domain to the user. Slightly more fragile.
3. **Webflow embed:** Embed the intake form on the existing Webflow page, then redirect to generated URL on submit. Output page is on subdomain. Lightest touch, gives Vocatio the least new thing to own.

Default to option 1. Fall back to option 3 if Vocatio wants near-zero integration work.

---

## 7. AI / LLM Layer — How the Itinerary Actually Gets Generated

This is where the product lives or dies. Naive one-shot prompts produce the generic slop that makes every AI itinerary feel interchangeable. Use a multi-stage pipeline:

### Stage 1 — Trip skeleton (structured output, cheap model)

Input: form payload.
Output: JSON skeleton — for each destination, nights, theme per day, logistical moves between cities.
Why separate: deterministic structure, validates before we spend tokens on prose.

### Stage 2 — Per-city deep research (parallel calls)

For each destination, one call generates:
- Top spiritual/pilgrimage sites (if purpose = pilgrimage)
- Local dining stratified by meal + budget
- Activities keyed to party composition (kids-friendly flagged)
- Neighborhood guidance for staying
- Cultural/practical tips (dress codes at sites, reservation lead times, etc.)

Parallelize across destinations. Each city is independent — no blocking. Cache aggressively per-city (Rome content doesn't need regenerating every time someone plans a Rome trip).

### Stage 3 — Day-by-day composition

Takes skeleton + per-city research + pace preference. Produces the time-blocked day schedule. Enforces constraints: travel days don't schedule 9 a.m. activities, Sundays prioritize Mass for pilgrimage trips, Children in party → no >3hr museum blocks.

### Stage 4 — Personality pass

Final prose polish. Inserts party-specific voice: "With your twins, pack layers for the breezy walk up to San Miniato…" Kills corporate-AI phrasing ("a vibrant tapestry of…"). This is where a tight system prompt with explicit banned phrases matters.

### Stage 5 — Structured data extraction for widgets

From the final itinerary, extract:
- All coordinates (for maps)
- All phone numbers (for tap-to-call)
- Language phrases per destination (for the TTS tab)
- Packing-list seeds
- Budget roll-up

### Prompt engineering priorities

- System prompt includes the Vocatio brand voice and Catholic sensibility (configurable per tenant)
- Few-shot examples should be *raindango.com/x actual content* — the bar is already set
- Use Claude's `stop_sequences` and structured outputs for skeletons; prose generation remains free-form
- Run evals against a golden set of 10 prototype trip requests (Rome pilgrimage family of 5, Lisbon-Fatima parish group of 40, Kyoto business solo, etc.) before shipping

### Cost envelope

Per-trip generation cost estimate at current Claude pricing, worst-case 7-city 14-day trip: ~$0.40–$0.80. With per-city caching after ~100 trips generated: drops to ~$0.15–$0.30 per new trip. Recoverable on any trip that converts to a Vocatio booking at ~$3–8K revenue.

---

## 8. UI / UX Design System

Extract the raindango.com/x design language, re-skin for Vocatio:

**Typography:** Vocatio uses serif display for headlines (looks like Tenor Sans or similar) + clean sans-serif body. Match.
**Palette:** Vocatio's palette leans warm cream, deep navy, accent gold. Pull the exact hex values from their CSS. Replace raindango.com/x's ocean/sand palette with Vocatio's.
**Tab nav:** Keep raindango's horizontal scrolling tab bar on mobile, fixed on desktop. Use Vocatio typography.
**Cards:** Rounded but restrained, elevated shadow, generous whitespace. Avoid the "AI app" look (gradients, overly rounded, purple accents). Match Vocatio's editorial feel.
**Iconography:** Lucide icons styled in the accent gold. No emoji in nav (raindango.com/x uses emoji tabs; for Vocatio keep typography-first).
**Hero imagery:** Unsplash pulls per destination, curated keyword list per tenant to avoid AI-slop stock photos. For pilgrimage destinations, bias toward architectural and devotional imagery.

**Build approach:** React Server Components where possible, `use client` only for interactive widgets (countdown, weather fetch, packing checkboxes, TTS). This keeps the output pages fast — they should Lighthouse score 95+ on mobile, same as raindango.com/x does.

---

## 9. Phased Roadmap

### Phase 0 — Validation sprint (Week 1)
- Meet with Vocatio stakeholders. Confirm positioning, brand rules, integration preference (subdomain vs embed).
- Pull exact Vocatio brand tokens (fonts, colors, spacing).
- Align on 2 golden-path trip types to ship in MVP: (a) Italy pilgrimage for parish group, (b) Multi-city family pleasure trip (Rome-Florence-Capri — your example).
- Deliverable: signed SOW, brand kit, access to Webflow if needed.

### Phase 1 — MVP (Weeks 2–5)
- Next.js scaffold, Supabase, tenant config for Vocatio.
- Intake form with all §4.1 fields, validation, HubSpot webhook.
- LLM pipeline stages 1–4 (skip stage 5 widgets for MVP — serve flat HTML first).
- Output page with 8 core tabs: Overview · Itinerary · Lodging · Dining · Experiences · Practical · Packing · Contact/Refine.
- Subdomain deployed: `plan.vocatiotravel.com`.
- Analytics: PostHog or Fathom.
- Hand-test with 10 prototype trips.
- **Demo-ready deliverable:** show Vocatio a live generator that produces a real trip guide.

### Phase 2 — Beta with real users (Weeks 6–9)
- Soft-launch to Vocatio's existing contact-form leads (A/B: half go to form, half go to generator).
- Add stage 5 widgets: live weather per city, countdown, language phrases with TTS, embedded maps.
- "Kids Corner" conditional tab.
- PDF export via Puppeteer.
- Refine loop: "Request changes" → regen.
- Planner dashboard: Vocatio's internal team sees all generated itineraries, can claim/edit/reach out.
- Target: 50 trips generated, 10%+ booking-call conversion.

### Phase 3 — Production & expansion (Weeks 10–14)
- Per-city content caching (cost optimization).
- Opus tier for premium "deep plan."
- Multi-language output for international groups.
- Group coordination features: invite group members to see the itinerary, collect RSVPs.
- Salesforce/HubSpot deeper pipeline integration.
- SOC 2 / privacy review if Vocatio requires.

### Phase 4 — Productize (Month 4+)
- Re-theme for Raindango's next vertical (estate planning firm retreats, dental CE trips, corporate offsites).
- Tenant self-service onboarding.
- Gumroad/marketplace listing for smaller travel businesses.

---

## 10. Success Metrics

| Metric | Target (90 days post-launch) | Why |
|---|---|---|
| Form completion rate | ≥55% of starts | Form UX quality |
| Generation success rate | ≥98% | Reliability |
| Median time to generated guide | ≤30s | Perceived quality |
| "Book a call" CTA click rate on output | ≥15% | Conversion funnel |
| Form-to-booked-call conversion | ≥4× current contact-form rate | Core business case |
| Booked-call-to-signed-client | Match or beat existing rate | No regression |
| Generator cost per signed client | ≤$50 in API costs | Unit economics |
| Vocatio NPS from planners (internal tool) | ≥8 | Adoption by staff |

Instrument from day one. Without these, the engagement becomes faith-based.

---

## 11. Commercial Model (Raindango ↔ Vocatio)

Structure the engagement so it funds itself and positions Raindango for recurring revenue:

- **Build phase (Weeks 1–9):** fixed-fee project. $25–40K range depending on scope. Milestones tied to Phase 0–2 deliverables.
- **Retainer (Month 3 onward):** $3–5K/month for hosting, LLM costs pass-through + margin, feature iteration, prompt tuning, analytics review. Includes X regenerations per month.
- **Success kicker (optional):** 5% of incremental bookings attributable to the generator for 12 months. Only if Vocatio buys in — signals you're aligned on outcomes, not billable hours.

Case-study rights: non-negotiable. This is exactly the Q1 case study your growth roadmap targets.

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LLM hallucinates closed restaurants, wrong addresses | High | High | Cross-check every proper noun against Google Places. Cache validated data. Never generate phone numbers — only pull from verified sources. |
| Generation takes >60s, users bounce | Medium | High | Parallelize stage 2. Stream tab content as it's ready. Show honest progress, not fake spinners. |
| Vocatio planners see it as threat, slow-walk adoption | Medium | High | Co-design with them. Position as "give yourself the first draft." Pay bonus for planners who use it most. |
| Catholic/pilgrimage tone feels off in edge cases | Medium | Medium | Tenant-level system prompt owned by Vocatio, not Raindango. Let them edit it. |
| Abuse — people spamming regens or scraping | Low | Medium | Rate limit by email + IP. Require email confirmation for regens beyond 1. |
| Webflow integration politics | Low | Low | Use subdomain approach — zero Webflow changes. |
| Costs spike with volume | Low | Medium | Per-city caching, tiered model routing (cheap for skeleton, expensive for prose only). |
| Vocatio wants broader-than-Catholic UX | Medium | Low | Tenant config supports multiple voice profiles. Already accounted for. |

---

## 13. Open Questions (to resolve in Phase 0)

1. Does Vocatio want white-label (their brand only) or co-brand ("Powered by Raindango")? Impacts pricing conversation.
2. Do they already have a Calendly / scheduling tool, or do we pick one?
3. How does their existing HubSpot pipeline work? Lead stages, owners, SLAs.
4. Which planner owns the inbound generator leads? Round-robin, regional, destination-specific?
5. Do they have any on-the-ground partner APIs (hotel blocks, tour operators) we should wire in for real bookability, or is the tool purely at the planning layer?
6. Language support — Spanish outputs for US Hispanic parishes? Italian for European groups?
7. Data retention / privacy policy. Are kids' ages OK to collect? Probably yes, but confirm.
8. Is there any existing content library (past itineraries) we can train prompts on? Huge quality lift if yes.

---

## 14. Recommended Next Steps (this week)

1. **Send Vocatio a one-page teaser** of this plan (executive summary + §3 + §10). Aim for a 30-minute intro call.
2. **Stand up a proof-of-concept** on `plan.raindango.com` using *your* existing Cabo guide as the visual reference: same codebase, generates *any* trip, but skinned as raindango. Show-not-tell is the pitch.
3. **Pull Vocatio's brand tokens** (fonts, hex colors, spacing) directly from their Webflow CSS so the demo can be re-skinned in an afternoon.
4. **Prepare three demo trip outputs** ahead of the call: (a) Rome-Assisi pilgrimage, parish of 25; (b) Rome-Florence-Capri family vacation, 2 adults + 2 kids, 10 nights; (c) Jerusalem-Bethlehem men's retreat, 8 adults. Walk into the meeting with live links.

---

## Appendix A — Raindango tab inventory (for feature-mapping)

1. Overview
2. Hotel & Amenities
3. Suggested Itinerary
4. Getting Around
5. Dining Guide
6. Shopping Guide
7. Nightlife & Entertainment
8. Water Adventures
9. Sport Fishing
10. Trip Tips
11. Spanish Phrases (with TTS)
12. Emergency Info
13. Weather Forecast
14. Packing Checklist

## Appendix B — Vocatio-adapted tab set (generator target)

**Core (always on):**
1. Overview (trip summary, countdown, per-city weather)
2. Day-by-Day Itinerary
3. Lodging
4. Dining
5. Experiences & Activities
6. Getting Around (inter-city logistics)
7. Practical Info (visas, currency, plugs, dress codes)
8. Language & Phrases (TTS)
9. Emergency
10. Packing Checklist

**Conditional (shown based on form inputs):**
11. Spiritual Sites & Mass Schedule (if purpose = pilgrimage OR party = parish/ministry)
12. Kids' Corner (if children > 0)
13. Meeting & Workspace Logistics (if purpose = business)
14. Budget & Costs (if party > 15 — group finance)
15. Group Coordination (if party > 10 — rooming, passports, RSVPs)

---

## Appendix C — The raindango.com/x signature moves (don't lose these)

- Live local time in the destination, not user's time
- Countdown to trip start
- One section with clear personality — the "Stevie/Travis cannabis warning" equivalent. For Vocatio: gentle trip-specific spiritual reflections, or a per-destination "don't miss" aside
- Interactive packing checkboxes that persist (localStorage)
- Tap-to-call emergency numbers
- Unsplash hero imagery, not stock illustrations
- Single-file shareability: the output URL is all they need, no login, no app

These are what make raindango.com/x feel like a gift rather than a document. Port every one.
