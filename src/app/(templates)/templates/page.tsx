import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import { TemplateGrid } from "@/components/templates/TemplateGrid";

export default function TemplatesPage() {
  return (
    <div className="relative min-h-screen bg-background/50 text-foreground">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ブログテンプレート</h1>
          <p className="text-lg text-muted-foreground">
            プロフェッショナルなデザインのテンプレートからお選びください。
            すべてのテンプレートはあなたのスタイルに合わせてカスタマイズ可能です。
          </p>
        </div>

        <TemplateFilters />
        <TemplateGrid />
      </main>
    </div>
  );
}
