import { Boxes, Code2, Palette } from "lucide-react";
import { AnimatedSection } from "../animated-section";
import { Card } from "../ui/card";

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm hover:bg-accent/5 transition-colors">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

export function Features() {
  return (
    <section className="py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            ブログ作成に必要な全ての機能
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection delay={0.2}>
            <FeatureCard
              icon={<Boxes />}
              title="Notionとの連携"
              description="ワンクリックでNotionワークスペースと接続。コンテンツは自動的に同期されます。"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <FeatureCard
              icon={<Palette />}
              title="美しいテンプレート"
              description="用途に合わせて選べる、丁寧にデザインされたテンプレートコレクション。"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.6}>
            <FeatureCard
              icon={<Code2 />}
              title="コード不要"
              description="技術的なスキルは必要ありません。Notionが使えれば、ブログが作れます。"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
