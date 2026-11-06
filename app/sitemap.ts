import { getBlogPosts } from "app/posts/utils";

// Set NEXT_PUBLIC_SITE_URL when you deploy (e.g. https://yourname.com).
export const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const dynamic = "force-static";

export default async function sitemap() {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  let routes = ["", "/posts"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
