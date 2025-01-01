import { MarketingHeader } from "@/components/layouts/marketing/MarketingHeader";
import { Footer } from "@/components/layouts/footer";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MarketingHeader />
      <main className="flex-1 mt-16">{children}</main>
      <Footer />
    </div>
  );
} 