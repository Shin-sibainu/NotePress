import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // まず、ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // ユーザーが存在しない場合は作成
      await prisma.user.create({
        data: {
          clerkId: userId,
        },
      });
    }

    const { url, notionPageId, theme } = await req.json();

    // 既存のブログを検索
    const existingBlog = await prisma.blog.findFirst({
      where: { userId: user?.id || userId },
    });

    let blog;

    if (existingBlog) {
      blog = await prisma.blog.update({
        where: { id: existingBlog.id },
        data: {
          url,
          notionPageId,
          theme,
          isPublished: false,
        },
      });
    } else {
      // トランザクションを使用してブログ作成と購入履歴を同時に作成
      blog = await prisma.$transaction(async (tx) => {
        const createdBlog = await tx.blog.create({
          data: {
            url,
            notionPageId,
            theme,
            userId: user?.id || userId,
            isPublished: false,
          },
        });

        // 購入履歴を作成
        await tx.purchase.create({
          data: {
            userId: user?.id || userId,
            templateId: theme,
            amount: 0,
            stripePaymentId: `free_${Date.now()}`,
          },
        });

        return createdBlog;
      });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Blog creation error:", error);
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        {
          error: "ユーザー情報の同期に失敗しました。もう一度お試しください。",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
