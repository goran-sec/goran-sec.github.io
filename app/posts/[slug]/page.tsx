import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { formatDate, getBlogPosts } from "app/posts/utils";
import { baseUrl } from "app/sitemap";
import { siteConfig } from "app/site-config";
import { detectDir } from "app/utils/bidi";

type BlogRouteParams = { slug: string };
type BlogPageProps = { params: Promise<BlogRouteParams> };

// Only the posts that exist are built; anything else is the 404 page.
export const dynamicParams = false;

export async function generateStaticParams() {
  let posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps) {
  let { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);
  if (!post) {
    return {};
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? image : `${baseUrl}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/posts/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({ params }: BlogPageProps) {
  let { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  const { title, category, lang } = post.metadata;

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            articleSection: category,
            inLanguage: lang,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og.png`,
            url: `${baseUrl}/posts/${post.slug}`,
            author: {
              "@type": "Person",
              name: siteConfig.displayName,
            },
          }),
        }}
      />
      <div className="mb-2 flex flex-row items-baseline gap-3 text-xs">
        <Link
          href={`/posts?category=${encodeURIComponent(category)}`}
          dir={detectDir(category)}
          className="text-gruvbox-lime hover:underline"
        >
          {category}
        </Link>
        <span dir="ltr" className="tabular-nums text-stone-300/60">
          {formatDate(post.metadata.publishedAt)}
        </span>
      </div>
      <h1
        dir={detectDir(title)}
        lang={lang}
        className="title text-right font-semibold text-2xl tracking-tighter"
      >
        {title}
      </h1>
      <article className="prose mt-8" lang={lang}>
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
