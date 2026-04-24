import type { Trip } from "./types";
import { sampleTrip } from "./sample-trip";
import { pilgrimageTrip } from "./sample-pilgrimage";

export const allSampleTrips: Trip[] = [sampleTrip, pilgrimageTrip];

export function getTripBySlug(slug: string): Trip | undefined {
  return allSampleTrips.find((t) => t.slug === slug);
}
