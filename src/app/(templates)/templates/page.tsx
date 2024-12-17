import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const templates = [
  {
    id: "minimalist",
    name: "ミニマル",
    description: "シンプルで読みやすいデザイン",
    image: "/templates/minimalist.jpg",
  },
  {
    id: "magazine",
    name: "マガジン",
    description: "雑誌のようなレイアウト",
    image: "/templates/magazine.jpg",
  },
];

export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-4xl font-bold mb-12 text-center">テンプレート</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <Link key={template.id} href={`/templates/${template.id}`}>
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-video">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
