import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="fixed top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 lg:px-8">
        <Link href="/" className="font-bold text-xl">
          NotionCMS
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
