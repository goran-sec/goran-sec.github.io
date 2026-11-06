"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { File } from "@phosphor-icons/react";

import type { PostListItem } from "app/posts/utils";
import { classNames } from "app/utils/class-names";

const ALL = "__all__";

/**
 * One row per post, aligned to the right edge of the page.
 * Reading from the right: file icon, category, date, title.
 *
 * The layout lives in global.css (.post-rows / .post-row). On a wide screen
 * every row shares the same three columns, so the category, date and title
 * line up from one row to the next. On a phone the title drops to its own line.
 */
function PostRow({ post }: { post: PostListItem }) {
  return (
    <Link href={`/posts/${post.slug}`} className="post-row group text-xs">
      <span className="post-cat">
        <File weight="bold" className="text-gruvbox-orange" />
        <span dir={post.categoryDir} className="text-gruvbox-lime">
          {post.category}
        </span>
      </span>
      <span dir="ltr" className="post-date tabular-nums text-stone-300/60">
        {post.date}
      </span>
      <span
        dir={post.titleDir}
        className="post-title tracking-tight decoration-stone-300 decoration-[0.05em] group-hover:underline"
      >
        {post.title}
      </span>
    </Link>
  );
}

function Rows({ posts }: { posts: PostListItem[] }) {
  return (
    <div className="post-rows border-1 border-stone-500/20 bg-neutral-900 p-2">
      {posts.map((post) => (
        <PostRow key={post.slug} post={post} />
      ))}
    </div>
  );
}

/** Home page: just the latest few, no filters. */
export function RecentPosts({ posts }: { posts: PostListItem[] }) {
  return <Rows posts={posts} />;
}

/** Posts page: filter tabs by category + the list. */
export function PostsBrowser({ posts }: { posts: PostListItem[] }) {
  const [active, setActive] = useState(ALL);

  // Categories in the order they first appear (newest posts first).
  const categories: { name: string; dir: PostListItem["categoryDir"] }[] = [];
  for (const post of posts) {
    if (!categories.some((c) => c.name === post.category)) {
      categories.push({ name: post.category, dir: post.categoryDir });
    }
  }

  // Let /posts?category=Name open on a given tab.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category");
    if (fromUrl && categories.some((c) => c.name === fromUrl)) {
      setActive(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = (value: string) => {
    setActive(value);
    const url = new URL(window.location.href);
    if (value === ALL) {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", value);
    }
    window.history.replaceState(null, "", url);
  };

  const visible =
    active === ALL ? posts : posts.filter((p) => p.category === active);

  const tabClass = (isActive: boolean) =>
    classNames(
      "flex cursor-pointer gap-1 text-xs uppercase transition-all",
      isActive
        ? "font-bold text-gruvbox-orange"
        : "text-stone-400/60 hover:text-stone-300"
    );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Categories"
        className="mb-4 flex flex-wrap gap-x-3 gap-y-2"
      >
        <button
          role="tab"
          aria-selected={active === ALL}
          onClick={() => select(ALL)}
          className={tabClass(active === ALL)}
        >
          <span dir="ltr">[all]</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.name}
            role="tab"
            aria-selected={active === category.name}
            onClick={() => select(category.name)}
            className={tabClass(active === category.name)}
          >
            <span dir={category.dir}>[{category.name}]</span>
          </button>
        ))}
      </div>
      <Rows posts={visible} />
    </div>
  );
}
