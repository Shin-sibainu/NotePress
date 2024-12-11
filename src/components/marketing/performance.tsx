import { Cpu, Gauge, Zap, Wifi } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AnimatedSection } from '../animated-section';
import { Progress } from '../ui/progress';

function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  metric 
}: { 
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; 
  title: string; 
  value: number; 
  metric: string; 
}) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-4 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        <Progress value={value} className="h-2" />
        <p className="text-sm text-muted-foreground">{metric}</p>
      </div>
    </Card>
  );
}

export function Performance() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              高速なパフォーマンス
            </h2>
            <p className="text-lg text-muted-foreground">
              ブログの表示速度を最適化し、読者に最高のユーザー体験を提供。
              ストレスフリーな閲覧環境を実現します。
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection delay={0.1}>
            <MetricCard
              icon={Zap}
              title="読み込み時間"
              value={95}
              metric="平均表示速度: 0.6秒"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <MetricCard
              icon={Gauge}
              title="パフォーマンス"
              value={98}
              metric="Lighthouseスコア: 98/100"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <MetricCard
              icon={Cpu}
              title="リソース最適化"
              value={92}
              metric="最適化された配信システム"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <MetricCard
              icon={Wifi}
              title="グローバルCDN"
              value={100}
              metric="99.99%の稼働率を保証"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}