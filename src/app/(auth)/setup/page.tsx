"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GradientBackground } from "@/components/gradient-background";
import { SetupStepper } from "@/components/auth/setup/SetupStepper";

export default function SetupPage() {
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
              <span className="text-xl font-bold">NextNotion</span>
            </motion.div>
          </Link>
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Link href="/">ホームへ戻る</Link>
          </Button>
        </div>
      </motion.header>

      <div className="min-h-screen flex items-center justify-center p-4">
        <SetupStepper />
      </div>
    </div>
  );
}
