import { GradientBackground } from "@/components/gradient-background";

export default function TemplatesLayout({
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