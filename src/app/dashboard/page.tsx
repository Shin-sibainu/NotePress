import { Suspense } from 'react';
import { BlogStatus } from "@/components/dashboard/BlogStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WritingGuide } from "@/components/dashboard/WritingGuide";
import { RecentPosts } from "@/components/dashboard/RecentPosts";

interface DashboardPageProps {
  searchParams: { url?: string };
}

async function getProjectData(url?: string) {
  if (url) {
    return { url };
  }
  return null;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const projectData = await getProjectData(searchParams.url);

  return (
    <Suspense>
      <BlogStatus url={projectData?.url} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <WritingGuide />
      </div>
      
      <RecentPosts />
    </Suspense>
  );
}
