import { motion } from "framer-motion";
import { ArrowRight, FileText, Palette, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: FileText,
    title: "Notionで記事を書く",
    description: "普段使っているNotionで、いつも通りに記事を書きます。特別な操作は必要ありません。",
  },
  {
    icon: Palette,
    title: "テンプレートを選ぶ",
    description: "用意された美しいテンプレートから、お好みのデザインを選択するだけ。カスタマイズも可能です。",
  },
  {
    icon: Rocket,
    title: "公開完了",
    description: "あとは自動的に記事が反映されます。Notionの更新もリアルタイムで反映されます。",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            驚くほど簡単な使い方
          </h2>
          <p className="text-xl text-muted-foreground">
            たった3ステップで、あなたのブログが完成します。
            技術的な知識は一切必要ありません。
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting Line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-primary/20 hidden md:block" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="relative p-6 h-full bg-card/50 backdrop-blur-sm">
                    <div className="relative z-10">
                      {/* Step Number */}
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="absolute -right-3 top-24 transform translate-x-1/2 hidden md:block z-10">
                        <div className="w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                          <ArrowRight className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
} 