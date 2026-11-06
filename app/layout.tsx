import "./global.css";
import type { Metadata } from "next";
// Fonts are self-hosted (no request to Google when someone visits).
// Sometype Mono: Latin letters and digits, the monospace look of the original.
// Noto Sans Arabic: Arabic-script letters, including the Sorani Kurdish ones.
import "@fontsource-variable/sometype-mono";
import "@fontsource-variable/noto-sans-arabic";

import { baseUrl } from "./sitemap";
import { siteConfig } from "./site-config";
import { Navbar } from "./components/nav";
import Footer from "./components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `Index | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: "",
  openGraph: {
    title: siteConfig.name,
    description: "",
    url: baseUrl,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // dir="rtl": the whole page flows from the right. Individual texts set
    // their own direction (see app/utils/bidi.ts) so English stays correct.
    <html
      lang="en"
      dir="rtl"
      className="!bg-neutral-950"
    >
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto font-mono bg-neutral-950">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0 bg-neutral-950">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
