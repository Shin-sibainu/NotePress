"use client";

import { GradientBackground } from "@/components/GradientBackground";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <GradientBackground />
      {children}
    </div>
  );
}
