"use client";

import { motion } from "framer-motion";
import { ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";

interface BlogStatusProps {
  url?: string;
}

export function BlogStatus({ url }: BlogStatusProps) {
  const [blogUrl, setBlogUrl] = useState<string | null>(url || null);

  useEffect(() => {
    if (!url) {
      const storedUrl = localStorage.getItem("deployedBlogUrl");
      if (storedUrl) setBlogUrl(storedUrl);
    }
  }, [url]);

  if (!blogUrl) return null;

  const fullUrl = blogUrl.startsWith("http") ? blogUrl : `https://${blogUrl}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">ブログステータス</h2>
            <p className="text-muted-foreground mb-4">
              あなたのブログは正常に公開されています
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(fullUrl)}
            >
              <Copy className="h-4 w-4 mr-2" />
              URLをコピー
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent/50 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{blogUrl}</span>
          <Button
            size="sm"
            variant="ghost"
            className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
            asChild
          >
            <Link href={fullUrl} target="_blank">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                オンライン
                <ExternalLink className="h-3 w-3" />
              </span>
            </Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
