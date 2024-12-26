import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  onUpdateData: (data: { url: string | null }) => void;
  initialValue: string;
}

export function BasicInfoStep({
  onUpdateData,
  initialValue,
}: BasicInfoStepProps) {
  const [url, setUrl] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const isValid = url.trim().length > 0;
  const showError = touched && !isValid;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUrl(value);
    setTouched(true);
    onUpdateData({ url: value || null });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">URLの設定</h1>
        <p className="text-lg text-muted-foreground">
          ブログのURLを設定します。あとから変更することもできます。
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium mb-2 block">
            ブログのURL
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 text-lg text-muted-foreground w-full sm:w-auto">
              <span>https://</span>
              <Input
                placeholder="my-blog"
                className={cn(
                  "h-12 text-lg max-w-[200px]",
                  showError &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                value={url}
                onChange={handleUrlChange}
                onBlur={() => setTouched(true)}
              />
            </div>
            <span className="text-lg text-muted-foreground">
              .{process.env.NEXT_PUBLIC_BASE_URL}
            </span>
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-muted-foreground">
              半角英数字とハイフン(-) が使用できます
            </p>
            <p className="text-sm text-muted-foreground">
              例: my-blog, tech-notes, portfolio
            </p>
            <p className="text-sm text-muted-foreground">
              ※
              指定したURLが既に使用されている場合、自動的に別のURLが割り当てられます
            </p>
          </div>
          {showError && (
            <p className="text-sm text-destructive mt-2">
              URLを入力してください
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
