import { Suspense } from "react";
import BlogStatus from "@/components/dashboard/BlogStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WritingGuide } from "@/components/dashboard/WritingGuide";
import { RecentPosts } from "@/components/dashboard/RecentPosts";

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

export default async function DashboardPage() {
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
