import { ExternalLink, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Template } from "@/types/template";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden group relative",
        template.status === "coming_soon" && "opacity-75"
      )}
    >
      {template.status === "coming_soon" && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <Badge variant="secondary" className="text-base px-4 py-1">
            準備中
          </Badge>
        </div>
      )}
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={template.image}
            alt={template.name}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              template.status === "ready" && "group-hover:scale-105"
            )}
          />
        </div>
        {template.featured && template.status === "ready" && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              おすすめ
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
        <p className="text-muted-foreground mb-4">{template.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1"
            asChild
            disabled={template.status === "coming_soon"}
          >
            <Link href={template.demoUrl} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              サンプルを見る
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
