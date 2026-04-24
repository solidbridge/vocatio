"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Hotel,
  UtensilsCrossed,
  Compass,
  Train,
  Info,
  Languages,
  PhoneCall,
  BackpackIcon,
  Heart,
  Baby,
  Share2,
  Download,
  MessageSquarePlus,
  CheckCircle2,
} from "lucide-react";
import type { Trip } from "@/lib/types";
import { Countdown } from "./Countdown";
import { WeatherWidget } from "./WeatherWidget";
import { PackingChecklist } from "./PackingChecklist";

type TabId =
  | "overview"
  | "itinerary"
  | "lodging"
  | "dining"
  | "experiences"
  | "getting-around"
  | "practical"
  | "phrases"
  | "emergency"
  | "packing"
  | "shrines"
  | "kids";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  conditional?: (trip: Trip) => boolean;
}

const ALL_TABS: Tab[] = [
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "itinerary", label: "Day-by-Day", icon: Calendar },
  { id: "lodging", label: "Lodging", icon: Hotel },
  { id: "dining", label: "Dining", icon: UtensilsCrossed },
  { id: "experiences", label: "Experiences", icon: Compass },
  { id: "getting-around", label: "Getting Around", icon: Train },
  { id: "practical", label: "Practical", icon: Info },
  { id: "phrases", label: "Language", icon: Languages },
  { id: "emergency", label: "Emergency", icon: PhoneCall },
  { id: "packing", label: "Packing", icon: BackpackIcon },
  {
    id: "shrines",
    label: "Shrines & Mass",
    icon: Heart,
    conditional: (t) => t.purpose === "pilgrimage" || !!t.shrines?.length,
  },
  {
    id: "kids",
    label: "Kids' Corner",
    icon: Baby,
    conditional: (t) => t.party.children > 0,
  },
];

export function TripGuide({ trip }: { trip: Trip }) {
  const tabs = useMemo(
    () => ALL_TABS.filter((t) => !t.conditional || t.conditional(trip)),
    [trip],
  );
  const [active, setActive] = useState<TabId>("overview");

  return (
    <div className="pb-16">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[60vh] min-h-[420px] max-h-[600px] overflow-hidden">
          <Image
            src={trip.destinations[0].heroImage ?? ""}
            alt={trip.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,30,61,0.75)] via-[rgba(15,30,61,0.25)] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 container-v pb-10 text-white">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="rule-gold" />
                <span className="eyebrow" style={{ color: "var(--color-gold-200)" }}>
                  Vocatio draft itinerary
                </span>
              </div>
              <h1 className="text-white mb-3" style={{ color: "#fff" }}>
                <span className="italic">{trip.title}</span>
              </h1>
              <p className="text-lg opacity-90 max-w-2xl">{trip.subtitle}</p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <HeroPill icon={Calendar}>
                  {formatDateRange(trip.startDate, trip.endDate)}
                </HeroPill>
                <HeroPill icon={Users}>
                  {trip.party.adults} adults
                  {trip.party.children > 0 ? ` + ${trip.party.children} children` : ""}
                </HeroPill>
                <HeroPill icon={MapPin}>
                  {trip.destinations.map((d) => d.city).join(" · ")}
                </HeroPill>
              </div>
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div
          className="sticky top-16 z-30 bg-[var(--color-cream-50)]/95 backdrop-blur border-b border-[var(--color-cream-200)]"
        >
          <div className="container-v flex items-center justify-between gap-4 py-3">
            <div className="text-sm text-[var(--color-muted)] hidden md:block">
              This is a first-draft itinerary. A Vocatio planner will finish it.
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button className="btn btn-ghost" aria-label="Share">
                <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
              </button>
              <button className="btn btn-ghost" aria-label="Download PDF">
                <Download size={14} /> <span className="hidden sm:inline">PDF</span>
              </button>
              <button className="btn btn-ghost" aria-label="Request changes">
                <MessageSquarePlus size={14} /> <span className="hidden sm:inline">Refine</span>
              </button>
              <Link href="#book" className="btn btn-gold">
                Book a planner call
              </Link>
            </div>
          </div>

          {/* TAB BAR */}
          <div className="tabs-scroll overflow-x-auto">
            <div className="container-v">
              <div
                role="tablist"
                aria-label="Itinerary sections"
                className="flex gap-1 border-t border-[var(--color-cream-200)]"
              >
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={active === t.id}
                    onClick={() => setActive(t.id)}
                    className="tab-btn flex items-center gap-2"
                  >
                    <t.icon size={14} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTDOWN + WEATHER STRIP */}
      <section className="container-v mt-10 grid md:grid-cols-2 gap-5">
        <Countdown startDate={trip.startDate} />
        <WeatherWidget destinations={trip.destinations} />
      </section>

      {/* PANELS */}
      <section className="container-v mt-10">
        {active === "overview" && <OverviewPanel trip={trip} />}
        {active === "itinerary" && <ItineraryPanel trip={trip} />}
        {active === "lodging" && <LodgingPanel trip={trip} />}
        {active === "dining" && <DiningPanel trip={trip} />}
        {active === "experiences" && <ExperiencesPanel trip={trip} />}
        {active === "getting-around" && <GettingAroundPanel trip={trip} />}
        {active === "practical" && <PracticalPanel trip={trip} />}
        {active === "phrases" && <PhrasesPanel trip={trip} />}
        {active === "emergency" && <EmergencyPanel trip={trip} />}
        {active === "packing" && <PackingChecklist trip={trip} />}
        {active === "shrines" && <ShrinesPanel trip={trip} />}
        {active === "kids" && <KidsPanel trip={trip} />}
      </section>

      {/* BOOK CTA */}
      <section id="book" className="container-v mt-20">
        <div
          className="rounded-[20px] p-10 md:p-14 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-navy-800), var(--color-navy-600))",
          }}
        >
          <div className="relative grid md:grid-cols-2 gap-8 items-center text-white">
            <div>
              <span className="eyebrow" style={{ color: "var(--color-gold-200)" }}>
                Finish your trip with a planner
              </span>
              <h2 className="text-white mt-3">
                Love this draft? Let's make it real.
              </h2>
              <p className="text-[var(--color-cream-200)] mt-4 max-w-md">
                Book a thirty-minute call with a Vocatio planner. We verify
                availability, add our partner network, and lock in what you've
                seen.
              </p>
            </div>
            <div className="md:text-right">
              <Link href="/plan" className="btn btn-gold">
                Book a planner call
              </Link>
              <div className="text-xs text-[var(--color-cream-200)] mt-3">
                Or reply to the email we sent — a planner will be in touch within one business day.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroPill({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] backdrop-blur text-white">
      <Icon size={14} />
      <span>{children}</span>
    </div>
  );
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", { ...opts, year: "numeric" })}`;
}

