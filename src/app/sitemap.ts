import type { MetadataRoute } from "next";
import { payers } from "@/lib/payers/payers";
import { topics } from "@/lib/topics";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/new`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    ...payers.map((p) => ({
      url: `${BASE}/appeals/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...topics.map((t) => ({
      url: `${BASE}/denials/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
