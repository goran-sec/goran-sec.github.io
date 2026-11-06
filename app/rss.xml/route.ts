import { baseUrl } from "app/sitemap";
import { siteConfig } from "app/site-config";
import { getSortedPosts } from "app/posts/utils";

// Built once into out/rss.xml (GitHub Pages has no server).
export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const itemsXml = getSortedPosts()
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${baseUrl}/posts/${post.slug}</link>
          <category>${escapeXml(post.metadata.category)}</category>
          <description>${escapeXml(post.metadata.summary || "")}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${escapeXml(siteConfig.name)} posts</title>
        <link>${baseUrl}</link>
        <description>${escapeXml(siteConfig.rssDescription)}</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}
