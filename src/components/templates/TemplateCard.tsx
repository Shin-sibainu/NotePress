import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Template } from "@/data/templates";
import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type TemplateCardProps = {
  template: Template;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden">
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
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
        <p className="text-muted-foreground mb-4">{template.description}</p>

        <div className="mb-6">
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
          {!template.available ? (
            "Coming Soon"
          ) : (
            <>
              サンプルを見る
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
