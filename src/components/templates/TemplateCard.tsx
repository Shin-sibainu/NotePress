import { ExternalLink, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Template } from '@/types/template';
import Image from 'next/image';
import Link from 'next/link';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image 
            src={template.image} 
            alt={template.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {template.featured && (
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
          {template.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1" asChild>
            <Link href={`/templates/${template.id}`}>
              テンプレートを使用
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="#" target="_blank">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
} 