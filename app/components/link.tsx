import NextLink from "next/link";
import { ArrowElbowLeftUp } from "@phosphor-icons/react/dist/ssr";

import { classNames } from "../utils/class-names";

const linkClassName =
  "transition-all text-stone-400/60 hover:text-stone-300 flex align-middle relative";

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function InternalLink({
  href,
  children,
  className = "",
  ...props
}: LinkProps) {
  return (
    <NextLink
      href={href}
      className={classNames(linkClassName, className)}
      {...props}
    >
      [{children}]
    </NextLink>
  );
}

// For a file such as rss.xml rather than a page. A plain <a> avoids Next
// trying to prefetch it as a page, and we add the base path ourselves.
export function FileLink({
  href,
  children,
  className = "",
  ...props
}: LinkProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    <a
      href={`${basePath}${href}`}
      className={classNames(linkClassName, className)}
      {...props}
    >
      [{children}]
    </a>
  );
}

export function ExternalLink({
  href,
  children,
  className = "",
  ...props
}: LinkProps) {
  return (
    <a
      href={href}
      rel="noopener noreferrer"
      target="_blank"
      className={classNames(linkClassName, className, "group")}
      {...props}
    >
      [{children}{" "}
      {/* Mirrored arrow: points up and toward the left, away from the text. */}
      <ArrowElbowLeftUp
        weight="bold"
        className="ms-0.5 mt-0.5 group-hover:text-gruvbox-purple"
      />
      ]
    </a>
  );
}
