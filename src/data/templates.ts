export const templateCategories = [
  { id: 'all', name: 'すべて' },
  { id: 'free', name: '無料' },
  { id: 'premium', name: 'プレミアム' },
];

export const templates = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'シンプルで読みやすい、ミニマルなブログデザイン',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400&h=300',
    price: '無料',
    status: 'ready' as const,
    featured: true,
    tags: ['シンプル', '無料', 'ブログ'],
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: '雑誌のようなレイアウトで記事を魅力的に表示',
    image: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?auto=format&fit=crop&q=80&w=400&h=300',
    price: '¥4,980',
    status: 'coming_soon' as const,
    tags: ['マガジン', 'プレミアム', 'メディア'],
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: '作品や実績を効果的に展示するためのデザイン',
    image: 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?auto=format&fit=crop&q=80&w=400&h=300',
    price: '¥4,980',
    status: 'coming_soon' as const,
    tags: ['ポートフォリオ', 'プレミアム', '作品展示'],
  }
]; 