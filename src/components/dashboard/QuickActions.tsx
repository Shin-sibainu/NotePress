'use client';

import { motion } from 'framer-motion';
import { Plus, FileEdit, Settings, Book } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const actions = [
  {
    icon: Plus,
    label: '新規記事作成',
    description: 'Notionで新しい記事を書く',
    href: 'https://notion.so',
    external: true,
  },
  {
    icon: FileEdit,
    label: '下書き一覧',
    description: '作成中の記事を確認',
    href: '/dashboard/posts?status=draft',
  },
  {
    icon: Settings,
    label: 'ブログ設定',
    description: 'デザインやSEOの設定',
    href: '/dashboard/settings',
  },
  {
    icon: Book,
    label: 'ガイド',
    description: '詳しい使い方を見る',
    href: '/guide',
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm h-full">
        <h2 className="text-xl font-bold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto flex-col items-start gap-1 p-4"
              asChild
            >
              <Link 
                href={action.href}
                target={action.external ? "_blank" : undefined}
              >
                <action.icon className="h-5 w-5 mb-2" />
                <span className="font-medium">{action.label}</span>
                <span className="text-xs text-muted-foreground">
                  {action.description}
                </span>
              </Link>
            </Button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
} 