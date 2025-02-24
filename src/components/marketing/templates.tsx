import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { templates } from "@/data/templates";

export function Templates() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            テンプレート一覧
          </h2>
          <p className="text-xl text-muted-foreground">
            目的に合わせて最適なテンプレートをお選びください。
            全てのテンプレートは永続ライセンスで提供します。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div className="relative aspect-video">
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {template.isNew && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-primary text-primary-foreground font-medium px-3 py-1">
                        NEW
                      </Badge>
                    </div>
                  )}
                  {template.popular && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        人気
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                    <p className="text-muted-foreground">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-auto space-y-6">
                    <div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold">
                          ¥{template.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          {template.available ? "（買い切り）" : "（開発中）"}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {template.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span
                              className={`text-sm ${
                                template.available
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      disabled={!template.available}
                      variant={
                        template.available
                          ? template.popular
                            ? "default"
                            : "outline"
                          : "secondary"
                      }
                      onClick={() => window.open(template.demoUrl, "_blank")}
                    >
                      {!template.available ? "Coming Soon" : "サンプルを見る"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
