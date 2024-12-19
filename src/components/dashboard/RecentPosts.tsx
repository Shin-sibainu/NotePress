'use client';

import { motion } from 'framer-motion';
import { Eye, MessageSquare, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const recentPosts = [
  {
    title: 'NotionCMSでブログを始める方法',
    views: 245,
    comments: 12,
    date: '2024-03-20',
    status: 'published',
  },
  {
    title: 'マークダウン記法の基本',
    views: 180,
    comments: 8,
    date: '2024-03-19',
    status: 'published',
  },
  {
    title: 'ブログのカスタマイズテクニック',
    views: 123,
    comments: 5,
    date: '2024-03-18',
    status: 'draft',
  },
];

export function RecentPosts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm opacity-50">
        <h2 className="text-xl font-bold mb-4">最近の記事</h2>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/20"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{post.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.date}
                  </span>
                </div>
              </div>
              <span className={cn(
                "text-sm px-2 py-1 rounded",
                post.status === 'published' 
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-orange-500/20 text-orange-400"
              )}>
                {post.status === 'published' ? '公開中' : '下書き'}
              </span>
            </div>
          ))}
        </div>
      </Card>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
        <p className="text-lg font-medium text-muted-foreground">
          開発中...🚀
        </p>
      </div>
    </motion.div>
  );
} 