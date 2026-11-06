import fs from "fs";
import path from "path";

import { detectDir, type Direction } from "app/utils/bidi";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  category: string;
  // Language of the post, e.g. "en" or "ckb" (Sorani Kurdish). Optional.
  lang?: string;
  image?: string;
};

export const UNCATEGORIZED = "Uncategorized";

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  if (!metadata.category) {
    metadata.category = UNCATEGORIZED;
  }

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "content", "posts"));
}

export function getSortedPosts() {
  return getBlogPosts().sort((a, b) =>
    new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt) ? -1 : 1
  );
}

/** The plain data the list components need (safe to send to the browser). */
export type PostListItem = {
  slug: string;
  title: string;
  titleDir: Direction;
  category: string;
  categoryDir: Direction;
  date: string;
};

export function getPostListItems(): PostListItem[] {
  return getSortedPosts().map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    titleDir: detectDir(post.metadata.title),
    category: post.metadata.category,
    categoryDir: detectDir(post.metadata.category),
    date: formatDate(post.metadata.publishedAt, false),
  }));
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);
  const day = targetDate.getDate().toString().padStart(2, "0");
  const month = targetDate
    .toLocaleString("en-us", { month: "short" })
    .toUpperCase();
  const year = targetDate.getFullYear().toString().slice(-2);
  const fullDate = `${day}-${month}-${year}`;
  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  if (daysAgo < 0) {
    monthsAgo -= 1;
    daysAgo += new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
  }
  if (monthsAgo < 0) {
    yearsAgo -= 1;
    monthsAgo += 12;
  }

  let formattedRelative = "";
  if (yearsAgo > 0) {
    formattedRelative = `${yearsAgo}Y AGO`;
  } else if (monthsAgo > 0) {
    formattedRelative = `${monthsAgo}M AGO`;
  } else if (daysAgo > 0) {
    formattedRelative = `${daysAgo}D AGO`;
  } else {
    formattedRelative = "TODAY";
  }

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedRelative})`;
}
