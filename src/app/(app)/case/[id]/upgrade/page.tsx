import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { getCaseForToken } from "@/lib/cases";
import { CheckoutButton } from "./checkout-button";

export const dynamic = "force-dynamic";

const included = [
  "Full point-by-point rebuttal of every criterion your plan cited",
  "Citations to the federal Medicare regulations that protect you",
  "Filing instructions for your insurer + enclosure checklist",
  "Professional PDF, ready to mail or fax",
  "We fax it to your plan for you",
  "Deadline reminder emails so you never miss the 65-day window",
];

export default async function UpgradePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const anonToken = verifyAnonToken(cookieStore.get(anonCookie.name)?.value);
  if (!anonToken) notFound();

  const caseRow = await getCaseForToken(id, anonToken);
  if (!caseRow) notFound();
  if (caseRow.tier === "paid") redirect(`/case/${id}`);

  return (
    <main className="mx-auto max-w-2xl px-6">
      <header className="py-6">
        <Link href={`/case/${id}`} className="text-blue-700 underline">
          ← Back to my appeal
        </Link>
      </header>

      <h1 className="text-3xl font-bold">Complete Appeal Package</h1>
      <p className="mt-3 text-lg text-slate-700">
        Your free letter is a solid start. The Complete Package is the version
        built to win: it answers your plan&apos;s own criteria point by point and
        cites the regulations the reviewer must follow.
      </p>

      <ul className="mt-6 space-y-3 text-lg text-slate-700">
        {included.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="text-blue-700">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-blue-700 p-6 text-center shadow">
        <p className="text-4xl font-bold">$39</p>
        <p className="mt-1 text-slate-600">One time. No success fees.</p>
        <CheckoutButton caseId={id} />
        <p className="mt-3 text-sm text-slate-500">
          Secure payment by Stripe. Most appeals are resolved within 30 days of
          filing.
        </p>
      </div>
    </main>
  );
}
