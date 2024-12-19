"use client";

import { motion } from "framer-motion";
import { FileText, Tag, Image, Globe, Link, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const guideItems = [
  {
    icon: FileText,
    title: "1. 記事を書く",
    description: "Notionで新しいページを作成して、タイトルや記事を書きましょう",
  },
  {
    icon: Tag,
    title: "2. タグを付ける",
    description: "タグを付けましょう",
  },
  {
    icon: Link,
    title: "3. 記事スラグを付ける",
    description: "公開する記事のURL(スラグ)を決定しましょう。",
  },
  {
    icon: Image,
    title: "4. アイキャッチを設定",
    description: "カバー画像を選択して、記事のアイキャッチ画像を設定しましょう",
  },
  {
    icon: Globe,
    title: "5. 公開する",
    description:
      "「Published」をオンにすると自動的に反映されます(※反映には5分程度かかる場合があります)",
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
        <h2 className="text-xl font-bold mb-6">NotionCMSの記事の書き方</h2>
        <div className="space-y-5">
          {guideItems.map((item, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-base mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            <h3 className="font-medium">動画で詳しく見る</h3>
          </div>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-accent/20">
            <iframe
              src="https://www.youtube.com/embed/your-video-id"
              title="NotionCMSの使い方"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            ※ 音声付きの解説動画です。音量にご注意ください。
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="sm" className="text-primary" asChild>
            <a
              href="https://docs.notioncms.app/guides/writing"
              target="_blank"
              rel="noopener noreferrer"
            >
              より詳しい解説を見る
            </a>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
