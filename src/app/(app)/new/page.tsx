"use client";

import Link from "next/link";
import { useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types mirroring the server's extraction / confirmation schemas       */
/* ------------------------------------------------------------------ */

interface ExtractedField<T> {
  value: T | null;
  confidence: "high" | "medium" | "low";
}

interface Extraction {
  payer_name: ExtractedField<string>;
  plan_name: ExtractedField<string>;
  member_id_last4: ExtractedField<string>;
  patient_name: ExtractedField<string>;
  denial_date: ExtractedField<string>;
  notice_date: ExtractedField<string>;
  service_denied: ExtractedField<string>;
  denial_reason_verbatim: ExtractedField<string>;
  clinical_criteria_cited: ExtractedField<string[]>;
  is_pre_service: ExtractedField<boolean>;
  appeal_instructions_in_letter: ExtractedField<string>;
  is_mental_health: ExtractedField<boolean>;
}

interface FormState {
  payerName: string;
  planName: string;
  memberIdLast4: string;
  patientName: string;
  denialDate: string;
  noticeDate: string;
  serviceDenied: string;
  denialReasonVerbatim: string;
  clinicalCriteriaCited: string;
  isPreService: boolean;
  isMentalHealth: boolean;
  userAttestsSeriousHarm: boolean;
  patientContext: string;
}

type Step = "upload" | "extracting" | "review" | "generating" | "letter";

function fromExtraction(e: Extraction): FormState {
  return {
    payerName: e.payer_name.value ?? "",
    planName: e.plan_name.value ?? "",
    memberIdLast4: e.member_id_last4.value ?? "",
    patientName: e.patient_name.value ?? "",
    denialDate: e.denial_date.value ?? "",
    noticeDate: e.notice_date.value ?? "",
    serviceDenied: e.service_denied.value ?? "",
    denialReasonVerbatim: e.denial_reason_verbatim.value ?? "",
    clinicalCriteriaCited: (e.clinical_criteria_cited.value ?? []).join("\n"),
    isPreService: e.is_pre_service.value ?? true,
    isMentalHealth: e.is_mental_health.value ?? false,
    userAttestsSeriousHarm: false,
    patientContext: "",
  };
}

const lowConfidence = (f: ExtractedField<unknown>) =>
  f.confidence === "low" || f.value === null;

/* ------------------------------------------------------------------ */

export default function NewAppealPage() {
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState<string | null>(null);
  const [caseId, setCaseId] = useState<string | null>(null);
  const [extraction, setExtraction] = useState<Extraction | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [letter, setLetter] = useState("");
  const [deadline, setDeadline] = useState<string | null>(null);
  const [deadlineEstimated, setDeadlineEstimated] = useState(false);
  const [expedited, setExpedited] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setStep("extracting");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");
      setCaseId(json.caseId);
      setExtraction(json.extraction);
      setForm(fromExtraction(json.extraction));
      setStep("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("upload");
    }
  }

  async function handleGenerate() {
    if (!caseId || !form) return;
    setError(null);
    if (!form.payerName.trim() || !form.serviceDenied.trim()) {
      setError("Please fill in the insurance company and the denied service.");
      return;
    }
    setStep("generating");
    setLetter("");
    try {
      const details = {
        payerName: form.payerName.trim(),
        planName: form.planName.trim() || null,
        memberIdLast4: form.memberIdLast4.trim() || null,
        patientName: form.patientName.trim() || null,
        denialDate: form.denialDate || null,
        noticeDate: form.noticeDate || null,
        serviceDenied: form.serviceDenied.trim(),
        denialReasonVerbatim: form.denialReasonVerbatim.trim() || null,
        clinicalCriteriaCited: form.clinicalCriteriaCited
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        isPreService: form.isPreService,
        isMentalHealth: form.isMentalHealth,
        userAttestsSeriousHarm: form.userAttestsSeriousHarm,
        patientContext: form.patientContext.trim() || null,
      };
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, details }),
      });
      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Generation failed.");
      }
      setDeadline(res.headers.get("X-Deadline") || null);
      setDeadlineEstimated(res.headers.get("X-Deadline-Estimated") === "1");
      setExpedited(res.headers.get("X-Expedited") === "1");
      setStep("letter");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setLetter(text);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("review");
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6">
      <header className="py-6">
        <Link href="/" className="text-blue-700 underline">
          ← MA Appeal Helper
        </Link>
      </header>

      {error && (
        <div role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-lg text-red-800">
          {error}
        </div>
      )}

      {step === "upload" && (
        <section className="text-center">
          <h1 className="text-3xl font-bold">Upload your denial letter</h1>
          <p className="mt-3 text-lg text-slate-600">
            A photo from your phone works fine. Include every page if you can.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf,image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />
          <button
            onClick={() => fileInput.current?.click()}
            className="mt-8 rounded-xl bg-blue-700 px-8 py-4 text-xl font-semibold text-white hover:bg-blue-800"
          >
            Take a photo or choose a file
          </button>
          <p className="mt-4 text-base text-slate-500">
            PDF, JPG, or PNG · 15 MB max · Deleted automatically after 30 days
          </p>
        </section>
      )}

      {step === "extracting" && (
        <section className="py-16 text-center" aria-live="polite">
          <h1 className="text-2xl font-bold">Reading your letter…</h1>
          <p className="mt-3 text-lg text-slate-600">
            We&apos;re finding the denial reason, dates, and the criteria your plan
            cited. This takes about 30 seconds.
          </p>
          <div className="mx-auto mt-8 h-3 w-64 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-700" />
          </div>
        </section>
      )}

      {step === "review" && form && extraction && (
        <ReviewForm
          form={form}
          extraction={extraction}
          onChange={setForm}
          onSubmit={handleGenerate}
        />
      )}

      {(step === "generating" || step === "letter") && (
        <LetterView
          letter={letter}
          streaming={step === "generating" || letter.length === 0}
          caseId={caseId}
          deadline={deadline}
          deadlineEstimated={deadlineEstimated}
          expedited={expedited}
          emailUnlocked={emailUnlocked}
          onUnlock={() => setEmailUnlocked(true)}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  label,
  flagged,
  children,
}: {
  label: string;
  flagged?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-semibold">
        {label}
        {flagged && (
          <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-sm font-normal text-amber-800">
            please check
          </span>
        )}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-lg focus:border-blue-700 focus:outline-none";

function ReviewForm({
  form,
  extraction,
  onChange,
  onSubmit,
}: {
  form: FormState;
  extraction: Extraction;
  onChange: (f: FormState) => void;
  onSubmit: () => void;
}) {
  const set = (patch: Partial<FormState>) => onChange({ ...form, ...patch });

  return (
    <section>
      <h1 className="text-3xl font-bold">Check what we found</h1>
      <p className="mt-3 text-lg text-slate-600">
        Your letter is only as good as these details. Fix anything we got wrong —
        especially the highlighted fields.
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Insurance company" flagged={lowConfidence(extraction.payer_name)}>
            <input
              className={inputClass}
              value={form.payerName}
              onChange={(e) => set({ payerName: e.target.value })}
              required
            />
          </Field>
          <Field label="Plan name" flagged={lowConfidence(extraction.plan_name)}>
            <input
              className={inputClass}
              value={form.planName}
              onChange={(e) => set({ planName: e.target.value })}
            />
          </Field>
          <Field label="Patient name" flagged={lowConfidence(extraction.patient_name)}>
            <input
              className={inputClass}
              value={form.patientName}
              onChange={(e) => set({ patientName: e.target.value })}
            />
          </Field>
          <Field
            label="Member ID (last 4 only)"
            flagged={lowConfidence(extraction.member_id_last4)}
          >
            <input
              className={inputClass}
              maxLength={4}
              value={form.memberIdLast4}
              onChange={(e) => set({ memberIdLast4: e.target.value })}
            />
          </Field>
          <Field label="Date on the notice" flagged={lowConfidence(extraction.notice_date)}>
            <input
              type="date"
              className={inputClass}
              value={form.noticeDate}
              onChange={(e) => set({ noticeDate: e.target.value })}
            />
          </Field>
          <Field label="Denial date" flagged={lowConfidence(extraction.denial_date)}>
            <input
              type="date"
              className={inputClass}
              value={form.denialDate}
              onChange={(e) => set({ denialDate: e.target.value })}
            />
          </Field>
        </div>

        <Field
          label="What service was denied?"
          flagged={lowConfidence(extraction.service_denied)}
        >
          <input
            className={inputClass}
            value={form.serviceDenied}
            onChange={(e) => set({ serviceDenied: e.target.value })}
            required
          />
        </Field>

        <Field
          label="Denial reason (as printed on the letter)"
          flagged={lowConfidence(extraction.denial_reason_verbatim)}
        >
          <textarea
            className={inputClass}
            rows={3}
            value={form.denialReasonVerbatim}
            onChange={(e) => set({ denialReasonVerbatim: e.target.value })}
          />
        </Field>

        <Field
          label="Clinical criteria the plan cited (one per line)"
          flagged={lowConfidence(extraction.clinical_criteria_cited)}
        >
          <textarea
            className={inputClass}
            rows={3}
            value={form.clinicalCriteriaCited}
            onChange={(e) => set({ clinicalCriteriaCited: e.target.value })}
          />
        </Field>

        <Field label="Anything else the reviewer should know? (optional)">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Example: My mother has fallen twice this month. Her doctor says she needs this to live safely at home."
            value={form.patientContext}
            onChange={(e) => set({ patientContext: e.target.value })}
          />
        </Field>

        <fieldset className="space-y-4 rounded-xl border border-slate-200 p-5">
          <legend className="px-2 font-semibold">A few yes/no questions</legend>
          <label className="flex items-start gap-3 text-lg">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={form.isPreService}
              onChange={(e) => set({ isPreService: e.target.checked })}
            />
            The denied care has <strong>not happened yet</strong> (the plan refused
            to approve it in advance).
          </label>
          <label className="flex items-start gap-3 text-lg">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={form.isMentalHealth}
              onChange={(e) => set({ isMentalHealth: e.target.checked })}
            />
            This involves mental health, therapy, or substance-use treatment.
          </label>
          <label className="flex items-start gap-3 text-lg">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5"
              checked={form.userAttestsSeriousHarm}
              onChange={(e) => set({ userAttestsSeriousHarm: e.target.checked })}
            />
            Waiting up to 30 days for a decision could <strong>seriously harm</strong>{" "}
            the patient&apos;s life, health, or recovery.
          </label>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-700 px-8 py-4 text-xl font-semibold text-white hover:bg-blue-800"
        >
          Generate my appeal letter
        </button>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function LetterView({
  letter,
  streaming,
  caseId,
  deadline,
  deadlineEstimated,
  expedited,
  emailUnlocked,
  onUnlock,
}: {
  letter: string;
  streaming: boolean;
  caseId: string | null;
  deadline: string | null;
  deadlineEstimated: boolean;
  expedited: boolean;
  emailUnlocked: boolean;
  onUnlock: () => void;
}) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const locked = !emailUnlocked && !streaming;

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!caseId) return;
    setSubmitting(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not save email.");
      onUnlock();
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section aria-live="polite">
      <h1 className="text-3xl font-bold">
        {streaming ? "Writing your appeal letter…" : "Your appeal letter"}
      </h1>

      {deadline && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-lg text-amber-900">
          <strong>Filing deadline: {deadline}</strong>
          {deadlineEstimated && " (estimated — we couldn't read the notice date)"}
          {". "}
          Appeals must reach your plan by this date.
        </div>
      )}
      {expedited && (
        <div className="mt-3 rounded-xl bg-blue-50 p-4 text-lg text-blue-900">
          Based on your answers, you may qualify for an <strong>expedited
          (72-hour) appeal</strong>. Call your plan today, say the word
          &ldquo;expedited,&rdquo; and send this letter by fax. Ask the doctor to
          call too — their support makes fast review mandatory.
        </div>
      )}

      <div className="relative mt-6">
        <pre
          className={`whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-6 font-serif text-lg leading-relaxed ${
            locked ? "max-h-72 select-none overflow-hidden blur-[3px]" : ""
          }`}
        >
          {letter || " "}
        </pre>

        {locked && (
          <div className="absolute inset-0 flex items-end justify-center rounded-xl bg-gradient-to-t from-white via-white/80 to-transparent p-6">
            <form onSubmit={submitEmail} className="w-full max-w-md text-center">
              <p className="text-lg font-semibold">
                Your letter is ready. Where should we send your copy?
              </p>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-3 text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="mt-2 text-red-700">{emailError}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="mt-3 w-full rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {submitting ? "One moment…" : "Show my full letter"}
              </button>
              <p className="mt-2 text-sm text-slate-500">
                We&apos;ll email a link to this letter and your deadline. No spam.
              </p>
            </form>
          </div>
        )}
      </div>

      {!locked && !streaming && caseId && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button
            onClick={() => {
              void navigator.clipboard.writeText(letter);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="rounded-xl border border-blue-700 px-6 py-3 text-lg font-semibold text-blue-700 hover:bg-blue-50"
          >
            {copied ? "Copied!" : "Copy letter"}
          </button>
          <a
            href={`/api/pdf/${caseId}`}
            className="flex items-center justify-center rounded-xl border border-blue-700 px-6 py-3 text-lg font-semibold text-blue-700 hover:bg-blue-50"
          >
            Download PDF
          </a>
          <Link
            href={`/case/${caseId}/upgrade`}
            className="flex items-center justify-center rounded-xl bg-blue-700 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-800"
          >
            Upgrade — $39
          </Link>
        </div>
      )}

      {!locked && !streaming && (
        <div className="mt-8 rounded-xl border border-slate-200 p-5 text-lg text-slate-700">
          <h2 className="font-bold">Before you send it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Fill in anything in [BRACKETS] — those need your details.</li>
            <li>Attach a copy of the denial notice and any doctor&apos;s notes.</li>
            <li>Send to the appeals address or fax printed on your denial notice.</li>
            <li>Keep a copy and note the date you sent it.</li>
          </ul>
        </div>
      )}
    </section>
  );
}
