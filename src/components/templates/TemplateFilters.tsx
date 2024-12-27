"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { templateCategories } from "@/data/templates";

export function TemplateFilters() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap gap-2">
        {templateCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
