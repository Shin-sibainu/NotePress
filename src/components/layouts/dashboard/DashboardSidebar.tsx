"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  FileEdit,
  Settings,
  // Image,
  // Palette,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "ダッシュボード",
    path: "/dashboard",
    enabled: true,
  },
  {
    icon: FileEdit,
    label: "記事一覧",
    path: "/dashboard/posts",
    enabled: false,
    comingSoon: true,
  },
  {
    icon: Settings,
    label: "設定",
    path: "/dashboard/settings",
    enabled: false,
    comingSoon: true,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-background/80 backdrop-blur-sm hidden lg:block"
    >
      <Link
        href="/"
        className="flex h-16 items-center gap-2 border-b border-border px-6"
      >
        <Sparkles className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">NotePress</span>
      </Link>

      <nav className="space-y-1 p-4">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              "relative group",
              !item.enabled && "cursor-not-allowed opacity-50"
            )}
          >
            {item.comingSoon && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                開発中
              </span>
            )}
            <Link
              href={item.enabled ? item.path : "#"}
              onClick={(e) => !item.enabled && e.preventDefault()}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent",
                !item.enabled && "pointer-events-none",
                "pr-16"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
