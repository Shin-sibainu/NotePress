import { Cpu, Gauge, Zap, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

function MetricCard({
  icon: Icon,
  title,
  value,
  metric,
  delay,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
  metric: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="relative group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative p-8">
          {/* Icon Container with 3D Effect */}
          <div className="mb-6">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transform group-hover:-translate-y-1 transition-transform duration-300">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -inset-2 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">{metric}</p>
            </div>

            {/* Progress Bar Container */}
            <div className="relative">
              <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.2,
                    delay: delay + 0.3,
                    ease: "easeOut",
                  }}
                  className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full"
                />
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted-foreground">0%</span>
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: delay + 1.5 }}
                  className="font-medium text-primary"
                >
                  {value}%
                </motion.span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Icon className="h-12 w-12 text-primary transform rotate-12" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function Performance() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            高速なページ読み込み
          </h2>
          <p className="text-lg text-muted-foreground">
            静的サイト生成により、驚くほど高速なページ表示を実現
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <MetricCard
            icon={Zap}
            title="読み込み時間"
            value={98}
            metric="平均表示速度: 0.6秒"
            delay={0.1}
          />
          <MetricCard
            icon={Gauge}
            title="パフォーマンス"
            value={99}
            metric="Lighthouseスコア: 98/100"
            delay={0.2}
          />
          <MetricCard
            icon={Cpu}
            title="リソース最適化"
            value={92}
            metric="最適化された配信システム"
            delay={0.3}
          />
          <MetricCard
            icon={Wifi}
            title="グローバルCDN"
            value={99}
            metric="99.99%の稼働率を保証"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
}
