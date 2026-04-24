import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Users,
  Map,
  Quote,
} from "lucide-react";

const destinations = [
  {
    name: "Italy",
    tagline: "Rome · Assisi · Milan · Turin · San Giovanni Rotondo",
    img: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Holy Land",
    tagline: "Jerusalem · Bethlehem · Galilee · Petra",
    img: "https://images.unsplash.com/photo-1544734037-53bb820ab10d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "France",
    tagline: "Lourdes · Paris · Lisieux",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Spain",
    tagline: "Madrid · Ávila · Barcelona · Montserrat · Granada",
    img: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Portugal",
    tagline: "Lisbon · Fátima · Porto",
    img: "https://images.unsplash.com/photo-1513735492246-483525079686?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ireland",
    tagline: "Dublin · Cork · Knock",
    img: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&w=1200&q=80",
  },
];

const groups = [
  {
    icon: Users,
    title: "Parish & Ministry Groups",
    body:
      "Pilgrimages built around your pastor's vision: Mass schedules, shrine access, and logistics that move twenty-plus people like a family.",
  },
  {
    icon: ShieldCheck,
    title: "School Groups",
    body:
      "Tuition-conscious itineraries with real educational depth, chaperone-friendly pacing, and partners who specialize in youth travel.",
  },
  {
    icon: Sparkles,
    title: "Business, Men's & Women's Groups",
    body:
      "Retreats, incentive trips, and small-group custom travel with the structure (or lack of it) your group actually wants.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(1200px 500px at 15% 0%, rgba(201,162,94,0.18), transparent 60%), radial-gradient(900px 500px at 90% 20%, rgba(15,30,61,0.10), transparent 60%)",
          }}
        />
        <div className="container-v pt-20 pb-16 md:pt-28 md:pb-24 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-gold" />
              <span className="eyebrow">Catholic pilgrimage · Custom group travel</span>
            </div>
            <h1 className="mb-6">
              <span className="italic">Trips</span> you were
              <br />
              meant to take.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-[var(--color-muted)] max-w-xl mb-8">
              Answer a few questions about your group and we'll draft a
              personalized Vocatio itinerary in about ninety seconds — then our
              planners perfect it with partners on the ground in every city.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/plan" className="btn btn-primary">
                Plan your journey <ArrowRight size={16} />
              </Link>
              <Link
                href="/trip/rome-florence-capri-demo"
                className="btn btn-ghost"
              >
                See a sample itinerary
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--color-muted)]">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--color-gold-600)]" /> AI first draft in ~90 seconds
              </div>
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[var(--color-gold-600)]" /> Human planners finish every trip
              </div>
              <div className="flex items-center gap-2">
                <Map size={14} className="text-[var(--color-gold-600)]" /> Partners on the ground in 8+ countries
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] card overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80"
                alt="Rome cityscape at golden hour"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 768px) 40vw, 100vw"
              />
              <div className="absolute inset-x-5 bottom-5 card p-4 backdrop-blur">
                <div className="eyebrow mb-1">Currently drafting</div>
                <div className="font-[family-name:var(--font-display)] text-xl text-[var(--color-navy-800)]">
                  Rome · Florence · Capri
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">
                  10 nights · 2 adults + 2 children · Pleasure
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 bg-[var(--color-cream-100)]">
        <div className="container-v">
          <div className="text-center mb-14">
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3">Three steps to a trip that fits you.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "Tell us about your group",
                body:
                  "Purpose, party, cities, pace, must-haves. Ninety seconds on your phone.",
              },
              {
                n: "02",
                title: "Get a drafted itinerary",
                body:
                  "Day-by-day plan, lodging, dining, local phrases, packing list, weather. Yours to keep.",
              },
              {
                n: "03",
                title: "A Vocatio planner finishes it",
                body:
                  "Book a call. We verify availability, add our partner network, and make it real.",
              },
            ].map((s) => (
              <div key={s.n} className="card p-8">
                <div
                  className="font-[family-name:var(--font-display)] italic text-[var(--color-gold-500)] text-4xl mb-4"
                >
                  {s.n}
                </div>
                <h3 className="mb-2">{s.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="py-20">
        <div className="container-v">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">Destinations</span>
              <h2 className="mt-3">Frameworks we know by heart.</h2>
            </div>
            <Link href="/plan" className="btn btn-ghost">
              Design your own <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href="/plan"
                className="group card overflow-hidden"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={d.img}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,30,61,0.55)] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <div className="font-[family-name:var(--font-display)] text-2xl">
                      {d.name}
                    </div>
                    <div className="text-xs opacity-90 mt-1">{d.tagline}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GROUPS */}
      <section id="groups" className="py-20 bg-[var(--color-navy-800)] text-[var(--color-cream-50)]">
        <div className="container-v">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow" style={{ color: "var(--color-gold-200)" }}>
              Groups we serve
            </span>
            <h2 className="mt-3 text-white">
              Travel planned around who's actually going.
            </h2>
            <p className="mt-4 text-[var(--color-cream-200)]">
              A parish of twenty-five doesn't move like a family of four.
              Vocatio tailors every detail — from Mass schedules to meal pacing —
              to the people actually at the table.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {groups.map((g) => (
              <div
                key={g.title}
                className="rounded-[14px] p-8 border border-[var(--color-navy-700)]"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <g.icon className="text-[var(--color-gold-500)] mb-5" size={28} />
                <h3 className="text-white mb-2">{g.title}</h3>
                <p className="text-[var(--color-cream-200)] text-sm leading-relaxed">
                  {g.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-20">
        <div className="container-v max-w-3xl text-center">
          <Quote className="mx-auto text-[var(--color-gold-500)] mb-6" size={32} />
          <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl leading-snug text-[var(--color-navy-800)]">
            "They gave us a draft the night our group first asked about Rome.
            Two weeks later we had a trip a parish of thirty could actually
            take — and every detail held up."
          </p>
          <div className="mt-6 text-sm text-[var(--color-muted)]">
            — Fr. Daniel M., Pastor, St. Anne's Parish
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="pb-24">
        <div className="container-v">
          <div
            className="rounded-[20px] p-10 md:p-14 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, var(--color-navy-800), var(--color-navy-600))",
            }}
          >
            <div
              className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20"
              style={{ background: "var(--color-gold-500)" }}
            />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span
                  className="eyebrow"
                  style={{ color: "var(--color-gold-200)" }}
                >
                  Start now
                </span>
                <h2 className="text-white mt-3">
                  Your itinerary, drafted in the time it takes to brew coffee.
                </h2>
              </div>
              <div className="md:text-right">
                <Link href="/plan" className="btn btn-gold">
                  Plan your journey <ArrowRight size={16} />
                </Link>
                <div className="text-xs text-[var(--color-cream-200)] mt-3">
                  Free. No account needed. Keep whatever we draft.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
