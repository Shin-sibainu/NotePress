import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    const { templateId, price, pageId, blogUrl } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `NotePressテンプレート: ${templateId}`,
              description: "NotePressのテンプレートライセンス（永続利用可能）",
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/setup/complete?session_id={CHECKOUT_SESSION_ID}&page_id=${pageId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/setup`,
      metadata: {
        pageId,
        templateId,
        blogUrl,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
