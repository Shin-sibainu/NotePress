"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card p-8 rounded-lg shadow-lg flex flex-col items-center gap-4"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">ダッシュボードを読み込み中...</h3>
          <p className="text-sm text-muted-foreground">
            しばらくお待ちください
          </p>
        </div>
      </motion.div>
    </div>
  );
}
