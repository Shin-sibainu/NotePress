import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma'
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, notionPageId, theme } = await req.json();

    // ブログの作成
    const blog = await prisma.blog.create({
      data: {
        url,
        notionPageId,
        theme,
        userId,
        isPublished: false,
      },
    });

    // 購入履歴の作成（無料テンプレートの場合）
    await prisma.purchase.create({
      data: {
        userId,
        templateId: theme,
        amount: 0, // 無料テンプレート
        stripePaymentId: `free_${Date.now()}`, // 無料テンプレート用の一意のID
      },
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
