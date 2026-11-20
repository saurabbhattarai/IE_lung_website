import { Node, mergeAttributes } from "@tiptap/core";

export type CalloutVariant = "info" | "warning";

export interface CalloutOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attributes?: {
        variant?: CalloutVariant;
        type?: CalloutVariant;
      }) => ReturnType;
      toggleCallout: (attributes?: {
        variant?: CalloutVariant;
        type?: CalloutVariant;
      }) => ReturnType;
      unsetCallout: () => ReturnType;
    };
  }
}

/**
 * Custom Callout Extension for Tiptap.
 *
 * Supports informational and warning medical callouts.
 * Serializes both `variant` and `type` attributes in JSON for 100% backward
 * compatibility with initial blog seed data and future CMS article storage.
 */
export const Callout = Node.create<CalloutOptions>({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      variant: {
        default: "info",
        parseHTML: (element) =>
          element.getAttribute("data-variant") ||
          element.getAttribute("data-type") ||
          "info",
        renderHTML: (attributes) => {
          const val = attributes.variant || attributes.type || "info";
          return { "data-variant": val };
        },
      },
      type: {
        default: "info",
        parseHTML: (element) =>
          element.getAttribute("data-type") ||
          element.getAttribute("data-variant") ||
          "info",
        renderHTML: (attributes) => {
          const val = attributes.type || attributes.variant || "info";
          return { "data-type": val };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="callout"]',
      },
      {
        tag: "div[data-variant]",
      },
      {
        tag: "div[data-callout]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const variant = (node.attrs.variant || node.attrs.type || "info") as CalloutVariant;
    const isWarning = variant === "warning";

    const baseClasses = isWarning
      ? "callout callout-warning bg-red-50/90 border border-red-200/90 text-red-950 rounded-2xl p-5 my-6 shadow-xs"
      : "callout callout-info bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 rounded-2xl p-5 my-6 shadow-xs";

    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "callout",
        "data-variant": variant,
        class: baseClasses,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setCallout:
        (attributes) =>
        ({ commands }) => {
          const variant = attributes?.variant || attributes?.type || "info";
          return commands.setNode(this.name, { variant, type: variant });
        },
      toggleCallout:
        (attributes) =>
        ({ commands }) => {
          const variant = attributes?.variant || attributes?.type || "info";
          return commands.toggleWrap(this.name, { variant, type: variant });
        },
      unsetCallout:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },
});
