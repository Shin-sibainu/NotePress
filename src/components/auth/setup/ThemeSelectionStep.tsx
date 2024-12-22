/* eslint-disable @typescript-eslint/no-unused-vars */

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const themes = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "シンプルで読みやすいデザイン",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=500",
    price: "無料",
    enabled: true,
    demoUrl: "https://minimalist-three.vercel.app/",
  },
  {
    id: "casual",
    name: "Casual",
    description: "親しみやすいカジュアルなデザイン",
    image:
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800&h=500",
    price: "¥4,980",
    enabled: false,
    comingSoon: true,
    demoUrl: "#",
  },
];

interface ThemeSelectionStepProps {
  onComplete: () => void;
  onUpdateData: (theme: string | null) => void;
  initialValue: string | null;
}

export default function ThemeSelectionStep({
  onComplete,
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
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: theme.enabled ? 1.02 : 1 }}
            whileTap={{ scale: theme.enabled ? 0.98 : 1 }}
            className={cn("relative", !theme.enabled && "cursor-not-allowed")}
          >
            {theme.comingSoon && (
              <span className="absolute -right-2 -top-2 z-10 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                準備中
              </span>
            )}
            <Card
              className={cn(
                "transition-all border-2",
                theme.enabled
                  ? selectedTheme === theme.id
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "hover:border-primary/50 border-transparent"
                  : "opacity-50 border-transparent",
                !theme.enabled && "pointer-events-none",
                showError && "border-destructive"
              )}
              onClick={() => theme.enabled && handleThemeChange(theme.id)}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
                <Image
                  src={theme.image}
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
                    {theme.price}
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
                  disabled={!theme.enabled}
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
