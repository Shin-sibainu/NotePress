"use client";


import { GradientBackground } from "@/components/GradientBackground";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Performance } from "@/components/marketing/performance";
import { Templates } from "@/components/marketing/templates";
import { CTA } from "@/components/marketing/cta";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background/50 text-foreground">
      <GradientBackground />

      <Hero />
      <Features />
      <Performance />
      <Templates />
      <CTA />

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 NotionCMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
