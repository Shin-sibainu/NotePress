import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const plans = [
  {
    name: "Free",
    price: "¥0",
    description: "個人ブログに最適",
    features: [
      "無制限の記事投稿",
      "基本的なテンプレート",
      "Notionとの連携",
      "高速な表示速度",
      "無料のホスティング",
    ],
  },
  {
    name: "Pro",
    price: "¥1,980",
    period: "/月",
    description: "プロフェッショナルな機能が必要な方に",
    features: [
      "Freeプランの全機能",
      "カスタムドメイン",
      "プレミアムテンプレート",
      "アナリティクス機能",
      "優先サポート",
      "広告なし",
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            シンプルな料金プラン
          </h2>
          <p className="text-xl text-muted-foreground">
            必要な機能に応じて、最適なプランをお選びいただけます。
            いつでもプランの変更が可能です。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card
                className={`relative p-8 h-full ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                      人気
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <Button
                    className="w-full mb-8"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    選択する
                  </Button>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
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
