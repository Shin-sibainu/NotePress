import { MarketingHeader } from "@/components/layouts/marketing/MarketingHeader";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <MarketingHeader />
      {children}
    </div>
  );
} 