"use client";

import { Suspense, useEffect } from "react";
import BlogStatus from "@/components/dashboard/BlogStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WritingGuide } from "@/components/dashboard/WritingGuide";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

// interface Project {
//   id: string;
//   url: string;
//   userId: string;
//   createdAt: Date;
//   // その他の必要な情報
// }

// async function getProjectData() {
//   // 例：Prismaを使用する場合
//   // const project = await prisma.project.findFirst({
//   //   where: { userId: session.user.id },
//   //   orderBy: { createdAt: 'desc' }
//   // });

//   // return project;

//   // 一時的なモックデータ
//   return {
//     url: "https://example.vercel.app",
//     createdAt: new Date(),
//   };
// }

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentCompleted = searchParams.get("payment_completed") === "true";

  useEffect(() => {
    if (paymentCompleted) {
      const templateId = searchParams.get("template");
      const pageId = searchParams.get("page_id");
      const blogId = searchParams.get("blog_id");
      const blogUrl = searchParams.get("blog_url");

      // 既に表示済みかチェック
      const paymentNotificationShown =
        localStorage.getItem("payment_notification_shown") === "true";

      if (!paymentNotificationShown) {
        toast({
          title: "決済が完了しました",
          description: "ブログの構築を開始できます",
        });

        // 表示済みとしてマーク
        localStorage.setItem("payment_notification_shown", "true");
      }

      // 決済完了情報をローカルストレージに保存
      localStorage.setItem(
        "setupInfo",
        JSON.stringify({
          templateId,
          pageId,
          blogUrl,
          blogId,
        })
      );

      // URLパラメータをクリア（リロード時に再実行されないように）
      if (paymentCompleted) {
        // クエリパラメータなしのURLに置き換え
        router.replace("/dashboard");
      }
    }
  }, [paymentCompleted, router]);

  // const projectData = await getProjectData();

  return (
    <Suspense>
      <BlogStatus />

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
      <div className="flex flex-col gap-4">
        <WritingGuide />
        <QuickActions />
      </div>

      <RecentPosts />
    </Suspense>
  );
}
