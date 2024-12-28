export const templateCategories = [
  { id: "all", name: "すべて" },
  { id: "free", name: "無料" },
  { id: "premium", name: "プレミアム" },
];

export const templates = [
  {
    id: "minimalist",
    name: "Minimalist",
    description: "シンプルで読みやすい、ミニマルなブログデザイン",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=300",
    price: "無料",
    status: "ready" as const,
    featured: true,
    tags: ["シンプル", "無料", "ブログ"],
    demoUrl: "https://minimalist.notepress.xyz",
  },
  {
    id: "classic",
    name: "Classic",
    description: "親しみやすいカジュアルなデザイン",
    image:
      "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=400&h=300",
    price: "¥4,980",
    status: "coming_soon" as const,
    featured: true,
    tags: ["クラシック", "プレミアム", "ビジネス"],
    demoUrl: "#",
  },
];
