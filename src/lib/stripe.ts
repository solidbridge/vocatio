import Stripe from "stripe";

export const APPEAL_PACKAGE_PRICE_CENTS = 3900;

let _stripe: Stripe | null = null;

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set — see .env.example");
  }
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

export async function createAppealCheckout(params: {
  caseId: string;
  email: string | null;
  origin: string;
}) {
  return stripe().checkout.sessions.create({
    mode: "payment",
    customer_email: params.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: APPEAL_PACKAGE_PRICE_CENTS,
          product_data: {
            name: "Complete Appeal Package",
            description:
              "Citation-rich reconsideration letter, payer filing instructions, PDF download, and deadline reminders.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { caseId: params.caseId },
    success_url: `${params.origin}/case/${params.caseId}?upgraded=1`,
    cancel_url: `${params.origin}/case/${params.caseId}/upgrade?canceled=1`,
  });
}
