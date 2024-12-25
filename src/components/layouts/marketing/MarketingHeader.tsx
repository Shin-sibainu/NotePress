"use client";

import Link from "next/link";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">NotePress</span>
          </motion.div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline">ログイン</Button>
          <Button variant="default">新規登録</Button>
        </div>
      </div>
    </motion.header>
  );
}
