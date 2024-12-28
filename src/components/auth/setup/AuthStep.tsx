"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function AuthStep() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">アカウントの作成</h1>
        <p className="text-lg text-muted-foreground">
          ブログを作成するにはアカウントが必要です
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <SignUpButton mode="modal">
          <Button size="lg" className="w-full max-w-sm">
            アカウントを作成
          </Button>
        </SignUpButton>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>すでにアカウントをお持ちの方は</span>
          <SignInButton mode="modal">
            <Button variant="link" className="h-auto p-0">
              ログイン
            </Button>
          </SignInButton>
        </div>
      </div>
    </motion.div>
  );
} 