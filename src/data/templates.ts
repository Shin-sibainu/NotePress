export const templateCategories = [
  { id: "all", name: "すべて" },
  { id: "free", name: "無料" },
  { id: "premium", name: "プレミアム" },
];

export type Template = {
  id: string;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  features: string[];
  popular?: boolean;
  isNew?: boolean;
  available?: boolean;
  demoUrl: string;
};

export const templates: Template[] = [
  {
    id: "minimalist",
    name: "Minimalist",
    price: 0,
    description: "シンプルで読みやすいデザイン",
    thumbnail:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=300",
    features: [
      "クリーンなデザイン",
      "高速な表示速度",
      "モバイルフレンドリー",
      "ダークモード対応",
    ],
    available: true,
    demoUrl: "https://minimalist.notepress.xyz",
  },
  {
    id: "classic",
    name: "Classic",
    price: 3980,
    // price: 0,
    description: "親しみやすいカジュアルなデザイン",
    thumbnail:
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=400&h=300",
    features: [
      "クラシックなレイアウト",
      "充実した記事機能",
      "カテゴリー管理",
      "検索機能",
    ],
    isNew: true,
    available: true,
    demoUrl: "https://classic.notepress.xyz",
  },
];
