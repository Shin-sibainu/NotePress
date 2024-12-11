import { motion } from 'framer-motion';

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#3c1f66_0%,#1a1a1a_100%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <div className="absolute inset-0 bg-background/80" />
      <motion.div
        className="absolute -top-[25%] -left-[25%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#6366f1_0%,transparent_25%)]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute -bottom-[25%] -right-[25%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#8b5cf6_0%,transparent_25%)]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}