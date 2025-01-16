"use client";

import { motion } from "framer-motion";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

const problems = [
  {
    title: "毎月のサーバー代",
    description: "レンタルサーバーの維持費用が継続的に発生",
    solution: "サーバー代は一切不要",
    solutionDescription:
      "静的サイトとして生成されるため、無料でホスティング可能",
  },
  {
    title: "複雑な管理画面",
    description: "難しい操作を覚える必要があり、記事作成に集中できない",
    solution: "Notionをそのまま使用できる",
    solutionDescription: "慣れ親しんだNotionで直感的に操作",
  },
  {
    title: "専用ツールが必要",
    description: "新しいツールの使い方を学ぶ時間が必要",
    solution: "普段の環境で記事作成",
    solutionDescription: "Notionで書いた記事がそのまま反映",
  },
  {
    title: "デザインの調整",
    description: "見た目の調整に時間がかかり、本質的な作業ができない",
    solution: "美しいデザインが完成済み",
    solutionDescription: "プロフェッショナルなデザインをすぐに利用可能",
  },
  // {
  //   title: "手間のかかる更新",
  //   description: "記事の更新作業が複雑で時間がかかる",
  //   solution: "自動で即時反映",
  //   solutionDescription: "保存するだけで自動的にブログに反映",
  // },
];

export function Problems() {
  return (
    <section className="py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ブログ運営の課題を解決
          </h2>
          <p className="text-lg text-muted-foreground">
            NotePressは、ブログ運営における一般的な課題を解決します
          </p>
        </motion.div>

        <div className="space-y-6">
          {problems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="relative group overflow-hidden">
                <div className="grid md:grid-cols-2 divide-x divide-border">
                  {/* Problem Side */}
                  <div className="p-8 bg-red-950/30">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <X className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-red-400">
                          {item.title}
                        </h3>
                        <p className="text-sm text-red-300/80">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Solution Side */}
                  <div className="p-8 bg-emerald-500/5">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-emerald-500">
                          {item.solution}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.solutionDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-4 border-border flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-950/30 via-transparent to-emerald-500/5" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
