"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import { ArrowRight } from "lucide-react";

interface Blog {
  id: string;
  url: string;
  theme: string;
  isDefault?: boolean;
}

export function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">所有中のブログ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map((blog) => {
          const template = templates.find((t) => t.id === blog.theme);
          return (
            <Card key={blog.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">
                    {template?.name || blog.theme}
                  </h3>
                  <p className="text-sm text-muted-foreground">{blog.url}</p>
                </div>
                {blog.isDefault && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    デフォルト
                  </span>
                )}
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/dashboard/blogs/${blog.id}`}>
                  管理画面へ
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
