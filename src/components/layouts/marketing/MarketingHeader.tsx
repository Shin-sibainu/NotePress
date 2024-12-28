"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  UserButton,
  useUser,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

export function MarketingHeader() {
  const { isSignedIn } = useUser();



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
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "right-0",
                },
              }}
            />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline">
                  ログイン
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default">
                  新規登録
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
