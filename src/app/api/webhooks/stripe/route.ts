import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { generateAppealLetter, GENERATION_PROMPT_VERSION } from "@/lib/ai/generate";
import { logEvent, markPaid, saveLetter } from "@/lib/cases";
import { db, schema } from "@/lib/db";
import { confirmedDetailsSchema } from "@/lib/extraction-schema";
import { stripe } from "@/lib/stripe";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const caseId = session.metadata?.caseId;
    if (caseId) {
      await db()
        .insert(schema.payments)
        .values({
          caseId,
          stripeId: session.id,
          amountCents: session.amount_total ?? 0,
          type: "one_off",
          status: session.payment_status ?? "paid",
        })
        .onConflictDoNothing({ target: schema.payments.stripeId });

      await markPaid(caseId, "paid");
      await logEvent(caseId, "payment_completed", { stripeSession: session.id });

      // Regenerate at paid depth so the upgraded letter is waiting when the
      // buyer lands back on the case page.
      try {
        const [caseRow] = await db()
          .select()
          .from(schema.cases)
          .where(eq(schema.cases.id, caseId));
        const details = confirmedDetailsSchema.safeParse(caseRow?.confirmedDetails);
        if (caseRow && details.success) {
          const result = await generateAppealLetter({
            details: details.data,
            deadline: caseRow.appealDeadline,
            tier: "paid",
          });
          await saveLetter({
            caseId,
            contentMd: result.contentMd,
            model: result.model,
            promptVersion: GENERATION_PROMPT_VERSION,
            expedited: result.expedited,
          });
        }
      } catch (error) {
        // The buyer keeps their free letter and can regenerate from the UI.
        console.error("paid regeneration failed", error);
        await logEvent(caseId, "paid_regeneration_failed");
      }
    }
  }

  return NextResponse.json({ received: true });
}
