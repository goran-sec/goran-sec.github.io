"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InternalLink } from "app/components/link";

import { Logo } from "./logo";

const NAV_ITEMS = {
  "/": {
    name: "سەرەکی",
  },
  "/posts": {
    name: "پۆستەکان",
  },
};

export function Navbar() {
  const pathname = usePathname();

  // Home and Posts use the same Kurdish names as the tabs; other segments
  // (a post's address) stay as they are, in capitals.
  const SEGMENT_NAMES: Record<string, string> = {
    posts: NAV_ITEMS["/posts"].name,
  };

  const getBreadcrumb = () => {
    const segments = pathname.split("/").filter(Boolean);

    const names =
      segments.length === 0
        ? [NAV_ITEMS["/"].name]
        : segments.map((segment) => {
            let readable = segment;
            try {
              readable = decodeURIComponent(segment);
            } catch {}
            return (
              SEGMENT_NAMES[readable] ??
              readable.toUpperCase().replace(/ /g, "-")
            );
          });

    // Each name is isolated (<bdi>) so a Kurdish name next to an English one
    // can't swap places or flip the slashes.
    return (
      <>
        ~
        {names.map((name, index) => (
          <span key={index}>
            /<bdi>{name}</bdi>
          </span>
        ))}
      </>
    );
  };

  return (
    <aside className="mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20 space-y-4">
        {/* Link (not <a>) so the base path is added on a project site. */}
        <Link href="/" className="block w-fit">
          <Logo className="-me-1" />
        </Link>
        <nav
          className="flex flex-row items-start relative fade md:overflow-auto scroll-pe-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row uppercase w-full justify-between items-center text-sm">
            {/* In RTL the first item sits on the right edge. */}
            <div className="flex flex-row gap-2">
              {Object.entries(NAV_ITEMS).map(([path, { name }]) => (
                <InternalLink
                  key={path}
                  href={path}
                  className={
                    pathname === path ||
                    (path !== "/" && pathname.startsWith(path))
                      ? "font-bold !text-gruvbox-orange"
                      : ""
                  }
                >
                  {name}
                </InternalLink>
              ))}
            </div>
            {/* A path always reads left-to-right, so isolate it. */}
            <span
              dir="ltr"
              className="flex align-middle relative text-gruvbox-lime text-xs"
            >
              {getBreadcrumb()}
            </span>
          </div>
        </nav>
      </div>
    </aside>
  );
}
