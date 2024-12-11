/* eslint-disable @typescript-eslint/no-explicit-any */
// app/lib/notion.ts
// Notionデータ取得用の関数を改善

const NOTION_API_BASE = "https://notion-api.splitbee.io/v1";

export async function getAllPosts() {
  // テーブルからすべての記事を取得
  const tableId = "14a1dcf229c280138249db57bf38f72e";
  const res = await fetch(`${NOTION_API_BASE}/table/${tableId}`);
  const posts = await res.json();

  return posts
    .filter((post: any) => post.Public) // 公開記事のみ
    .map((post: any) => ({
      id: post.id,
      title: post.Name,
      slug: post.Slug,
      date: post.Published,
      author: post.Author,
      tags: post.Tags,
      description: post.Description,
    }));
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  const post = posts.find((p: { slug: string }) => p.slug === slug);

  if (!post) return null;

  const res = await fetch(`${NOTION_API_BASE}/page/${post.id}`);
  const page = await res.json();

  return {
    ...post,
    content: page,
  };
}
