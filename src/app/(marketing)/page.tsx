"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/gradient-background";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Performance } from "@/components/marketing/performance";
import { Templates } from "@/components/marketing/templates";
import { CTA } from "@/components/marketing/cta";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background/50 text-foreground">
      <GradientBackground />

      {/* Header */}
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
              <span className="text-xl font-bold">NotionCMS</span>
            </motion.div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline">ログイン</Button>
            <Button variant="default">新規登録</Button>
          </div>
        </div>
      </motion.header>

      <Hero />
      <Features />
      <Performance />
      <Templates />
      <CTA />

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 NotionCMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
