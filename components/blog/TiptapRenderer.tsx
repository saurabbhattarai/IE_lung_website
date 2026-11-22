import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: TiptapMark[];
}

interface TiptapRendererProps {
  content: unknown;
  className?: string;
}

/**
 * Renders inline text leaf nodes with formatting marks (bold, italic, underline, link).
 */
function renderInlineNode(node: TiptapNode, key: number | string): React.ReactNode {
  if (node.type === "text" && typeof node.text === "string") {
    let element: React.ReactNode = node.text;

    if (Array.isArray(node.marks) && node.marks.length > 0) {
      for (const mark of node.marks) {
        if (mark.type === "bold") {
          element = <strong>{element}</strong>;
        } else if (mark.type === "italic") {
          element = <em>{element}</em>;
        } else if (mark.type === "underline") {
          element = <u>{element}</u>;
        } else if (mark.type === "link") {
          const href = (mark.attrs?.href as string) || "#";
          const isExternal = href.startsWith("http://") || href.startsWith("https://");
          if (isExternal) {
            element = (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:opacity-80 transition-opacity"
              >
                {element}
              </a>
            );
          } else {
            element = (
              <Link
                href={href}
                className="text-accent underline hover:opacity-80 transition-opacity"
              >
                {element}
              </Link>
            );
          }
        }
      }
    }

    return <React.Fragment key={key}>{element}</React.Fragment>;
  }

  return null;
}

/**
 * Recursively renders block and inline Tiptap nodes into semantic, styled HTML.
 */
function renderBlockNode(node: TiptapNode, key: number | string): React.ReactNode {
  if (!node || typeof node !== "object") return null;

  const nodeType = node.type || "paragraph";
  const children = Array.isArray(node.content)
    ? node.content.map((child, i) =>
        child.type === "text"
          ? renderInlineNode(child, i)
          : renderBlockNode(child, i)
      )
    : null;

  switch (nodeType) {
    case "doc":
      return (
        <div key={key} className="tiptap-doc-body">
          {children}
        </div>
      );

    case "paragraph":
      return (
        <p
          key={key}
          className="text-lg text-primary/70 leading-relaxed mb-6"
        >
          {children && children.length > 0 ? children : "\u00A0"}
        </p>
      );

    case "heading": {
      const level = Number(node.attrs?.level) || 2;
      if (level === 2) {
        return (
          <h2
            key={key}
            className="text-2xl md:text-3xl font-bold text-primary mb-6 mt-12"
          >
            {children}
          </h2>
        );
      }
      if (level === 3) {
        return (
          <h3
            key={key}
            className="text-xl font-bold text-primary mb-4 mt-8"
          >
            {children}
          </h3>
        );
      }
      return (
        <h4
          key={key}
          className="text-lg font-bold text-primary mb-3 mt-6"
        >
          {children}
        </h4>
      );
    }

    case "callout": {
      const variant = (node.attrs?.type || node.attrs?.variant || "info") as string;
      const isWarning = variant === "warning";

      if (isWarning) {
        return (
          <div
            key={key}
            className="bg-red-50 border border-red-200 rounded-2xl p-5 my-6 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-red-800 text-sm leading-relaxed flex-1 space-y-2">
              {children}
            </div>
          </div>
        );
      }

      // Default info callout
      return (
        <div
          key={key}
          className="bg-accent/5 border-2 border-accent/20 rounded-2xl p-6 my-8 space-y-2 text-primary/80"
        >
          {children}
        </div>
      );
    }

    case "bulletList":
      return (
        <ul key={key} className="space-y-2 mb-6 list-none pl-0">
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} className="list-decimal list-outside pl-6 space-y-2 mb-6 text-primary/70">
          {children}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className="flex items-start gap-2 text-primary/70">
          <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0 mt-2.5" />
          <div className="flex-1 leading-relaxed">{children}</div>
        </li>
      );

    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-accent pl-4 italic text-primary/80 my-6"
        >
          {children}
        </blockquote>
      );

    case "horizontalRule":
      return <hr key={key} className="border-slate-200 my-8" />;

    case "image": {
      const src = (node.attrs?.src as string) || "";
      const alt = (node.attrs?.alt as string) || "Article Image";
      if (!src) return null;

      return (
        <div
          key={key}
          className="my-8 rounded-2xl overflow-hidden flex justify-center bg-slate-50 border border-slate-200 p-4"
        >
          <Image
            src={src}
            alt={alt}
            width={700}
            height={400}
            className="rounded-xl object-contain max-h-[500px] w-auto"
          />
        </div>
      );
    }

    default:
      return (
        <div key={key} className="text-primary/70 mb-4">
          {children}
        </div>
      );
  }
}

/**
 * Server Component that transforms a stored Tiptap JSON document tree
 * into accessible, semantic HTML matching the IE Lung design system.
 */
export default function TiptapRenderer({ content, className }: TiptapRendererProps) {
  if (!content || typeof content !== "object") {
    return null;
  }

  const rootNode = content as TiptapNode;
  if (rootNode.type !== "doc" || !Array.isArray(rootNode.content)) {
    return null;
  }

  return (
    <div className={`prose-content ${className || ""}`}>
      {rootNode.content.map((node, i) => renderBlockNode(node, i))}
    </div>
  );
}
