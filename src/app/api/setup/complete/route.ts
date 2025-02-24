import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    const pageId = searchParams.get("page_id");

    if (!sessionId || !pageId || !userId) {
      return NextResponse.redirect(new URL("/setup", request.url));
    }

    // セッションの検証
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.redirect(new URL("/setup", request.url));
    }

    // メタデータから必要な情報を取得
    const { templateId, blogUrl } = session.metadata || {};

    // ユーザーのClerkIDからDBのユーザーIDを取得
    const user = await prisma.user.findFirstOrThrow({
      where: { clerkId: userId },
    });

    // 購入履歴を保存
    await prisma.purchase.create({
      data: {
        userId: user.id,
        templateId: templateId || "",
        amount: session.amount_total || 0,
        stripePaymentId: sessionId,
      },
    });

    // 新しいブログを作成
    const blog = await prisma.blog.create({
      data: {
        userId: user.id,
        url: blogUrl || "",
        notionPageId: pageId,
        theme: templateId || "",
      },
    });

    // 決済完了後のダッシュボードにリダイレクト
    return NextResponse.redirect(
      new URL(
        `/dashboard?payment_completed=true&blog_id=${blog.id}`,
        request.url
      )
    );
  } catch (error) {
    console.error("Setup complete error:", error);
    return NextResponse.redirect(new URL("/setup?error=true", request.url));
  }
}
