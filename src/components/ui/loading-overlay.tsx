"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-8 rounded-lg shadow-lg flex flex-col items-center gap-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">ブログを準備しています...</h3>
          <p className="text-sm text-muted-foreground">
            ダッシュボードへ移動します
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
} 