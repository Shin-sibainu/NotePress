"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "NotePressは無料で使えますか？",
    answer:
      "基本的な機能は無料でご利用いただけます。より高度な機能やテンプレートの種類によっては料金が発生します。",
  },
  {
    question: "技術的な知識は必要ですか？",
    answer:
      "いいえ、必要ありません。NotionでブログのコンテンツをNotionで書くだけで、美しいブログが作成できます。",
  },
  {
    question: "独自ドメインは使えますか？",
    answer:
      "現在はnotepress.xyzのサブドメインが必須です。カスタムドメインの実装はしておりません。",
  },
  {
    question: "記事の投稿に制限はありますか？",
    answer:
      "記事投稿に制限はありません。ご自由にNotionで記事を執筆してください。",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">よくある質問</h2>
          <p className="text-muted-foreground text-lg">
            NotePressに関する一般的な質問をまとめました
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
