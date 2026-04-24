"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import type {
  IntakePayload,
  TripPurpose,
  TravelStyle,
  TravelPace,
  Destination,
} from "@/lib/types";

const PURPOSES: { value: TripPurpose; label: string; hint: string }[] = [
  { value: "pilgrimage", label: "Pilgrimage", hint: "Shrines, Mass, reflection" },
  { value: "business", label: "Business", hint: "Meetings, incentive, retreat" },
  { value: "pleasure", label: "Pleasure", hint: "Family or couple's trip" },
  { value: "mixed", label: "Mixed", hint: "Bleisure or family + faith" },
  { value: "education", label: "Education", hint: "School or study program" },
  { value: "retreat", label: "Retreat", hint: "Men's, women's, ministry" },
  { value: "other", label: "Other", hint: "Tell us in a sentence" },
];

const STYLES: { value: TravelStyle; label: string }[] = [
  { value: "luxury", label: "Luxury" },
  { value: "premium", label: "Premium" },
  { value: "comfort", label: "Comfort" },
  { value: "value", label: "Value" },
];

const PACES: { value: TravelPace; label: string; hint: string }[] = [
  { value: "packed", label: "Packed", hint: "See as much as possible" },
  { value: "balanced", label: "Balanced", hint: "Some structure, some slack" },
  { value: "slow", label: "Slow", hint: "Linger, wander, rest" },
];

const SUGGESTED_CHIPS: Record<string, string[]> = {
  Rome: ["Vatican Museums", "Papal Audience", "Colosseum", "Trattoria night"],
  Florence: ["Uffizi Gallery", "Duomo climb", "Tuscan hill towns"],
  Assisi: ["Basilica of St. Francis", "Carceri hermitage", "Porziuncola"],
  Lourdes: ["Torchlight procession", "Baths", "Grotto Mass"],
  Paris: ["Notre-Dame", "Sacré-Cœur", "Louvre", "Seine dinner"],
  Jerusalem: ["Via Dolorosa", "Holy Sepulchre", "Mount of Olives"],
  Fatima: ["Capelinha candle procession", "Valinhos", "Rosary at the sanctuary"],
};

const DEFAULT_DESTINATION: Destination = {
  city: "",
  country: "",
  nights: 3,
};

type Step = number;
const TOTAL_STEPS = 5;

