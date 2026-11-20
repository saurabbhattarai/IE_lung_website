"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Info,
  AlertTriangle,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Callout } from "./CalloutExtension";
import LinkModal from "./LinkModal";
import ImageAltModal from "./ImageAltModal";
import {
  createEmptyTiptapDoc,
  isSafeUrl,
  isTiptapDocEmpty,
  validateMediaUploadResponse,
} from "./editor-utils";

export interface BlogContentEditorProps {
  initialContent?: JSONContent | null;
  onChange?: (content: JSONContent) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function BlogContentEditor({
  initialContent,
  onChange,
  disabled = false,
  className = "",
}: BlogContentEditorProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState("");
  const [isAltModalOpen, setIsAltModalOpen] = useState(false);
  const [currentImageAttrs, setCurrentImageAttrs] = useState<{ src: string; alt: string }>({ src: "", alt: "" });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastEmittedJsonRef = useRef<string>("");
  const prevInitialContentRef = useRef<JSONContent | null | undefined>(initialContent);

  // Clear notifications after 5 seconds
  useEffect(() => {
    if (statusNotification) {
      const timer = setTimeout(() => setStatusNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusNotification]);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3], // Strictly H2 and H3, NO H1
        },
        link: false, // Explicitly configure custom Link extension below
        underline: false, // Explicitly configure custom Underline extension below
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6 my-4 space-y-1",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-6 my-4 space-y-1",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-slate-300 pl-4 py-1 italic text-slate-700 my-4",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "border-t border-slate-200 my-8",
          },
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: false,
        defaultProtocol: "https",
        protocols: ["http", "https", "mailto"],
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-[#00A389] font-medium underline underline-offset-2 hover:text-[#00826e] transition-colors",
        },
        validate: (href) => isSafeUrl(href),
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-xl border border-slate-200 max-w-full h-auto my-6 mx-auto block shadow-xs",
        },
      }),
      Callout,
    ],
    content: initialContent || createEmptyTiptapDoc(),
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[380px] p-6 text-slate-800 leading-relaxed font-sans",
      },
    },
    onUpdate({ editor }) {
      const json = editor.getJSON();
      lastEmittedJsonRef.current = JSON.stringify(json);
      onChange?.(json);
    },
  });

  // Synchronize editor content when initialContent changes from outside
  // (e.g. loading an article, switching posts, or resetting the form)
  useEffect(() => {
    if (!editor) return;

    const prev = prevInitialContentRef.current;
    if (prev === initialContent) {
      return; // Reference identical: pure parent re-render, preserve user's unsaved edits
    }
    prevInitialContentRef.current = initialContent;

    // If initialContent is explicitly cleared or nullish (e.g. form reset), reset to empty document
    if (!initialContent) {
      if (!isTiptapDocEmpty(editor.getJSON())) {
        const emptyDoc = createEmptyTiptapDoc();
        lastEmittedJsonRef.current = JSON.stringify(emptyDoc);
        editor.commands.setContent(emptyDoc);
      }
      return;
    }

    // If initialContent changed to a new document (e.g. user selected another blog post)
    const incomingSerialized = JSON.stringify(initialContent);
    if (incomingSerialized !== lastEmittedJsonRef.current) {
      lastEmittedJsonRef.current = incomingSerialized;
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // Sync disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  // Handle Link Dialog
  const handleOpenLinkModal = useCallback(() => {
    if (!editor) return;
    const existingUrl = editor.getAttributes("link").href || "";
    setCurrentLinkUrl(existingUrl);
    setIsLinkModalOpen(true);
  }, [editor]);

  const handleSaveLink = useCallback(
    (url: string) => {
      if (!editor) return;
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    },
    [editor]
  );

  const handleRemoveLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  // Handle Cloudinary Image Upload
  const handleImageButtonClick = () => {
    if (fileInputRef.current && !isUploadingImage && !disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    // Reset input so re-uploading the same file still triggers onChange
    e.target.value = "";

    // 1. Client-Side Size Pre-Check (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatusNotification({
        type: "error",
        message: `File exceeds the 5 MB limit (actual: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
      });
      return;
    }

    // 2. Client-Side Allowed Format Pre-Check
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setStatusNotification({
        type: "error",
        message: "Only JPEG, PNG, WebP, and AVIF images are supported.",
      });
      return;
    }

    setIsUploadingImage(true);
    setStatusNotification(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `Upload failed with status ${response.status}`);
      }

      // Validate response structure, strict HTTPS, Cloudinary host, and dimensions
      const validatedMedia = validateMediaUploadResponse(data);

      // Insert verified Cloudinary HTTPS image into Tiptap editor
      const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      editor
        .chain()
        .focus()
        .setImage({
          src: validatedMedia.secure_url,
          alt: altText,
        })
        .run();

      setStatusNotification({
        type: "success",
        message: "Image uploaded and inserted successfully.",
      });
    } catch (err) {
      setStatusNotification({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!editor) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin text-[#00A389]" />
          <span>Initializing editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-100 ${className}`}
    >
      {/* Hidden File Input for Cloudinary Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
        disabled={disabled || isUploadingImage}
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/80 px-3 py-2 text-slate-600">
        {/* History Controls */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo() || disabled}
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
            className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo() || disabled}
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
            className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Structure / Heading Controls (NO H1 per guidelines) */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            disabled={disabled}
            title="Paragraph"
            aria-label="Paragraph"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("paragraph")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Pilcrow className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={disabled}
            title="Heading 2"
            aria-label="Heading 2"
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-slate-200 text-slate-900"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Heading2 className="w-4 h-4" />
            <span>H2</span>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={disabled}
            title="Heading 3"
            aria-label="Heading 3"
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              editor.isActive("heading", { level: 3 })
                ? "bg-slate-200 text-slate-900"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Heading3 className="w-4 h-4" />
            <span>H3</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Inline Formatting */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={disabled}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bold")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={disabled}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("italic")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={disabled}
            title="Underline (Ctrl+U)"
            aria-label="Underline"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("underline")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={disabled}
            title="Bullet List"
            aria-label="Bullet List"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("bulletList")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={disabled}
            title="Numbered List"
            aria-label="Numbered List"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("orderedList")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            disabled={disabled}
            title="Blockquote"
            aria-label="Blockquote"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("blockquote")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            disabled={disabled}
            title="Horizontal Divider"
            aria-label="Horizontal Divider"
            className="p-1.5 rounded-lg hover:bg-slate-200/70 hover:text-slate-900 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Medical Callout Extensions */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleCallout({ variant: "info" }).run()
            }
            disabled={disabled}
            title="Info Callout"
            aria-label="Info Callout"
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              editor.isActive("callout", { variant: "info" })
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Info</span>
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleCallout({ variant: "warning" }).run()
            }
            disabled={disabled}
            title="Warning / Emergency Callout"
            aria-label="Warning Callout"
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
              editor.isActive("callout", { variant: "warning" })
                ? "bg-red-100 text-red-900 border border-red-300"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span className="hidden sm:inline">Warning</span>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1" aria-hidden="true" />

        {/* Link & Media */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={handleOpenLinkModal}
            disabled={disabled}
            title="Insert or Edit Link"
            aria-label="Link"
            className={`p-1.5 rounded-lg transition-colors ${
              editor.isActive("link")
                ? "bg-[#00A389]/15 text-[#00A389] font-semibold"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleImageButtonClick}
            disabled={disabled || isUploadingImage}
            title="Upload and Insert Image (JPEG, PNG, WebP, AVIF)"
            aria-label="Upload Image"
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isUploadingImage
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "hover:bg-slate-200/70 hover:text-slate-900"
            }`}
          >
            {isUploadingImage ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00A389]" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline">Image</span>
              </>
            )}
          </button>

          {/* Edit Alt Text Button when an image is selected */}
          {editor.isActive("image") && (
            <button
              type="button"
              onClick={() => {
                const attrs = editor.getAttributes("image");
                setCurrentImageAttrs({
                  src: (attrs.src as string) || "",
                  alt: (attrs.alt as string) || "",
                });
                setIsAltModalOpen(true);
              }}
              disabled={disabled}
              title="Edit image alternative description (alt text)"
              aria-label="Edit Image Alt Text"
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#00A389]/15 text-[#00A389] hover:bg-[#00A389]/25 transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#00A389]" />
              <span>Edit Alt Text</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Notification Banner */}
      {statusNotification && (
        <div
          className={`flex items-center justify-between px-4 py-2 text-xs font-medium border-b transition-all ${
            statusNotification.type === "error"
              ? "bg-red-50 text-red-800 border-red-200"
              : "bg-emerald-50 text-emerald-800 border-emerald-200"
          }`}
          role="status"
        >
          <div className="flex items-center gap-2">
            {statusNotification.type === "error" ? (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            )}
            <span>{statusNotification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotification(null)}
            className="text-slate-400 hover:text-slate-700 ml-4"
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        initialUrl={currentLinkUrl}
        onSave={handleSaveLink}
        onRemove={handleRemoveLink}
        onClose={() => setIsLinkModalOpen(false)}
      />

      {/* Image Alt Text Modal */}
      <ImageAltModal
        isOpen={isAltModalOpen}
        initialAlt={currentImageAttrs.alt}
        imageSrc={currentImageAttrs.src}
        onSave={(newAlt) => {
          editor.chain().focus().updateAttributes("image", { alt: newAlt.slice(0, 500) }).run();
          setStatusNotification({
            type: "success",
            message: "Image alt text updated.",
          });
        }}
        onClose={() => setIsAltModalOpen(false)}
      />
    </div>
  );
}
