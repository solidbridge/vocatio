import { notFound } from "next/navigation";
import { sampleTrip } from "@/lib/sample-trip";
import { TripGuide } from "@/components/TripGuide";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== sampleTrip.slug) return { title: "Trip not found" };
  return {
    title: `${sampleTrip.title} — Vocatio draft itinerary`,
    description: sampleTrip.subtitle,
  };
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== sampleTrip.slug) notFound();
  return <TripGuide trip={sampleTrip} />;
}
