// app/(templates)/minimalist/layout.tsx
import Link from "next/link";
// import '../styles/notion.css'
import "react-notion/src/styles.css";

export default function MinimalistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold">
            <Link href={"/templates/minimalist"}>Minimalist</Link>
          </h1>

          <nav className="mt-4">
            <ul className="flex gap-4">
              <li>
                <Link
                  href={"/templates/minimalist"}
                  className="text-gray-600 hover:text-black"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link href="about" className="text-gray-600 hover:text-black">
                  About
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">{children}</main>

      <footer className="border-t mt-20">
        <div className="max-w-2xl mx-auto py-8 px-4 text-center text-gray-500">
          © 2024 Minimalist Blog Template
        </div>
      </footer>
    </div>
  );
}
