import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="p-6 bg-card border-border/0 hover:border-border transition-colors group">
        <div className="mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );
}
