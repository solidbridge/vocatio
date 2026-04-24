import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-cream-200)] bg-[var(--color-navy-800)] text-[var(--color-cream-100)]">
      <div className="container-v py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="font-[family-name:var(--font-display)] italic text-3xl mb-3 text-white">
            Vocatio
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-cream-200)] max-w-md">
            Custom Catholic pilgrimages and group travel, with planners on two
            continents and partners on the ground in every destination we serve.
          </p>
          <div className="mt-6 flex gap-2 flex-wrap">
            <span className="chip-gold chip">Parish & Ministry</span>
            <span className="chip-gold chip">Schools</span>
            <span className="chip-gold chip">Business & Retreat</span>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/plan">Plan your journey</Link></li>
            <li><Link href="/#destinations">Destinations</Link></li>
            <li><Link href="/trip/rome-florence-capri-demo">Sample itinerary</Link></li>
            <li><Link href="/#how">How it works</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Offices</div>
          <ul className="space-y-2 text-sm text-[var(--color-cream-200)]">
            <li>United States</li>
            <li>Europe</li>
            <li className="pt-2 text-xs opacity-70">
              hello@vocatiotravel.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--color-navy-700)]">
        <div className="container-v py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[var(--color-cream-200)]">
          <div>© {new Date().getFullYear()} Vocatio Travel. Trips you were meant to take.</div>
          <div>Itinerary drafts are generated as a starting point and reviewed by a Vocatio planner before booking.</div>
        </div>
      </div>
    </footer>
  );
}
