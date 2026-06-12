import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { anonCookie, verifyAnonToken } from "@/lib/anon";
import { getCaseForToken, getLatestLetter } from "@/lib/cases";
import { FaxForm } from "./fax-form";

export const dynamic = "force-dynamic";

export default async function CasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { id } = await params;
  const { upgraded } = await searchParams;

  const cookieStore = await cookies();
  const anonToken = verifyAnonToken(cookieStore.get(anonCookie.name)?.value);
  if (!anonToken) notFound();

  const caseRow = await getCaseForToken(id, anonToken);
  if (!caseRow) notFound();
  const letter = await getLatestLetter(id);

  return (
    <main className="mx-auto max-w-3xl px-6">
      <header className="py-6">
        <Link href="/" className="text-blue-700 underline">
          ← MA Appeal Helper
        </Link>
      </header>

      {upgraded && (
        <div className="mb-6 rounded-xl bg-green-50 p-4 text-lg text-green-900">
          <strong>Upgrade complete.</strong> Your full appeal package letter is
          below (it may take a minute to finish — refresh if needed).
        </div>
      )}

      <h1 className="text-3xl font-bold">Your appeal</h1>
      <dl className="mt-4 grid gap-x-8 gap-y-2 text-lg sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Service denied</dt>
          <dd className="text-slate-700">{caseRow.serviceDescription ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold">Filing deadline</dt>
          <dd className="text-slate-700">
            {caseRow.appealDeadline ?? "unknown"}
            {caseRow.deadlineEstimated && " (estimated)"}
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Plan</dt>
          <dd className="text-slate-700">{caseRow.payerSlug ?? "—"}</dd>
        </div>
        <div>
          <dt className="font-semibold">Status</dt>
          <dd className="text-slate-700">
            {caseRow.tier === "paid" ? "Complete Appeal Package" : "Free letter"}
          </dd>
        </div>
      </dl>

      {letter ? (
        <>
          <pre className="mt-6 whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-6 font-serif text-lg leading-relaxed">
            {letter.contentMd}
          </pre>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a
              href={`/api/pdf/${caseRow.id}`}
              className="flex items-center justify-center rounded-xl border border-blue-700 px-6 py-3 text-lg font-semibold text-blue-700 hover:bg-blue-50"
            >
              Download PDF
            </a>
            {caseRow.tier !== "paid" && (
              <Link
                href={`/case/${caseRow.id}/upgrade`}
                className="flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
              >
                Upgrade to the Complete Package — $39
              </Link>
            )}
          </div>
          {caseRow.tier === "paid" && <FaxForm caseId={caseRow.id} />}
        </>
      ) : (
        <p className="mt-6 text-lg text-slate-600">
          No letter yet.{" "}
          <Link href="/new" className="text-blue-700 underline">
            Start your appeal
          </Link>
          .
        </p>
      )}
    </main>
  );
}
