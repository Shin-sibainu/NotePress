"use client";

import { GradientBackground } from "@/components/GradientBackground";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Performance } from "@/components/marketing/performance";
import { Templates } from "@/components/marketing/templates";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/layouts/footer";
import { FAQ } from "@/components/marketing/faq";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background/50 text-foreground">
      <GradientBackground />

      <Hero />
      <Features />
      <Performance />
      <Templates />
      <FAQ/>
      <CTA />

      <Footer />
    </div>
  );
}
