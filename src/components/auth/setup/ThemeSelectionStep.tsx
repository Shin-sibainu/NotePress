import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

const themes = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "シンプルで読みやすいデザイン",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=500",
    price: "¥1980",
  },
  {
    id: "casual",
    name: "Casual",
    description: "親しみやすいカジュアルなデザイン",
    image:
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=800&h=500",
    price: "¥4980",
  },
];

interface ThemeSelectionStepProps {
  onComplete: () => void;
  onUpdateData: (theme: string) => void;
}

export default function ThemeSelectionStep({
  onComplete,
  onUpdateData,
}: ThemeSelectionStepProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const showError = touched && !selectedTheme;

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    onUpdateData(theme);
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`cursor-pointer transition-all border-2 ${
                selectedTheme === theme.id
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "hover:border-primary/50 border-transparent"
              }`}
              onClick={() => handleThemeChange(theme.id)}
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
                <p className="text-muted-foreground">{theme.description}</p>
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

  useEffect(() => {
    setTouched(true);
  }, []);
}