/* ───────────────────────── Panels ───────────────────────── */

function OverviewPanel({ trip }: { trip: Trip }) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <span className="eyebrow">Overview</span>
        <h2 className="mt-3 mb-5">What we're planning.</h2>
        <p className="text-lg leading-relaxed text-[var(--color-ink)]">
          {trip.overview}
        </p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {trip.destinations.map((d) => (
            <div key={d.city} className="card p-5">
              <div className="eyebrow">Stop</div>
              <div className="font-[family-name:var(--font-display)] text-2xl mt-1">
                {d.city}
              </div>
              <div className="text-sm text-[var(--color-muted)]">
                {d.country} · {d.nights} nights
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="card p-6 h-fit">
        <div className="eyebrow mb-2">At a glance</div>
        <dl className="text-sm space-y-3">
          <Row label="Purpose" value={capitalize(trip.purpose)} />
          <Row
            label="Party"
            value={`${trip.party.adults} adults${
              trip.party.children ? ` + ${trip.party.children} kids (${trip.party.childAges})` : ""
            }`}
          />
          <Row
            label="Nights"
            value={trip.destinations.reduce((a, d) => a + d.nights, 0).toString()}
          />
          <Row
            label="Cities"
            value={trip.destinations.map((d) => d.city).join(", ")}
          />
        </dl>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--color-cream-200)] pb-3 last:border-0 last:pb-0">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="text-[var(--color-navy-800)] text-right">{value}</dd>
    </div>
  );
}

function ItineraryPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Day-by-day</span>
      <h2 className="mt-3 mb-8">Your trip, hour by hour.</h2>
      <div className="space-y-10">
        {trip.days.map((day, i) => (
          <article
            key={i}
            className="grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 pb-10 border-b border-[var(--color-cream-200)] last:border-0 last:pb-0"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gold-600)]">
                {day.date}
              </div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">
                {day.city}
              </div>
              <div className="font-[family-name:var(--font-display)] text-2xl mt-2 text-[var(--color-navy-800)]">
                {day.title}
              </div>
            </div>
            <div>
              <p className="text-[var(--color-ink)] leading-relaxed mb-5">
                {day.narrative}
              </p>
              <ul className="space-y-2">
                {day.blocks.map((b, j) => (
                  <li key={j} className="flex gap-4 text-sm">
                    <div className="w-16 shrink-0 font-mono text-[var(--color-muted)]">
                      {b.time}
                    </div>
                    <div className="flex-1">
                      <div className="text-[var(--color-navy-800)] font-medium">
                        {b.title}
                      </div>
                      {b.detail && (
                        <div className="text-[var(--color-muted)] mt-0.5">
                          {b.detail}
                        </div>
                      )}
                    </div>
                    {b.category && (
                      <span className="chip text-[0.7rem]">{b.category}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function LodgingPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Lodging</span>
      <h2 className="mt-3 mb-8">Where you'll sleep.</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {trip.lodging.map((l) => (
          <div key={l.city} className="card p-6">
            <div className="eyebrow">{l.city}</div>
            <h3 className="mt-2 mb-1">{l.name}</h3>
            <div className="text-sm text-[var(--color-muted)] mb-4">
              {l.neighborhood} · {l.style}
            </div>
            <p className="text-sm leading-relaxed">{l.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiningPanel({ trip }: { trip: Trip }) {
  const byCity = groupBy(trip.dining, (d) => d.city);
  return (
    <div>
      <span className="eyebrow">Dining</span>
      <h2 className="mt-3 mb-8">Where to eat — and why.</h2>
      <div className="space-y-10">
        {Object.entries(byCity).map(([city, picks]) => (
          <div key={city}>
            <h3 className="mb-4">{city}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {picks.map((p) => (
                <div key={p.name} className="card p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-[var(--color-navy-800)]">
                        {p.name}
                      </div>
                      <div className="text-xs text-[var(--color-muted)] mt-0.5">
                        {capitalize(p.meal)} · {p.neighborhood}
                      </div>
                    </div>
                    <span className="chip-gold chip">{p.priceBand}</span>
                  </div>
                  <p className="text-sm mt-3 leading-relaxed">{p.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperiencesPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Experiences</span>
      <h2 className="mt-3 mb-8">The things that will stick.</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {trip.experiences.map((e) => (
          <div key={e.name} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="eyebrow">{e.city}</div>
                <div className="font-medium text-[var(--color-navy-800)] mt-1">
                  {e.name}
                </div>
              </div>
              {e.kidsFriendly && (
                <span className="chip text-[0.7rem]">Kid-friendly</span>
              )}
            </div>
            <p className="text-sm mt-3 leading-relaxed">{e.why}</p>
            {e.leadTime && (
              <div className="text-xs text-[var(--color-gold-700)] mt-3">
                {e.leadTime}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GettingAroundPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Getting around</span>
      <h2 className="mt-3 mb-8">Between cities, inside cities.</h2>
      <div className="card p-6 md:p-8">
        <ol className="relative border-l-2 border-[var(--color-gold-200)] ml-3 space-y-6">
          {trip.destinations.map((d, i) => (
            <li key={d.city} className="pl-6 relative">
              <span
                className="absolute -left-[9px] top-1 w-4 h-4 rounded-full"
                style={{ background: "var(--color-gold-500)" }}
              />
              <div className="eyebrow">Leg {i + 1}</div>
              <div className="font-[family-name:var(--font-display)] text-xl text-[var(--color-navy-800)]">
                {d.city}, {d.country}
              </div>
              <div className="text-sm text-[var(--color-muted)] mt-1">
                {d.nights} nights
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8 text-sm leading-relaxed text-[var(--color-muted)]">
          <strong className="text-[var(--color-navy-800)]">Inter-city:</strong> Frecciarossa high-speed between Rome and Florence (~1h25m). Florence → Naples by Frecciarossa (~3h), then private car + hydrofoil to Capri (~2h). Inside cities, expect to walk 4–6 miles a day; taxis for anything past 20 minutes on foot or after 9 p.m. with children.
        </div>
      </div>
    </div>
  );
}

function PracticalPanel({ trip }: { trip: Trip }) {
  const entries: { label: string; value: string }[] = [
    { label: "Currency", value: trip.practical.currency },
    { label: "Plug & voltage", value: trip.practical.plug },
    { label: "Visa & entry", value: trip.practical.visa },
    { label: "Dress codes", value: trip.practical.dressCodes },
    { label: "Tipping", value: trip.practical.tipping },
  ];
  return (
    <div>
      <span className="eyebrow">Practical</span>
      <h2 className="mt-3 mb-8">What nobody tells you until it's too late.</h2>
      <div className="card divide-y divide-[var(--color-cream-200)]">
        {entries.map((e) => (
          <div key={e.label} className="p-6 grid md:grid-cols-[200px_1fr] gap-4">
            <div className="eyebrow">{e.label}</div>
            <div className="text-sm leading-relaxed">{e.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhrasesPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Language</span>
      <h2 className="mt-3 mb-2">A few phrases that go a long way.</h2>
      <p className="text-sm text-[var(--color-muted)] mb-8">
        Tap any phrase to hear it spoken.
      </p>
      <div className="grid md:grid-cols-2 gap-3">
        {trip.phrases.map((p) => (
          <PhraseCard key={p.phrase} phrase={p.phrase} meaning={p.meaning} pronunciation={p.pronunciation} language={p.language} />
        ))}
      </div>
    </div>
  );
}

function PhraseCard({
  phrase,
  meaning,
  pronunciation,
  language,
}: {
  phrase: string;
  meaning: string;
  pronunciation: string;
  language: string;
}) {
  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(phrase);
    if (language.toLowerCase().startsWith("italian")) utter.lang = "it-IT";
    else if (language.toLowerCase().startsWith("spanish")) utter.lang = "es-ES";
    else if (language.toLowerCase().startsWith("french")) utter.lang = "fr-FR";
    window.speechSynthesis.speak(utter);
  };
  return (
    <button
      onClick={speak}
      className="card p-5 text-left hover:border-[var(--color-gold-500)] hover:shadow-[var(--shadow-card-hover)] transition"
    >
      <div className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-navy-800)]">
        {phrase}
      </div>
      <div className="text-sm text-[var(--color-muted)] mt-1">{meaning}</div>
      <div className="text-xs text-[var(--color-gold-700)] mt-2 font-mono">
        {pronunciation}
      </div>
    </button>
  );
}

function EmergencyPanel({ trip }: { trip: Trip }) {
  return (
    <div>
      <span className="eyebrow">Emergency</span>
      <h2 className="mt-3 mb-8">If something goes wrong.</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {trip.emergency.map((e) => (
          <div key={e.city} className="card p-6">
            <h3 className="mb-4">{e.city}</h3>
            <TapRow label="Police" value={e.police} />
            <TapRow label="Medical" value={e.medical} />
            {e.nearestConsulate && (
              <TapRow label="Consulate" value={e.nearestConsulate} />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--color-muted)] mt-6">
        112 works as a universal emergency number across the EU. Save it as a favorite before you leave.
      </p>
    </div>
  );
}

function TapRow({ label, value }: { label: string; value: string }) {
  const phoneMatch = value.match(/[\d+\s()-]{6,}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;
  return (
    <div className="py-3 border-b border-[var(--color-cream-200)] last:border-0 last:pb-0">
      <div className="eyebrow">{label}</div>
      {phone ? (
        <a
          href={`tel:${phone.replace(/\s|[()-]/g, "")}`}
          className="text-sm mt-1 inline-block text-[var(--color-navy-800)] underline decoration-[var(--color-gold-500)] decoration-2 underline-offset-4"
        >
          {value}
        </a>
      ) : (
        <div className="text-sm mt-1">{value}</div>
      )}
    </div>
  );
}

function ShrinesPanel({ trip }: { trip: Trip }) {
  if (!trip.shrines?.length) {
    return (
      <div className="card p-8 text-center text-[var(--color-muted)]">
        Shrine and Mass details will be finalized with your planner once dates
        are confirmed.
      </div>
    );
  }
  return (
    <div>
      <span className="eyebrow">Shrines & Mass</span>
      <h2 className="mt-3 mb-8">Where the trip becomes a pilgrimage.</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {trip.shrines.map((s) => (
          <div key={s.name} className="card p-6">
            <div className="eyebrow">{s.city}</div>
            <h3 className="mt-2 mb-2">{s.name}</h3>
            <p className="text-sm leading-relaxed mb-4">{s.why}</p>
            {s.massTimes && (
              <div className="text-sm">
                <span className="eyebrow block mb-1">Mass</span>
                {s.massTimes}
              </div>
            )}
            {s.confessionTimes && (
              <div className="text-sm mt-3">
                <span className="eyebrow block mb-1">Confession</span>
                {s.confessionTimes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function KidsPanel({ trip }: { trip: Trip }) {
  if (!trip.kids) return null;
  return (
    <div>
      <span className="eyebrow">Kids' corner</span>
      <h2 className="mt-3 mb-2">Planned with {trip.party.childAges} in mind.</h2>
      <p className="text-sm text-[var(--color-muted)] mb-8">
        The small decisions that decide whether the kids come home as happy as the adults.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <KidList title="Snack picks" items={trip.kids.snackPicks} />
        <KidList title="Downtime ideas" items={trip.kids.downtimeIdeas} />
        <KidList title="Day-killers to avoid" items={trip.kids.dayKillers} />
      </div>
    </div>
  );
}

function KidList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[var(--color-gold-500)]" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── utils ───────────────────────── */

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}
