import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BasicInfoStepProps {
  onUpdateData: (data: { url: string }) => void;
  initialValue: string;
}

export function BasicInfoStep({
  onUpdateData,
  initialValue,
}: BasicInfoStepProps) {
  const [url, setUrl] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateUrl = (input: string) => {
    // 空文字チェック
    if (!input) {
      setError("URLを入力してください");
      return false;
    }

    // 長さチェック
    if (input.length < 3 || input.length > 20) {
      setError("URLは3文字以上20文字以下で入力してください");
      return false;
    }

    // 半角英数字とハイフンのみ許可
    const validUrlPattern = /^[a-z0-9-]+$/;
    if (!validUrlPattern.test(input)) {
      setError("URLは半角英数字とハイフンのみ使用できます");
      return false;
    }

    // ハイフンの位置チェック
    if (input.startsWith("-") || input.endsWith("-")) {
      setError("URLの先頭と末尾にハイフンは使用できません");
      return false;
    }

    // 予約語チェック
    const reservedWords = ["www", "admin", "api", "dashboard", "blog"];
    if (reservedWords.includes(input.toLowerCase())) {
      setError("このURLは使用できません");
      return false;
    }

    setError(null);
    return true;
  };

  useEffect(() => {
    if (url) {
      const isValid = validateUrl(url);
      if (isValid) {
        onUpdateData({ url });
      } else {
        onUpdateData({ url: "" });
      }
    }
  }, [url, onUpdateData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">URLの設定</h1>
        <p className="text-lg text-muted-foreground">
          ブログのURLを設定しましょう。後から変更することもできます。
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
                  error &&
                    touched &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                value={url}
                onChange={(e) => setUrl(e.target.value.toLowerCase())}
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
          </div>
          {error && touched && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
