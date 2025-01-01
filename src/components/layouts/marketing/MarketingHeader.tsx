"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

const navigation = [
  { name: "テンプレート", href: "/templates" },
];

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
        <div className="flex items-center gap-8">
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">NotePress</span>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/dashboard">ダッシュボード</Link>
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          ) : (
            <Button asChild>
              <Link href="/setup">今すぐ始める</Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
