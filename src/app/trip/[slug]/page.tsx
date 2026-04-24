import { notFound } from "next/navigation";
import { getTripBySlug } from "@/lib/trips";
import { TripGuide } from "@/components/TripGuide";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) return { title: "Trip not found" };
  return {
    title: `${trip.title} — Vocatio draft itinerary`,
    description: trip.subtitle,
  };
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);
  if (!trip) notFound();
  return <TripGuide trip={trip} />;
}
