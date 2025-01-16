import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const templates = [
  {
    name: "ベーシック",
    price: "¥4,980",
    description: "シンプルで使いやすいブログテンプレート",
    features: [
      "レスポンシブデザイン",
      "基本的なブログ機能",
      "Notionとの連携",
      "高速な表示速度",
      "無料アップデート",
      "永続ライセンス",
    ],
  },
  {
    name: "プロフェッショナル",
    price: "¥9,980",
    description: "高度なカスタマイズが可能なテンプレート",
    features: [
      "ベーシックの全機能",
      "カスタムデザインオプション",
      "アナリティクス機能",
      "SEO最適化機能",
      "優先サポート",
      "コメント機能",
      "永続ライセンス",
    ],
    popular: true,
  },
];

export function Pricing() {
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            テンプレート料金
          </h2>
          <p className="text-xl text-muted-foreground">
            一度購入すれば永続的にご利用いただけます。
            アップデートも無料で提供します。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className={`relative p-8 h-full ${
                  template.popular ? "border-primary" : ""
                }`}
              >
                {template.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      おすすめ
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{template.price}</span>
                    <span className="text-muted-foreground ml-1">
                      （買い切り）
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {template.description}
                  </p>

                  <Button
                    className="w-full mb-8"
                    variant={template.popular ? "default" : "outline"}
                  >
                    購入する
                  </Button>

                  <ul className="space-y-4">
                    {template.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
