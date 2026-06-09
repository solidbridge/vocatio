import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopic, topics } from "@/lib/topics";

interface Props {
  params: Promise<{ topic: string }>;
}

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getTopic((await params).topic);
  if (!topic) return {};
  return {
    title: `Medicare Advantage ${topic.heading}: How to Appeal (2026)`,
    description: `${topic.blurb.slice(0, 150)}…`,
  };
}

export default async function TopicPage({ params }: Props) {
  const topic = getTopic((await params).topic);
  if (!topic) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6">
      <header className="py-6">
        <Link href="/" className="text-blue-700 underline">
          ← MA Appeal Helper
        </Link>
      </header>

      <h1 className="text-3xl font-bold leading-tight">
        Medicare Advantage {topic.heading}: How to Appeal
      </h1>
      <p className="mt-4 text-lg text-slate-700">{topic.blurb}</p>

      <div className="mt-6 rounded-xl bg-blue-50 p-6">
        <p className="text-lg font-semibold">
          Turn your denial letter into an appeal in minutes — free.
        </p>
        <Link
          href="/new"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
        >
          Start my free appeal letter
        </Link>
      </div>

      <h2 className="mt-10 text-2xl font-bold">Arguments that win this appeal</h2>
      <ul className="mt-4 list-disc space-y-3 pl-6 text-lg text-slate-700">
        {topic.appealAngles.map((angle) => (
          <li key={angle}>{angle}</li>
        ))}
      </ul>

      <h2 className="mt-10 text-2xl font-bold">Your rights on every appeal</h2>
      <ul className="mt-4 list-disc space-y-3 pl-6 text-lg text-slate-700">
        <li>65 days from the notice date to file your reconsideration.</li>
        <li>A decision in 30 days — or 72 hours if delay could seriously harm you.</li>
        <li>
          Automatic escalation to an independent reviewer if the plan upholds its
          denial.
        </li>
      </ul>
    </main>
  );
}
