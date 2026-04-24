"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/lib/types";

export function PackingChecklist({ trip }: { trip: Trip }) {
  const storageKey = `vocatio-packing-${trip.slug}`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setChecked(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // ignore
    }
  }, [checked, hydrated, storageKey]);

  const toggle = (id: string) =>
    setChecked((c) => ({ ...c, [id]: !c[id] }));

  const totalItems = trip.packing.reduce((n, g) => n + g.items.length, 0);
  const doneItems = Object.values(checked).filter(Boolean).length;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <span className="eyebrow">Packing</span>
          <h2 className="mt-3">What to bring.</h2>
        </div>
        <div className="text-sm text-[var(--color-muted)]">
          {doneItems} of {totalItems} packed
          <div
            className="mt-2 h-1.5 w-40 rounded-full overflow-hidden"
            style={{ background: "var(--color-cream-200)" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${totalItems ? (doneItems / totalItems) * 100 : 0}%`,
                background: "var(--color-gold-500)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {trip.packing.map((group) => (
          <div key={group.category} className="card p-6">
            <h3 className="mb-4">{group.category}</h3>
            <ul className="space-y-2">
              {group.items.map((item, idx) => {
                const id = `${group.category}:${idx}`;
                const isChecked = !!checked[id];
                return (
                  <li key={id}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggle(id)}
                        className="sr-only peer"
                      />
                      <span
                        className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
                        style={{
                          borderColor: isChecked
                            ? "var(--color-gold-500)"
                            : "var(--color-cream-300)",
                          background: isChecked
                            ? "var(--color-gold-500)"
                            : "transparent",
                        }}
                      >
                        {isChecked && (
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                      <span
                        className={`text-sm leading-snug transition-colors ${
                          isChecked
                            ? "line-through text-[var(--color-muted)]"
                            : "text-[var(--color-ink)]"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-xs text-[var(--color-muted)] mt-8">
        Your progress is saved on this device. Share the link and each person on the trip gets their own list.
      </p>
    </div>
  );
}
