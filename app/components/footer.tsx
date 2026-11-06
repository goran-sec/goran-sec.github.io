import { ExternalLink, FileLink, InternalLink } from "app/components/link";
import { siteConfig } from "app/site-config";

const FOOTER_ITEMS = [
  {
    href: `mailto:${siteConfig.email}?subject=Hello`,
    children: "email",
    Component: InternalLink,
  }
];

export default function Footer() {
  return (
    <footer className="mb-16">
      <ul className="mt-8 flex flex-col gap-2 uppercase md:flex-row md:gap-3">
        {FOOTER_ITEMS.map(({ href, children, Component }) => (
          <li key={href}>
            <Component href={href} className="text-xs">
              {children}
            </Component>
          </li>
        ))}
      </ul>
      <p dir="ltr" className="mt-2 text-xs uppercase !text-stone-400/60">
        © {new Date().getFullYear()} {siteConfig.displayName}
      </p>
    </footer>
  );
}
