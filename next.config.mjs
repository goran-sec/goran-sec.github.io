// Static export for GitHub Pages: `next build` writes plain files to ./out
// The deploy workflow sets NEXT_PUBLIC_BASE_PATH to "/your-repo-name" for a
// project site, or leaves it empty for username.github.io and custom domains.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  // /posts/ -> posts/index.html, which GitHub Pages serves reliably.
  trailingSlash: true,
  // The image optimizer needs a server, which Pages doesn't have.
  images: { unoptimized: true },
};

export default nextConfig;
