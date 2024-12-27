"use client";

import { motion } from "framer-motion";
import { TemplateCard } from "./TemplateCard";
import { templates } from "@/data/templates";

export function TemplateGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <TemplateCard template={template} />
        </motion.div>
      ))}
    </div>
  );
}
