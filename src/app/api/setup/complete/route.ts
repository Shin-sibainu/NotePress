import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// このルートを動的にレンダリングするように設定
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const pageId = searchParams.get("page_id");

    if (!sessionId || !pageId) {
      console.error("Missing params:", { sessionId, pageId });
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/setup?error=missing_params`
      );
    }

    const { userId } = await auth();
    if (!userId) {
      console.error("No userId found");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sign-in`
      );
    }

    // Stripeセッションの取得
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      console.error("Payment not completed:", session.payment_status);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/setup?error=payment_failed`
      );
    }

    // メタデータからテンプレートIDとブログURLを取得
    const templateId = session.metadata?.templateId;
    const blogUrl = session.metadata?.blogUrl;

    if (!templateId || !blogUrl) {
      console.error("Missing metadata:", { templateId, blogUrl });
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/setup?error=missing_metadata`
      );
    }

    // ユーザーの取得または作成
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        name: session.customer_details?.name || undefined,
        email: session.customer_details?.email || undefined,
      },
    });

    // 購入履歴の記録
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        templateId,
        amount: session.amount_total || 0,
        stripePaymentId: session.id,
      },
    });

    // ブログの作成
    const blogData = {
      url: blogUrl,
      notionPageId: pageId,
      theme: templateId,
      userId: user.id,
    };

    const blog = await prisma.blog.create({
      data: blogData,
    });

    // ブログ情報をクエリパラメータとして渡す
    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`
    );
    redirectUrl.searchParams.set("payment_completed", "true");
    redirectUrl.searchParams.set("blog_id", blog.id);
    redirectUrl.searchParams.set("blog_url", blog.url);
    redirectUrl.searchParams.set("page_id", blog.notionPageId);
    redirectUrl.searchParams.set("theme", blog.theme);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Setup completion error:", error);
    console.error("Blog creation error details:", error);

    // エラーの詳細をクエリパラメータに含める
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.redirect(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/setup?error=server_error&details=${encodeURIComponent(errorMessage)}`
    );
  }
}
