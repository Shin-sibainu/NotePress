import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-36 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
          >
            あなたのNotionが
            <br />
            美しいブログに変わる
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            コーディング不要で、数分でプロフェッショナルなブログを作成。
            Notionワークスペースを連携するだけで始められます。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="group">
              今すぐ始める
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button asChild size="lg" variant="secondary">
              {/* <Link href="/templates/minimalist">テンプレートを見る</Link> */}
              <Link href="/templates">テンプレートを見る</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
