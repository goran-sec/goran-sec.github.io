import React from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import hljs from "highlight.js/lib/core"; // Core library
import rust from "highlight.js/lib/languages/rust"; // Rust support
import c from "highlight.js/lib/languages/c"; // C support
import typescript from "highlight.js/lib/languages/typescript"; // TS support
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml"; // also covers html
import yaml from "highlight.js/lib/languages/yaml";

import { detectNodeDir, nodeText } from "app/utils/bidi";
// Images in posts open large when clicked (see post-image.tsx).
import { PostImage } from "./post-image";

// Register languages with highlight.js
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("c", c);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

// Code is always left-to-right. dir="ltr" also isolates inline code, so it
// can't scramble the Kurdish text around it.
function Code({ children, ...props }) {
  return (
    <code
      dir="ltr"
      className="text-gruvbox-lime bg-neutral-800 p-[2px]"
      {...props}
    >
      {children}
    </code>
  );
}

function Pre(props) {
  return <pre dir="ltr" {...props} />;
}

// Each text block gets the direction of its own language, so a Kurdish
// paragraph is RTL and an English one is LTR (both stay right-aligned: see
// global.css). The page itself is RTL, which keeps lists and quotes on the right.
function Paragraph(props) {
  return <p {...props} dir={detectNodeDir(props.children)} />;
}

function Blockquote(props) {
  return <blockquote {...props} dir={detectNodeDir(props.children)} />;
}

function UnorderedList(props) {
  return <ul {...props} dir="rtl" />;
}

function OrderedList(props) {
  return <ol {...props} dir="rtl" />;
}

// The list stays RTL so bullets sit on the right; the text inside gets its own direction.
function ListItem({ children, ...props }) {
  return (
    <li {...props} dir="rtl">
      <div dir={detectNodeDir(children)} className="list-text">
        {children}
      </div>
    </li>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\p{L}\p{N}\-]+/gu, "") // Keep letters/numbers in any script (Kurdish too)
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(nodeText(children));
    return React.createElement(
      `h${level}`,
      { id: slug || undefined, dir: detectNodeDir(children) },
      slug
        ? [
            React.createElement("a", {
              href: `#${slug}`,
              key: `link-${slug}`,
              className: "anchor",
            }),
          ]
        : null,
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

let components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: Paragraph,
  blockquote: Blockquote,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  pre: Pre,
  Image: PostImage,
  img: PostImage,
  a: CustomLink,
  code: Code,
  Table,
};

export function CustomMDX(props) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          // ignoreMissing: an unknown language name shows plain code instead of failing the build.
          rehypePlugins: [[rehypeHighlight, { hljs, ignoreMissing: true }]],
        },
      }}
    />
  );
}
