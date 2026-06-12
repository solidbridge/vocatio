"use client";

import { useState } from "react";

export function FaxForm({ caseId }: { caseId: string }) {
  const [faxNumber, setFaxNumber] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage(null);
    try {
      const res = await fetch("/api/fax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, toNumber: faxNumber.replace(/[^\d+]/g, "") }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Fax failed.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={send} className="mt-8 rounded-xl border border-slate-200 p-5">
      <h2 className="text-xl font-bold">We&apos;ll fax it for you</h2>
      <p className="mt-2 text-lg text-slate-600">
        Enter the appeals fax number printed on your denial notice.
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="tel"
          required
          placeholder="e.g. 800 555 0123"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-3 text-lg"
          value={faxNumber}
          onChange={(e) => setFaxNumber(e.target.value)}
        />
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send fax"}
        </button>
      </div>
      {message && <p className="mt-2 text-red-700">{message}</p>}
      {status === "sent" && (
        <p className="mt-2 text-green-800">
          Fax queued. Keep a copy of your letter and note today&apos;s date.
        </p>
      )}
    </form>
  );
}
