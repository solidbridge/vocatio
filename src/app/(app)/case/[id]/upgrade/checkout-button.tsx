"use client";

import { useState } from "react";

export function CheckoutButton({ caseId }: { caseId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "Checkout failed.");
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={checkout}
        disabled={loading}
        className="mt-4 w-full rounded-xl bg-blue-700 px-8 py-4 text-xl font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {loading ? "Opening secure checkout…" : "Get my Complete Package"}
      </button>
      {error && <p className="mt-2 text-red-700">{error}</p>}
    </>
  );
}
