export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">特定商取引法に基づく表記</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">販売事業者</h2>
          <p>NotePress運営事務局</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">連絡先</h2>
          <p>メール：shincodeinc@gmail.com</p>
          <p className="text-sm text-muted-foreground mt-2">
            ※お問い合わせはメールまたは
            <a
              href="https://x.com/Shin_Engineer"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ShinCodeのX
            </a>
            にてお願いいたします。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">販売価格</h2>
          <p>各テンプレートの販売ページに表示された金額</p>
          <p className="text-sm text-muted-foreground mt-2">
            ※価格は税込み表示です
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">商品の提供方法</h2>
          <p>デジタルコンテンツとしてオンラインで提供</p>
          <p className="text-sm text-muted-foreground mt-2">
            ※お支払い完了後、即時にご利用いただけます
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">支払方法</h2>
          <p>クレジットカード決済（Stripe決済）</p>
          <p className="text-sm text-muted-foreground mt-2">
            ※対応カードブランド：Visa, Mastercard, American Express, JCB
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            返品・キャンセルについて
          </h2>
          <p>
            デジタルコンテンツの性質上、購入後の返品・キャンセルはお受けできません。
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            ※不具合や技術的な問題が発生した場合は、サポートメールまでご連絡ください
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">動作環境</h2>
          <p>
            推奨ブラウザ：Google Chrome, Firefox, Safari, Microsoft Edge
            の最新版
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">その他の注意事項</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>当サービスは個人開発のプロジェクトとして運営されています</li>
            <li>サービスの仕様や料金は予告なく変更される場合があります</li>
            <li>
              システムメンテナンス等により一時的にサービスを停止する場合があります
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
