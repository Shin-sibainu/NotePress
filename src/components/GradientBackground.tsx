"use client";

import { motion } from "framer-motion";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#3c1f66_0%,#1a1a1a_100%)]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-background/80"
      />
      <div
        className="absolute -top-[25%] -left-[25%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#6366f1_0%,transparent_25%)] opacity-20"
        style={{
          animation: "pulse 15s linear infinite",
        }}
      />
      <div
        className="absolute -bottom-[25%] -right-[25%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#8b5cf6_0%,transparent_25%)] opacity-30"
        style={{
          animation: "pulse-reverse 15s linear infinite",
        }}
      />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.3;
          }
        }
        @keyframes pulse-reverse {
          0%,
          100% {
            transform: scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
