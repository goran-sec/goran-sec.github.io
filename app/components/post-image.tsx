"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";

// On a GitHub Pages project site the address starts with /repo-name, so
// images stored in public/ (written as "/images/photo.jpg") need that prefix.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function withBasePath(src: unknown) {
  if (typeof src === "string" && src.startsWith("/") && !src.startsWith("//")) {
    return `${basePath}${src}`;
  }
  return src as string;
}

// How much bigger than its real size a small picture may be shown.
const MAX_ENLARGE = 3;

/**
 * An image inside a post. Click (or press Enter on) it to open it large on a
 * dark screen; click anywhere, press Esc, or use the close button to go back.
 *
 * Used for both  ![alt](/images/photo.jpg)  and  <Image src="..." alt="..." />.
 */
export function PostImage({
  src,
  alt = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [open, setOpen] = useState(false);
  // Real size of the picture, read when it is opened.
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const url = withBasePath(src);

  const openLightbox = () => {
    const el = imgRef.current;
    setNatural(
      el && el.naturalWidth > 0
        ? { w: el.naturalWidth, h: el.naturalHeight }
        : null
    );
    setOpen(true);
  };

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the page behind doesn't scroll
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Fit the screen, never more than MAX_ENLARGE times the real size, so a small
  // picture gets bigger without turning into a blur.
  const bigStyle: React.CSSProperties = natural
    ? {
        width: `min(96vw, calc(92vh * ${natural.w / natural.h}), ${
          natural.w * MAX_ENLARGE
        }px)`,
        aspectRatio: `${natural.w} / ${natural.h}`,
      }
    : { maxWidth: "96vw", maxHeight: "92vh" };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="post-image-btn"
        onClick={openLightbox}
        aria-label={alt ? `${alt} (enlarge)` : "Enlarge image"}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          {...props}
        />
      </button>
      {open &&
        createPortal(
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Image"}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              className="lightbox-close"
              aria-label="Close"
              onClick={close}
            >
              <X weight="bold" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={alt} style={bigStyle} />
          </div>,
          document.body
        )}
    </>
  );
}
