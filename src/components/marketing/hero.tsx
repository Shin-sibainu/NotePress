import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="pt-36 pb-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight"
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-600 dark:from-primary dark:via-purple-400 dark:to-pink-500">
              あなたのNotionが
              <br />
              美しいブログに変わる
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            コーディング不要で、たった数分でプロフェッショナルなブログを作成。
            あなたのNotionを連携するだけで始められます。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="group">
              <Link href="/setup">
                今すぐ始める
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/templates">テンプレートを見る</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative max-w-6xl mx-auto pt-4"
          >
            <div className="text-sm text-muted-foreground mb-2 text-center">
              🔊 音声付きのデモ動画です
            </div>
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-2 border-primary/10">
              <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://player.vimeo.com/video/1047033261?loop=1"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </Card>
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl transform translate-y-32 opacity-25" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
