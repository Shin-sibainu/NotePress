/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NotionSetupStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
}

export default function NotionSetupStep({
  onNext,
  onUpdateData,
}: NotionSetupStepProps) {
  const [notionUrl, setNotionUrl] = useState("");

  const extractPageId = (url: string) => {
    // Notionの様々なURL形式に対応
    const patterns = [
      /notion\.so\/[^/]+\/([a-zA-Z0-9-]+)/, // サブページ形式
      /notion\.so\/([a-zA-Z0-9-]+)/, // ルートページ形式
      /([a-zA-Z0-9-]{32})/, // ページIDのみ
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNotionUrl(url);

    const pageId = extractPageId(url);
    if (pageId) {
      onUpdateData({ pageId });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Notionの連携</h1>
        <p className="text-lg text-muted-foreground">
          NotionデータベースのURLを丸ごと貼り付けてください
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium mb-2 block">
              NotionデータベースのURL
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="https://notion.so/your-database"
                className="h-12 text-lg"
                value={notionUrl}
                onChange={handleInputChange}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                asChild
              >
                <Link
                  href="https://minimalist-three.vercel.app/post/how-to-get-notion-page-id"
                  target="_blank"
                >
                  <HelpCircle className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center"
            asChild
          >
            <Link
              href="https://www.notion.so/Notion-Blog-Sample-14e1dcf229c28018bcbbe57ab6e92e8c?pvs=4"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
              こちらからNotionデータベースをコピー
            </Link>
          </Button>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50/10 p-4 space-y-3 backdrop-blur-sm">
          <h4 className="font-medium flex items-center gap-2 text-foreground">
            <span className="text-amber-500">⚠️</span>
            重要：Notionの公開設定
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              上記データベースをコピーした後、以下の手順で公開設定を行ってください：
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>Notionデータベースの右上の「共有」をクリック</li>
              <li>「Web公開」を選択</li>
              <li>「公開」を選択</li>
            </ol>
            <p className="text-xs mt-2 text-amber-500/80 font-medium">
              ※ この設定がないと、NotionCMSがデータベースにアクセスできません
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
