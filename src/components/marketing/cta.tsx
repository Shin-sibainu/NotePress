import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "../animated-section";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 pb-32 bg-accent/5">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ブログを始める準備はできましたか？
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              すでに多くのクリエイターがNotionCMSでブログを公開しています。
            </p>
            <Link href={"/setup"}>
              <Button size="lg" className="group">
                今すぐ始める
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
