import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { url: string };
}) {
  const blogUrl = searchParams.url;

  return (
    <div className="container max-w-4xl py-12">
      <Card className="p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">ブログの構築が完了しました！</h1>
          <p className="text-lg text-muted-foreground">
            以下のURLからブログにアクセスできます
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between gap-4">
            <p className="text-lg font-mono break-all">{blogUrl}</p>
            <Button asChild>
              <Link href={blogUrl} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                ブログを開く
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">次のステップ：</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Notionデータベースに記事を追加</li>
            <li>記事のプロパティを適切に設定（Public, Slug など）</li>
            <li>記事の内容を執筆</li>
          </ul>
        </div>
      </Card>
    </div>
  );
} 