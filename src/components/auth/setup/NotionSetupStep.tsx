/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";

interface NotionSetupStepProps {
  onNext: () => void;
  onUpdateData: (data: any) => void;
}

export default function NotionSetupStep({
  onNext,
  onUpdateData,
}: NotionSetupStepProps) {
  const [pageId, setPageId] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageId(value);
    onUpdateData({ pageId: value });
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
          NotionデータベースのページIDを入力してください
        </p>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-base font-medium mb-2 block">
              NotionデータベースのページID
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="h-12 text-lg font-mono"
                value={pageId}
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
            <p className="text-sm text-muted-foreground">
              ページIDはNotionのURLから取得できます：
            </p>
            <div className="font-mono text-xs sm:text-sm break-all bg-background/50 p-2 rounded">
              https://notion.so/
              <span className="text-primary">
                xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </span>
              ?pvs=4
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
              Notionデータベースをコピー
            </Link>
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            ※Notionデータベースをコピーしてから、そのページIDを入力してください
          </p>
        </div>
      </div>
    </motion.div>
  );
}
