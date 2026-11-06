import React from "react";

// Arabic-script letters (covers Sorani Kurdish: ڕ ڵ ۆ ێ ە etc.)
const RTL_LETTER =
  /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g;
const LTR_LETTER = /[A-Za-zÀ-ɏ]/g;

export type Direction = "rtl" | "ltr";

/**
 * Picks the base direction for a piece of text by counting letters of each
 * script. Ties (and text with no letters) go to RTL, because the whole site is
 * RTL. This is more reliable than the browser's `dir="auto"`, which only looks
 * at the first strong character and so mis-handles a Kurdish sentence that
 * starts with an English word.
 */
export function detectDir(text: string): Direction {
  const rtl = (text.match(RTL_LETTER) || []).length;
  const ltr = (text.match(LTR_LETTER) || []).length;
  return ltr > rtl ? "ltr" : "rtl";
}

/** Collects the plain text of a React children tree. */
export function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(nodeText).join("");
  }
  if (React.isValidElement(node)) {
    return nodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

export function detectNodeDir(node: React.ReactNode): Direction {
  return detectDir(nodeText(node));
}
