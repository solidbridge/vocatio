"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, CloudSun } from "lucide-react";
import type { Destination } from "@/lib/types";

type CityWeather = {
  city: string;
  tempC: number;
  tempF: number;
  code: number;
  localTime: string;
};

// https://open-meteo.com/en/docs — subset of WMO weather codes
function codeToSummary(code: number): { label: string; Icon: React.ComponentType<{ size?: number; className?: string }> } {
  if (code === 0) return { label: "Clear", Icon: Sun };
  if (code <= 2) return { label: "Mostly sunny", Icon: CloudSun };
  if (code === 3) return { label: "Overcast", Icon: Cloud };
  if (code >= 51 && code <= 67) return { label: "Rain", Icon: CloudRain };
  if (code >= 71 && code <= 77) return { label: "Snow", Icon: Cloud };
  if (code >= 80 && code <= 82) return { label: "Showers", Icon: CloudRain };
  if (code >= 95) return { label: "Thunder", Icon: CloudRain };
  return { label: "Mixed", Icon: CloudSun };
}

export function WeatherWidget({ destinations }: { destinations: Destination[] }) {
  const [data, setData] = useState<CityWeather[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const results = await Promise.all(
          destinations
            .filter((d) => typeof d.lat === "number" && typeof d.lng === "number")
            .map(async (d) => {
              const url = `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}&current=temperature_2m,weather_code&timezone=auto`;
              const res = await fetch(url);
              if (!res.ok) throw new Error(String(res.status));
              const json = await res.json();
              const tempC = json.current.temperature_2m as number;
              const code = json.current.weather_code as number;
              const localTime = new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: d.timezone ?? "UTC",
              });
              return {
                city: d.city,
                tempC,
                tempF: Math.round(tempC * 1.8 + 32),
                code,
                localTime,
              };
            }),
        );
        if (!cancelled) {
          setData(results);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [destinations]);

  return (
    <div className="card p-6">
      <div className="eyebrow mb-4">Live weather · local time</div>
      {status === "loading" && (
        <div className="text-sm text-[var(--color-muted)]">Pulling current conditions…</div>
      )}
      {status === "error" && (
        <div className="text-sm text-[var(--color-muted)]">
          We'll have live weather here once you're online.
        </div>
      )}
      {status === "ready" && (
        <div className="grid sm:grid-cols-3 gap-4">
          {data.map((w) => {
            const { label, Icon } = codeToSummary(w.code);
            return (
              <div key={w.city}>
                <div className="flex items-center gap-2 text-[var(--color-navy-800)]">
                  <Icon size={18} className="text-[var(--color-gold-600)]" />
                  <div className="font-[family-name:var(--font-display)] text-lg">
                    {w.city}
                  </div>
                </div>
                <div className="text-2xl font-[family-name:var(--font-display)] text-[var(--color-navy-800)] mt-1">
                  {w.tempF}°F
                  <span className="text-sm text-[var(--color-muted)] ml-2">
                    {Math.round(w.tempC)}°C
                  </span>
                </div>
                <div className="text-xs text-[var(--color-muted)]">
                  {label} · {w.localTime} local
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
