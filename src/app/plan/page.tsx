import { IntakeForm } from "@/components/IntakeForm";

export const metadata = {
  title: "Plan your journey — Vocatio",
};

export default function PlanPage() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-v max-w-3xl">
        <div className="mb-10 text-center">
          <span className="eyebrow">Plan your journey</span>
          <h1 className="mt-3 mb-4">
            Tell us about the trip.
            <br />
            <span className="italic text-[var(--color-gold-600)]">
              We'll draft the rest.
            </span>
          </h1>
          <p className="text-[var(--color-muted)] max-w-xl mx-auto">
            Ninety seconds on your phone. You'll have a personalized, shareable
            itinerary draft — and a planner in the loop — before you've finished
            your coffee.
          </p>
        </div>

        <IntakeForm />
      </div>
    </section>
  );
}
