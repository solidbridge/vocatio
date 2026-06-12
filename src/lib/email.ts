import { Resend } from "resend";

let _resend: Resend | null = null;

function resend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set — see .env.example");
  }
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "Appeals <appeals@example.com>";

export async function sendLetterReadyEmail(params: {
  to: string;
  caseUrl: string;
  deadline: string | null;
}) {
  await resend().emails.send({
    from: FROM,
    to: params.to,
    subject: "Your Medicare Advantage appeal letter is ready",
    text: [
      "Your appeal letter is ready to review, edit, and download:",
      params.caseUrl,
      "",
      params.deadline
        ? `Reminder: your filing deadline is ${params.deadline}. Don't wait — appeals filed early get resolved sooner.`
        : "Reminder: Medicare Advantage appeals must be filed within 65 days of your denial notice.",
      "",
      "This tool helps you advocate for yourself. It does not provide legal advice.",
    ].join("\n"),
  });
}

export async function sendDeadlineReminderEmail(params: {
  to: string;
  caseUrl: string;
  deadline: string;
  daysLeft: number;
}) {
  await resend().emails.send({
    from: FROM,
    to: params.to,
    subject: `${params.daysLeft} days left to file your Medicare appeal`,
    text: [
      `Your Medicare Advantage appeal filing deadline is ${params.deadline} — ${params.daysLeft} days away.`,
      "",
      "Pick up where you left off:",
      params.caseUrl,
    ].join("\n"),
  });
}
