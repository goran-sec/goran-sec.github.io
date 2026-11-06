import Link from "next/link";

import { RecentPosts } from "app/components/post-list";
import { getPostListItems } from "app/posts/utils";

// ASCII art for the name. Generate a new one for your own name and paste it in.
const ASCII = `
  ▄████  ▒█████   ██▀███   ▄▄▄       ███▄    █
 ██▒ ▀█▒▒██▒  ██▒▓██ ▒ ██▒▒████▄     ██ ▀█   █
▒██░▄▄▄░▒██░  ██▒▓██ ░▄█ ▒▒██  ▀█▄  ▓██  ▀█ ██▒
░▓█  ██▓▒██   ██░▒██▀▀█▄  ░██▄▄▄▄██ ▓██▒  ▐▌██▒
░▒▓███▀▒░ ████▓▒░░██▓ ▒██▒ ▓█   ▓██▒▒██░   ▓██░
 ░▒   ▒ ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒   ▓▒█░░ ▒░   ▒ ▒
  ░   ░   ░ ▒ ▒░   ░▒ ░ ▒░  ▒   ▒▒ ░░ ░░   ░ ▒░
░ ░   ░ ░ ░ ░ ▒    ░░   ░   ░   ▒      ░   ░ ░
      ░     ░ ░     ░           ░  ░         ░
`;

const RECENT_COUNT = 5;

export default function Page() {
  const posts = getPostListItems();
  const recent = posts.slice(0, RECENT_COUNT);

  return (
    <section>
      <div className="mb-8">
        {/* ASCII art must never be mirrored, so it stays left-to-right. */}
        <pre
          dir="ltr"
          className="no-scrollbar mx-auto w-fit text-[0.7rem] leading-[1.25] md:text-base text-gruvbox-lime"
        >
          {ASCII}
        </pre>
      </div>
      {/* Placeholder bio: replace with your own, in English, Kurdish, or both. */}
      <p dir="ltr" className="mb-4 text-sm text-right">
      </p>
      <p dir="rtl" className="mb-4 text-sm text-right">
        بەخێربێن بۆ ماڵپەڕەکەم.
      </p>
      <div className="my-8">
        {/* tracking-normal: letter spacing would pull Kurdish letters apart. */}
        <h2 className="mb-4 text-base font-bold tracking-normal">
          تازەترین پۆست
        </h2>
        <RecentPosts posts={recent} />
        {posts.length > RECENT_COUNT && (
          <Link
            href="/posts"
            className="mt-3 block text-xs uppercase text-stone-400/60 transition-all hover:text-stone-300"
          >
            [all posts]
          </Link>
        )}
      </div>
    </section>
  );
}
