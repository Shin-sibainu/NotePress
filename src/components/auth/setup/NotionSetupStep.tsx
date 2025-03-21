/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, HelpCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { templates } from "@/data/templates";
import { useSetupContext } from "./SetupContext";

interface NotionSetupStepProps {
  onUpdateData: (data: any) => void;
  initialValue: string;
}

export default function NotionSetupStep({
  onUpdateData,
  initialValue,
}: NotionSetupStepProps) {
  const { setupData } = useSetupContext();
  const selectedTemplate = templates.find((t) => t.id === setupData.theme);
  const requiresPayment = selectedTemplate && selectedTemplate.price > 0;

  const extractPageId = (url: string) => {
    // Notionの様々なURL形式に対応
    const patterns = [
      // notion.so形式
      /notion\.so\/(?:[^/]+\/)?([a-zA-Z0-9]{32})/,
      // notion.site形式
      /notion\.site\/(?:[^/]+\/)?([a-zA-Z0-9]{32})/,
      // ページIDのみ
      /([a-zA-Z0-9]{32})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // URLからページIDを抽出（最後の32文字を取得）
    const idMatch = url.match(/[a-zA-Z0-9]{32}(?=\?|$)/);
    return idMatch ? idMatch[0] : null;
  };

  const [notionUrl, setNotionUrl] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const [pageId, setPageId] = useState<string | null>(() => {
    return initialValue ? extractPageId(initialValue) : null;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNotionUrl(url);
    setTouched(true);

    const extractedPageId = extractPageId(url);
    setPageId(extractedPageId);

    if (extractedPageId) {
      onUpdateData({ pageId: extractedPageId });
    } else {
      onUpdateData({ pageId: null }); // 値が空または無効な場合はnullを設定
    }
  };

  const showError = touched && !pageId;

  const handleSubmit = () => {
    onUpdateData({ pageId });
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
          テンプレートをコピーして、そのURLを貼り付けてください。
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center relative"
            asChild
          >
            <Link
              href="https://www.notion.so/Notion-Blog-Sample-14e1dcf229c28018bcbbe57ab6e92e8c?pvs=4"
              target="_blank"
            >
              <ExternalLink className="h-4 w-4" />
              まずはこちらからテンプレートをコピー
            </Link>
          </Button>
          <Link
            href="https://shin-blog.notepress.xyz/post/how-to-get-notion-page-id"
            target="_blank"
            className="text-xs text-muted-foreground hover:text-primary transition-colors text-center"
          >
            <span className="flex items-center justify-center gap-1">
              <HelpCircle className="h-3 w-3" />
              テンプレートのコピー方法が分からない方はこちら
            </span>
          </Link>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50/10 p-4 space-y-3 backdrop-blur-sm">
          <h4 className="font-medium flex items-center gap-2 text-foreground">
            <span className="text-amber-500">⚠️</span>
            重要：テンプレートの利用について
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              NotePressでは、最適な表示と機能のために専用のテンプレートを用意しています。
              以下の手順で設定してください：
            </p>
            <ol className="list-decimal list-inside space-y-1 ml-1">
              <li>上記のボタンからテンプレートをご自身のNotionへコピー</li>
              <li>コピーしたテンプレートを「共有」から「Web公開」を選択</li>
              <li>データベースのURLをコピーして下記にコピペして完了！</li>
            </ol>
            <p className="text-xs mt-2 text-amber-500/80 font-medium">
              ※ 独自のデータベースはサポートしていません
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-base font-medium mb-2 block">
              コピーして作ったNotionデータベースのURL
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="https://notion.so/your-database"
                className={cn(
                  "h-12 text-lg",
                  showError &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                value={notionUrl}
                onChange={handleInputChange}
                onBlur={() => setTouched(true)}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0 relative group"
                asChild
              >
                <Link
                  href="https://shin-blog.notepress.xyz/post/how-to-get-notion-page-id"
                  target="_blank"
                >
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <span className="absolute -top-8 right-0 w-max opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    URLの確認方法はこちら
                  </span>
                </Link>
              </Button>
            </div>
            {showError && (
              <p className="text-sm text-destructive mt-2">
                NotePressのテンプレートをご利用ください。独自のデータベースはサポートしていません。
              </p>
            )}
          </div>
        </div>

        {requiresPayment && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <span className="text-primary">💎</span>
              プレミアムテーマの購入
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                選択された「{selectedTemplate?.name}」テーマは ¥
                {selectedTemplate?.price.toLocaleString()}（買い切り）です。
              </p>
              <p>
                次のステップで決済ページに移動します。
                決済完了後、自動的にブログが作成されます。
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
