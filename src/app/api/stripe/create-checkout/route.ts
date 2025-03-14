import { NextResponse } from "next/server";
import Stripe from "stripe";
import { templates } from "@/data/templates";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(request: Request) {
  try {
    console.log("Stripe checkout API called");
    const { templateId, price, pageId, blogUrl } = await request.json();
    console.log("Request data:", { templateId, price, pageId, blogUrl });

    // テンプレート情報を取得
    const template = templates.find((t) => t.id === templateId);
    console.log("Template found:", template);

    if (!template) {
      console.error("Template not found:", templateId);
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // 無料テンプレートの場合は直接成功URLにリダイレクト
    if (template.price === 0) {
      console.log("Free template, redirecting");
      return NextResponse.json({
        free: true,
        redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/setup/complete?free=true&page_id=${pageId}&templateId=${templateId}&blogUrl=${blogUrl}`,
      });
    }

    // 有料テンプレートの場合はStripeのチェックアウトセッションを作成
    if (!template.stripePriceId) {
      console.error("No price ID configured for template:", templateId);
      return NextResponse.json(
        { error: "Price ID not configured for this template" },
        { status: 400 }
      );
    }

    console.log("Using price ID:", template.stripePriceId);
    console.log("Stripe API Key available:", !!process.env.STRIPE_SECRET_KEY);

    // テンプレートから取得した商品IDを使用
    const priceId = template.stripePriceId;
    console.log("Using template price ID:", priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          // 固定のprice_idを使用
          price: priceId, // template.stripePriceIdの代わりに直接IDを使用
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

    console.log("Stripe session created:", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe API error:", error);
    // エラーの詳細情報を返す
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error details:", errorMessage, errorStack);

    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
