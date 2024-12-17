/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(templates)/minimalist/page.tsx
import { getAllPosts } from "@/lib/notion";

export default async function MinimalistBlog() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="space-y-12">
        {posts.map((post: any) => (
          <article key={post.id} className="space-y-2">
            <time className="text-gray-500">{post.date}</time>
            <h2 className="text-2xl font-bold hover:text-gray-600">
              <a href={`minimalist/post/${post.slug}`}>{post.title}</a>
            </h2>
            {post.description && (
              <p className="text-gray-600">{post.description}</p>
            )}
            {post.tags && (
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}