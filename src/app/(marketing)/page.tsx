import Link from "next/link";
import { payers } from "@/lib/payers/payers";
import { topics } from "@/lib/topics";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-3xl px-6">
      <header className="flex items-center justify-between py-6">
        <span className="text-lg font-bold text-blue-700">MA Appeal Helper</span>
        <Link href="/pricing" className="flex items-center text-blue-700 underline">
          Pricing
        </Link>
      </header>

      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold leading-tight">
          Medicare Advantage denied your care?
          <br />
          <span className="text-blue-700">Most appeals win.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-xl text-slate-700">
          Federal data shows the majority of Medicare Advantage appeals succeed —
          but fewer than 1 in 8 denials are ever appealed. Take a photo of your
          denial letter and get a ready-to-send appeal letter in minutes.
        </p>
        <Link
          href="/new"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-blue-700 px-8 py-4 text-xl font-semibold text-white shadow hover:bg-blue-800"
        >
          Start my free appeal letter
        </Link>
        <p className="mt-3 text-base text-slate-500">
          Free. No account needed. Works on your phone.
        </p>
      </section>

      <section className="grid gap-6 py-10 sm:grid-cols-3">
        {[
          ["1. Snap or upload", "Take a photo of the denial letter, or upload the PDF."],
          ["2. Check the details", "We read it and show you what we found. You confirm or fix anything."],
          ["3. Send your appeal", "Get a letter citing Medicare rules and your plan's own criteria, plus your filing deadline."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-slate-200 p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-slate-600">{body}</p>
          </div>
        ))}
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-bold">Why appealing works</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-slate-700">
          <li>
            57–82% of appealed Medicare Advantage prior-authorization denials are
            overturned — yet fewer than 12% of denials are appealed.
          </li>
          <li>
            You have <strong>65 days</strong> from your denial notice to file. If the
            plan says no again, your case is automatically sent to an independent
            reviewer.
          </li>
          <li>
            Since 2026, plans must tell you the exact clinical criteria behind a
            denial — your appeal can answer them point by point.
          </li>
        </ul>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-bold">Appeal guides by insurer</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {payers.map((p) => (
            <Link
              key={p.slug}
              href={`/appeals/${p.slug}`}
              className="flex items-center rounded-lg border border-slate-300 px-4 py-2 text-blue-700 hover:bg-blue-50"
            >
              {p.name}
            </Link>
          ))}
        </div>
        <h2 className="mt-8 text-2xl font-bold">Appeal guides by denial type</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {topics.map((t) => (
            <Link
              key={t.slug}
              href={`/denials/${t.slug}`}
              className="flex items-center rounded-lg border border-slate-300 px-4 py-2 text-blue-700 hover:bg-blue-50"
            >
              {t.title}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
