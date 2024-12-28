import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import {
  ClerkProvider,
} from '@clerk/nextjs'

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

export const metadata = {
  title: "NotePress",
  description: "NotionをCMSとして活用するブログプラットフォーム",
};

//https://github.com/splitbee/notion-api-worker
//https://splitbee.io/blog/notion-as-cms-using-nextjs

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="ja" className={`${notoSansJP.className}`}>
      <body className="font-noto-sans">
        {children}
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
