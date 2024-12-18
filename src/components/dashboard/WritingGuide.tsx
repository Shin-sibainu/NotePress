'use client';

import { motion } from 'framer-motion';
import { FileText, Link as LinkIcon, Image, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';

const guideItems = [
  {
    icon: FileText,
    title: '新規ページの作成',
    description: 'Notionで新しいページを作成し、テンプレートを使用します',
  },
  {
    icon: Tag,
    title: 'タグの設定',
    description: 'ページのプロパティでタグを設定して記事を整理します',
  },
  {
    icon: Image,
    title: 'アイキャッチ画像',
    description: 'カバー画像を設定して記事を魅力的に見せましょう',
  },
  {
    icon: LinkIcon,
    title: 'コンテンツの公開',
    description: '「公開」プロパティをオンにすると自動的に反映されます',
  },
];

export function WritingGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="p-6 bg-card/50 backdrop-blur-sm h-full">
        <h2 className="text-xl font-bold mb-4">記事の書き方</h2>
        <div className="space-y-4">
          {guideItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/50 flex items-center justify-center">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
} 