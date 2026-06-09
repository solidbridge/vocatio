import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayer, payers } from "@/lib/payers/payers";

interface Props {
  params: Promise<{ payer: string }>;
}

export function generateStaticParams() {
  return payers.map((p) => ({ payer: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const payer = getPayer((await params).payer);
  if (!payer) return {};
  return {
    title: `How to Appeal a ${payer.name} Medicare Advantage Denial (2026)`,
    description: `Step-by-step guide to appealing a ${payer.name} Medicare Advantage denial: the 65-day deadline, expedited review, and a free appeal letter generator.`,
  };
}

const faq = (payerName: string) => [
  {
    q: `How long do I have to appeal a ${payerName} Medicare Advantage denial?`,
    a: "You have 65 calendar days from the date on your denial notice to file a Level 1 reconsideration with your plan.",
  },
  {
    q: "How fast must the plan decide my appeal?",
    a: "30 days for a standard pre-service appeal (60 days for payment appeals), or 72 hours if you qualify for an expedited appeal because waiting could seriously harm your health.",
  },
  {
    q: "What happens if the plan denies my appeal?",
    a: "Your case is automatically forwarded to an Independent Review Entity (IRE) outside the insurance company — you don't have to request it.",
  },
  {
    q: "Do most appeals really win?",
    a: "Federal data shows the large majority of appealed Medicare Advantage prior-authorization denials are partially or fully overturned.",
  },
];

export default async function PayerPage({ params }: Props) {
  const payer = getPayer((await params).payer);
  if (!payer) notFound();

  const faqItems = faq(payer.name);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="py-6">
        <Link href="/" className="text-blue-700 underline">
          ← MA Appeal Helper
        </Link>
      </header>

      <h1 className="text-3xl font-bold leading-tight">
        How to Appeal a {payer.name} Medicare Advantage Denial (2026)
      </h1>
      <p className="mt-4 text-lg text-slate-700">{payer.seoBlurb}</p>

      <div className="mt-6 rounded-xl bg-blue-50 p-6">
        <p className="text-lg font-semibold">
          Upload your {payer.name} denial letter and get a ready-to-send appeal
          letter in minutes — free.
        </p>
        <Link
          href={`/new?payer=${payer.slug}`}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
        >
          Start my free appeal letter
        </Link>
      </div>

      <h2 className="mt-10 text-2xl font-bold">The process, step by step</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-lg text-slate-700">
        <li>
          <strong>Find your deadline.</strong> You have 65 days from the date on
          the denial notice. Mark it — late appeals need &ldquo;good cause.&rdquo;
        </li>
        <li>
          <strong>Use the address on your notice.</strong> {payer.name} appeal
          addresses are plan-specific; the correct mailbox and fax are printed on
          your denial letter.
          {payer.appealsUrl && (
            <>
              {" "}
              General appeals info:{" "}
              <a href={payer.appealsUrl} className="text-blue-700 underline" rel="nofollow">
                {payer.name} appeals page
              </a>
              .
            </>
          )}
        </li>
        <li>
          <strong>Answer the plan&apos;s own criteria.</strong> Your notice must state
          the clinical criteria behind the denial. A strong appeal rebuts each
          one, with your doctor&apos;s notes attached.
        </li>
        <li>
          <strong>Ask for expedited review if you can&apos;t wait.</strong> If a
          30-day wait could seriously harm your health and the care hasn&apos;t
          happened yet, request a 72-hour decision — your doctor&apos;s support makes
          it mandatory.
        </li>
        <li>
          <strong>If they say no again, you advance automatically.</strong> The
          plan must send your case to an Independent Review Entity.
        </li>
      </ol>

      <h2 className="mt-10 text-2xl font-bold">Common questions</h2>
      <dl className="mt-4 space-y-5">
        {faqItems.map((item) => (
          <div key={item.q}>
            <dt className="text-lg font-semibold">{item.q}</dt>
            <dd className="mt-1 text-lg text-slate-700">{item.a}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
