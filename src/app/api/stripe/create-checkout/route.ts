import { NextResponse } from "next/server";
import Stripe from "stripe";
import { templates } from "@/data/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    const { templateId, price, pageId, blogUrl } = await request.json();

    // テンプレート情報を取得
    const template = templates.find((t) => t.id === templateId);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 無料テンプレートの場合は直接成功URLにリダイレクト
    if (template.price === 0) {
      return NextResponse.json({
        free: true,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/setup/complete?free=true&page_id=${pageId}&templateId=${templateId}&blogUrl=${blogUrl}`,
      });
    }

    // 有料テンプレートの場合はStripeのチェックアウトセッションを作成
    if (!template.stripePriceId) {
      return NextResponse.json(
        { error: "Price ID not configured for this template" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // 固定のprice_idを使用
          price: template.stripePriceId,
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