export function IntakeForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);

  const [payload, setPayload] = useState<IntakePayload>({
    purpose: "pilgrimage",
    adults: 2,
    children: 0,
    destinations: [{ ...DEFAULT_DESTINATION }],
    style: "premium",
    pace: "balanced",
    mustHaves: [],
    contact: { name: "", email: "" },
  });

  const update = <K extends keyof IntakePayload>(
    key: K,
    value: IntakePayload[K],
  ) => setPayload((p) => ({ ...p, [key]: value }));

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const addDestination = () =>
    update("destinations", [...payload.destinations, { ...DEFAULT_DESTINATION }]);

  const removeDestination = (idx: number) =>
    update(
      "destinations",
      payload.destinations.filter((_, i) => i !== idx),
    );

  const updateDestination = (idx: number, patch: Partial<Destination>) =>
    update(
      "destinations",
      payload.destinations.map((d, i) => (i === idx ? { ...d, ...patch } : d)),
    );

  const addMustHave = (value: string) => {
    const v = value.trim();
    if (!v || payload.mustHaves.includes(v)) return;
    update("mustHaves", [...payload.mustHaves, v]);
  };

  const removeMustHave = (value: string) =>
    update(
      "mustHaves",
      payload.mustHaves.filter((v) => v !== value),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Draft mode: simulate LLM pipeline, then navigate to the sample itinerary.
    await new Promise((r) => setTimeout(r, 1400));
    router.push("/trip/rome-florence-capri-demo");
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 md:p-10">
      <StepHeader step={step} />

      {/* STEP 0 — Purpose */}
      {step === 0 && (
        <div>
          <h3 className="mb-6">What's the purpose of this trip?</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {PURPOSES.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => update("purpose", p.value)}
                className={`text-left rounded-[12px] p-4 border transition-colors ${
                  payload.purpose === p.value
                    ? "border-[var(--color-navy-800)] bg-[var(--color-cream-100)]"
                    : "border-[var(--color-cream-300)] hover:border-[var(--color-navy-600)]"
                }`}
              >
                <div className="font-medium text-[var(--color-navy-800)]">
                  {p.label}
                </div>
                <div className="text-xs text-[var(--color-muted)] mt-1">
                  {p.hint}
                </div>
              </button>
            ))}
          </div>
          {payload.purpose === "other" && (
            <input
              className="input mt-4"
              placeholder="Tell us in a sentence"
              value={payload.purposeOther ?? ""}
              onChange={(e) => update("purposeOther", e.target.value)}
            />
          )}
        </div>
      )}

      {/* STEP 1 — Party */}
      {step === 1 && (
        <div>
          <h3 className="mb-6">Who's going?</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <Stepper
              label="Adults"
              value={payload.adults}
              min={1}
              max={80}
              onChange={(v) => update("adults", v)}
            />
            <Stepper
              label="Children"
              value={payload.children}
              min={0}
              max={40}
              onChange={(v) => update("children", v)}
            />
          </div>
          {payload.children > 0 && (
            <div className="mt-6">
              <label className="label">Ages of the children</label>
              <input
                className="input mt-2"
                placeholder="e.g., 6, 9, 14"
                value={payload.childAges ?? ""}
                onChange={(e) => update("childAges", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Dates & destinations */}
      {step === 2 && (
        <div>
          <h3 className="mb-6">When, and where?</h3>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="label">Depart</label>
              <input
                type="date"
                className="input mt-2"
                value={payload.startDate ?? ""}
                onChange={(e) => update("startDate", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Return</label>
              <input
                type="date"
                className="input mt-2"
                value={payload.endDate ?? ""}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </div>
          </div>

          <div className="label mb-3">Cities, in order</div>
          <div className="space-y-3">
            {payload.destinations.map((d, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 items-end border border-[var(--color-cream-200)] rounded-[12px] p-3"
              >
                <div className="col-span-5">
                  <label className="label">City</label>
                  <input
                    className="input mt-1"
                    placeholder="Rome"
                    value={d.city}
                    onChange={(e) =>
                      updateDestination(i, { city: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-4">
                  <label className="label">Country</label>
                  <input
                    className="input mt-1"
                    placeholder="Italy"
                    value={d.country}
                    onChange={(e) =>
                      updateDestination(i, { country: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <label className="label">Nights</label>
                  <input
                    className="input mt-1"
                    type="number"
                    min={1}
                    value={d.nights}
                    onChange={(e) =>
                      updateDestination(i, {
                        nights: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  {payload.destinations.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove city"
                      onClick={() => removeDestination(i)}
                      className="p-2 text-[var(--color-muted)] hover:text-[var(--color-navy-800)]"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addDestination}
            className="mt-4 text-sm inline-flex items-center gap-1 text-[var(--color-navy-800)] hover:text-[var(--color-gold-600)]"
          >
            <Plus size={14} /> Add another city
          </button>
        </div>
      )}

      {/* STEP 3 — Style, pace, must-haves */}
      {step === 3 && (
        <div>
          <h3 className="mb-6">How should it feel?</h3>

          <div className="label mb-2">Style</div>
          <div className="flex flex-wrap gap-2 mb-6">
            {STYLES.map((s) => (
              <button
                type="button"
                key={s.value}
                onClick={() => update("style", s.value)}
                className={`chip ${
                  payload.style === s.value
                    ? "!bg-[var(--color-navy-800)] !text-[var(--color-cream-50)]"
                    : ""
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="label mb-2">Pace</div>
          <div className="flex flex-wrap gap-2 mb-8">
            {PACES.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => update("pace", p.value)}
                className={`chip ${
                  payload.pace === p.value
                    ? "!bg-[var(--color-navy-800)] !text-[var(--color-cream-50)]"
                    : ""
                }`}
                title={p.hint}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="label mb-2">Must-have experiences</div>
          <MustHaveInput onAdd={addMustHave} />
          {/* Suggested chips seeded from destination list */}
          <div className="flex flex-wrap gap-2 mt-3">
            {payload.destinations
              .map((d) => SUGGESTED_CHIPS[d.city] ?? [])
              .flat()
              .slice(0, 10)
              .map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => addMustHave(chip)}
                  className="chip hover:!bg-[var(--color-gold-50)] hover:!border hover:!border-[var(--color-gold-200)]"
                >
                  + {chip}
                </button>
              ))}
          </div>
          {payload.mustHaves.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {payload.mustHaves.map((m) => (
                <span
                  key={m}
                  className="chip-gold chip inline-flex items-center gap-1"
                >
                  {m}
                  <button
                    type="button"
                    onClick={() => removeMustHave(m)}
                    aria-label={`Remove ${m}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-8">
            <label className="label">Dietary, accessibility, or notes</label>
            <textarea
              className="input mt-2"
              rows={3}
              placeholder="Wheelchair access, gluten-free, early Mass attendance, etc."
              value={payload.dietaryAccessibility ?? ""}
              onChange={(e) =>
                update("dietaryAccessibility", e.target.value)
              }
            />
          </div>
        </div>
      )}

      {/* STEP 4 — Contact */}
      {step === 4 && (
        <div>
          <h3 className="mb-6">Where should we send the draft?</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="label">Your name</label>
              <input
                className="input mt-2"
                required
                value={payload.contact.name}
                onChange={(e) =>
                  update("contact", { ...payload.contact, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input mt-2"
                type="email"
                required
                value={payload.contact.email}
                onChange={(e) =>
                  update("contact", {
                    ...payload.contact,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Phone (optional — for a planner call)</label>
              <input
                className="input mt-2"
                value={payload.contact.phone ?? ""}
                onChange={(e) =>
                  update("contact", {
                    ...payload.contact,
                    phone: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-4">
            By submitting, you'll receive your draft itinerary and may be
            contacted by a Vocatio planner. No account required.
          </p>
        </div>
      )}

      {/* NAV */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0 || submitting}
          className="btn btn-ghost disabled:opacity-30"
        >
          <ArrowLeft size={14} /> Back
        </button>
        {step < TOTAL_STEPS - 1 ? (
          <button type="button" onClick={next} className="btn btn-primary">
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-gold disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Drafting your trip…
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate my itinerary
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

function StepHeader({ step }: { step: Step }) {
  const labels = ["Purpose", "Party", "Dates & cities", "Style", "Contact"];
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {labels.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-colors ${
              i <= step
                ? "bg-[var(--color-gold-500)]"
                : "bg-[var(--color-cream-200)]"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
        <span>
          Step {step + 1} of {TOTAL_STEPS}
        </span>
        <span>{labels[step]}</span>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="label mb-2">{label}</div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-10 h-10 rounded-full border border-[var(--color-cream-300)] hover:border-[var(--color-navy-800)] flex items-center justify-center"
          aria-label={`Decrease ${label}`}
        >
          <Minus size={14} />
        </button>
        <div className="font-[family-name:var(--font-display)] text-3xl min-w-[3ch] text-center">
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-10 h-10 rounded-full border border-[var(--color-cream-300)] hover:border-[var(--color-navy-800)] flex items-center justify-center"
          aria-label={`Increase ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function MustHaveInput({ onAdd }: { onAdd: (v: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input
        className="input"
        placeholder="e.g., Papal Audience, a Tuscan cooking class…"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(val);
            setVal("");
          }
        }}
      />
      <button
        type="button"
        onClick={() => {
          onAdd(val);
          setVal("");
        }}
        className="btn btn-ghost"
      >
        Add
      </button>
    </div>
  );
}
