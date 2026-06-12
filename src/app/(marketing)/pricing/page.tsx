import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free Medicare Advantage appeal letters. Upgrade to the Complete Appeal Package for $39, or unlimited appeals for practices at $99/month.",
};

const tiers = [
  {
    name: "Free letter",
    price: "$0",
    cta: { label: "Start free", href: "/new" },
    features: [
      "Upload or photograph your denial letter",
      "AI reads it — you confirm the details",
      "Basic appeal letter citing Medicare rules",
      "Your 65-day filing deadline, computed",
    ],
  },
  {
    name: "Complete Appeal Package",
    price: "$39",
    highlight: true,
    cta: { label: "Start, then upgrade", href: "/new" },
    features: [
      "Everything in Free",
      "Full point-by-point rebuttal of your plan's stated criteria",
      "Citations to the Medicare regulations that protect you",
      "Payer-specific filing instructions + enclosure checklist",
      "Professional PDF download",
      "We fax it for you",
      "Deadline reminder emails",
    ],
  },
  {
    name: "For practices",
    price: "$99/mo",
    cta: { label: "Contact us", href: "mailto:solidbridgeit@gmail.com" },
    features: [
      "Unlimited appeal letters",
      "Multi-patient dashboard",
      "Per-payer templates",
      "Priority support",
      "Coming soon — join the waitlist",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6">
      <header className="py-6">
        <Link href="/" className="text-blue-700 underline">
          ← MA Appeal Helper
        </Link>
      </header>
      <h1 className="text-center text-3xl font-bold">Simple pricing</h1>
      <p className="mt-3 text-center text-lg text-slate-600">
        Start free. Pay only if you want the full package. No success fees.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl border p-6 ${
              tier.highlight ? "border-blue-700 shadow-lg" : "border-slate-200"
            }`}
          >
            <h2 className="text-xl font-bold">{tier.name}</h2>
            <p className="mt-2 text-3xl font-bold">{tier.price}</p>
            <ul className="mt-4 space-y-2 text-slate-700">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-blue-700">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={tier.cta.href}
              className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-lg font-semibold ${
                tier.highlight
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "border border-blue-700 text-blue-700 hover:bg-blue-50"
              }`}
            >
              {tier.cta.label}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
