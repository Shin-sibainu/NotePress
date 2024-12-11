import { Card } from "@/components/ui/card";
import Image from "next/image";
import { AnimatedSection } from "../animated-section";

function TemplateCard({ image, name }: { image: string; name: string }) {
  return (
    <Card className="overflow-hidden group cursor-pointer bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          fill
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
    </Card>
  );
}

export function Templates() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            美しいテンプレート
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection delay={0.2}>
            <TemplateCard
              image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=300"
              name="Minimalist"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <TemplateCard
              image="https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=400&h=300"
              name="Magazine"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.6}>
            <TemplateCard
              image="https://images.unsplash.com/photo-1618556450991-2f1af64e8191?auto=format&fit=crop&q=80&w=400&h=300"
              name="Portfolio"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
