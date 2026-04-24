"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";

export function Countdown({ startDate }: { startDate: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(startDate);
  const diff = now ? target.getTime() - now.getTime() : 0;
  const gone = diff <= 0;

  const days = Math.max(0, Math.floor(diff / 86_400_000));
  const hours = Math.max(0, Math.floor((diff % 86_400_000) / 3_600_000));
  const minutes = Math.max(0, Math.floor((diff % 3_600_000) / 60_000));
  const seconds = Math.max(0, Math.floor((diff % 60_000) / 1000));

  return (
    <div className="card p-6 flex items-center gap-5">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--color-gold-50)", color: "var(--color-gold-700)" }}
      >
        <Hourglass size={22} />
      </div>
      <div className="flex-1">
        <div className="eyebrow">Countdown</div>
        {!now ? (
          <div className="font-[family-name:var(--font-display)] text-2xl mt-1 text-[var(--color-navy-800)]">
            Loading…
          </div>
        ) : gone ? (
          <div className="font-[family-name:var(--font-display)] text-2xl mt-1 text-[var(--color-navy-800)]">
            You're on the trip.
          </div>
        ) : (
          <div className="flex items-baseline gap-3 mt-1 flex-wrap">
            <Unit value={days} label="days" large />
            <Unit value={hours} label="hrs" />
            <Unit value={minutes} label="min" />
            <Unit value={seconds} label="sec" />
          </div>
        )}
      </div>
    </div>
  );
}

function Unit({
  value,
  label,
  large,
}: {
  value: number;
  label: string;
  large?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1">
      <span
        className={`font-[family-name:var(--font-display)] text-[var(--color-navy-800)] tabular-nums ${
          large ? "text-3xl" : "text-xl"
        }`}
      >
        {value}
      </span>
      <span className="text-xs text-[var(--color-muted)] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
