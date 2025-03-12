"use client";

import { motion } from "framer-motion";

export default function CommercialTransactionsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">特定商取引法に基づく表記</h1>

        <div className="prose prose-lg max-w-none">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top w-1/4">
                  販売事業者
                </th>
                <td className="py-4">
                  <p>ShinCode</p>
                  <p className="text-sm text-muted-foreground">※個人事業主</p>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  運営統括責任者
                </th>
                <td className="py-4">
                  <p>Shin</p>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">所在地</th>
                <td className="py-4">
                  <p className="text-sm text-muted-foreground">
                    ※請求があったら遅滞なく開示します
                  </p>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">連絡先</th>
                <td className="py-4">
                  メールアドレス：shincodeinc@gmail.com
                  <br />
                  <p className="text-sm text-muted-foreground">
                    ※電話番号は請求があったら遅滞なく開示します
                    <br />
                    営業時間：平日10:00〜18:00（土日祝日・年末年始を除く）
                  </p>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">販売価格</th>
                <td className="py-4">
                  各商品ページに表示される価格に準じます
                  <br />
                  <span className="text-sm text-muted-foreground">
                    ※表示価格は全て税込みです
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  商品代金以外の必要料金
                </th>
                <td className="py-4">決済手数料：無料</td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">支払方法</th>
                <td className="py-4">
                  クレジットカード決済（Stripe）
                  <br />
                  <span className="text-sm text-muted-foreground">
                    対応カード：Visa, Mastercard, American Express, JCB
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">支払時期</th>
                <td className="py-4">
                  クレジットカード決済の場合、ご注文時に即時決済されます
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  商品の引渡時期
                </th>
                <td className="py-4">
                  お支払い完了後、1~2営業日以内にGithubソースコードへのアクセス権限
                  + Speed
                  Build利用するための講座のリンクをメールにてお渡しします。
                </td>
              </tr>
              <tr className="border-b">
                <th className="py-4 pr-4 text-left align-top">
                  返品・キャンセルについて
                </th>
                <td className="py-4">
                  <p className="mb-2">＜お客様都合による返金の場合＞</p>
                  <p>ご購入後14日以内であれば、全額返金に対応いたします。</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    ※返金をご希望の場合は、メールにてご連絡ください
                    <br />
                    ※返金手続きには3-5営業日程度かかる場合があります
                  </p>
                  <p className="mt-4 mb-2">＜サービスに不具合があった場合＞</p>
                  <p>
                    当社の責任において速やかに不具合を修正、もしくは全額返金いたします。
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 p-4 bg-muted/20 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">特記事項</h2>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>本サービスはデジタルコンテンツの提供です</li>
              <li>
                サービスの性質上、提供開始後の返品には応じかねる場合があります
              </li>
              <li>商品の詳細については、各商品ページをご確認ください</li>
            </ul>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            最終更新日：2025年3月12日
          </p>
        </div>
      </motion.div>
    </div>
  );
}
