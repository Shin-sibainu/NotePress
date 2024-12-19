import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { GradientBackground } from "@/components/GradientBackground";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background/50 text-foreground">
      <GradientBackground />

      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8 pt-24 lg:pl-72">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
