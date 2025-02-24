import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/data/templates";

interface ThemeSelectionStepProps {
  onUpdateData: (theme: string | null) => void;
  initialValue: string | null;
}

export default function ThemeSelectionStep({
  onUpdateData,
  initialValue,
}: ThemeSelectionStepProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    initialValue
  );
  const [touched, setTouched] = useState(false);
  const showError = touched && !selectedTheme;

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    setTouched(true);
    onUpdateData(theme || null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">テーマの選択</h1>
        <p className="text-lg text-muted-foreground">
          ブログのデザインテーマを選択してください
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: theme.available ? 1.02 : 1 }}
            whileTap={{ scale: theme.available ? 0.98 : 1 }}
            className={cn("relative", !theme.available && "cursor-not-allowed")}
          >
            {!theme.available && (
              <span className="absolute -right-2 -top-2 z-10 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                準備中
              </span>
            )}
            {theme.isNew && theme.available && (
              <span className="absolute -right-2 -top-2 z-10">
                <Badge className="bg-primary text-primary-foreground font-medium px-3 py-1">
                  NEW
                </Badge>
              </span>
            )}
            <Card
              className={cn(
                "transition-all border-2",
                theme.available
                  ? selectedTheme === theme.id
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "hover:border-primary/50 border-transparent"
                  : "opacity-50 border-transparent",
                !theme.available && "pointer-events-none",
                showError && "border-destructive"
              )}
              onClick={() => theme.available && handleThemeChange(theme.id)}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                <Image
                  src={theme.thumbnail}
                  alt={theme.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{theme.name}</h3>
                  <span className="text-sm font-medium text-muted-foreground">
                    {theme.price === 0
                      ? "無料"
                      : `¥${theme.price.toLocaleString()}`}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  {theme.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                  disabled={!theme.available}
                >
                  <Link href={theme.demoUrl} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    サンプルを見る
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground text-center">
        ※ テーマによって値段が変動します
      </div>
      {showError && (
        <p className="text-sm text-destructive text-center mt-4">
          テーマを選択してください
        </p>
      )}
    </motion.div>
  );
}
