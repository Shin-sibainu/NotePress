import Link from "next/link";

const footerLinks = {
  product: [
    { name: "テンプレート", href: "/templates" },
    // { name: "機能", href: "/features" },
    // { name: "料金プラン", href: "/pricing" },
  ],
  support: [
    // { name: "ドキュメント", href: "/docs" },
    { name: "お問い合わせ", href: "https://skinny-talos-8be.notion.site/16e1dcf229c280088788d3daf3d2927c?pvs=105" },
  ],
  legal: [
    { name: "利用規約", href: "/terms" },
    { name: "プライバシーポリシー", href: "/privacy" },
    // { name: "特定商取引法に基づく表記", href: "/legal" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">NotePress</h3>
            <p className="text-sm text-muted-foreground">
              NotionをCMSとして活用する
              <br />
              ブログプラットフォーム
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">プロダクト</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">サポート</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">法的情報</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} NotePress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
