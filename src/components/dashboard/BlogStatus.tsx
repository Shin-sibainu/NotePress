'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface BlogStatusProps {
  url?: string;
}

export function BlogStatus({ url }: BlogStatusProps) {
  if (!url) return null;

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
              onClick={() => navigator.clipboard.writeText(url)}
            >
              <Copy className="h-4 w-4 mr-2" />
              URLをコピー
            </Button>
            <Button size="sm" asChild>
              <Link href={url} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                ブログを表示
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-accent/50 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{url}</span>
          <span className="text-sm text-emerald-400">オンライン</span>
        </div>
      </Card>
    </motion.div>
  );
} 