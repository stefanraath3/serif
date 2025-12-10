"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";
import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { cn } from "@/lib/utils";

export interface TipTapEditorRef {
  focus: () => void;
}

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  (
    {
      content,
      onChange,
      placeholder = "Write your post content here...",
      className,
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    // #region agent log - force re-render state
    const [, forceRender] = useState(0);
    // #endregion

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        LinkExtension.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-primary underline",
          },
        }),
        ImageExtension.configure({
          HTMLAttributes: {
            class: "max-w-full rounded-lg",
          },
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      // Fix: Force re-render on selection/storedMarks changes for toolbar state
      onSelectionUpdate: () => {
        forceRender((n) => n + 1);
        // #region agent log
        fetch(
          "http://127.0.0.1:7243/ingest/ce75b66a-92eb-4bba-bdcd-9e0d58fc8a1a",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "tiptap-editor.tsx:onSelectionUpdate",
              message: "Selection updated - forcing re-render",
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "post-fix",
            }),
          }
        ).catch(() => {});
        // #endregion
      },
      editorProps: {
        attributes: {
          class: cn(
            "focus:outline-none min-h-[300px] prose prose-lg prose-serif max-w-none dark:prose-invert",
            // Custom Typography overrides for cleaner look
            "[&_h1]:mt-8 [&_h1]:mb-4",
            "[&_h2]:mt-8 [&_h2]:mb-4",
            "[&_p]:mb-4 [&_p]:leading-relaxed",
            "[&_ul]:list-disc [&_ul]:pl-6",
            "[&_ol]:list-decimal [&_ol]:pl-6",
            "[&_img]:rounded-xl [&_img]:my-8",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/50 [&_blockquote]:pl-6 [&_blockquote]:italic"
          ),
        },
      },
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus("start");
      },
    }));

    const handleImageUpload = async () => {
      const input = fileInputRef.current;
      if (!input || !editor) return;

      input.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const result = await uploadImage(file);
      if (result.success) {
        editor.chain().focus().setImage({ src: result.url }).run();
      } else {
        alert(result.error);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const setLink = () => {
      if (!editor) return;

      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      if (url === null) {
        return;
      }

      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    };

    if (!editor) {
      return null;
    }

    // #region agent log
    const handleBoldClick = () => {
      const beforeActive = editor.isActive("bold");
      const beforeStoredMarks = editor.state.storedMarks;
      const result = editor.chain().focus().toggleBold().run();
      const afterActive = editor.isActive("bold");
      const afterStoredMarks = editor.state.storedMarks;
      fetch(
        "http://127.0.0.1:7243/ingest/ce75b66a-92eb-4bba-bdcd-9e0d58fc8a1a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "tiptap-editor.tsx:handleBoldClick",
            message: "Bold button clicked",
            data: {
              beforeActive,
              afterActive,
              beforeStoredMarks: beforeStoredMarks?.map((m) => m.type.name),
              afterStoredMarks: afterStoredMarks?.map((m) => m.type.name),
              commandResult: result,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "A,B",
          }),
        }
      ).catch(() => {});
    };
    // #endregion

    // #region agent log
    const handleItalicClick = () => {
      const beforeActive = editor.isActive("italic");
      const beforeStoredMarks = editor.state.storedMarks;
      const result = editor.chain().focus().toggleItalic().run();
      const afterActive = editor.isActive("italic");
      const afterStoredMarks = editor.state.storedMarks;
      fetch(
        "http://127.0.0.1:7243/ingest/ce75b66a-92eb-4bba-bdcd-9e0d58fc8a1a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "tiptap-editor.tsx:handleItalicClick",
            message: "Italic button clicked",
            data: {
              beforeActive,
              afterActive,
              beforeStoredMarks: beforeStoredMarks?.map((m) => m.type.name),
              afterStoredMarks: afterStoredMarks?.map((m) => m.type.name),
              commandResult: result,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "A,B",
          }),
        }
      ).catch(() => {});
    };
    // #endregion

    // #region agent log
    const handleHeadingClick = (level: 2 | 3) => {
      const beforeActive = editor.isActive("heading", { level });
      const selection = editor.state.selection;
      const currentNode = selection.$head.parent;
      const result = editor.chain().focus().toggleHeading({ level }).run();
      const afterActive = editor.isActive("heading", { level });
      fetch(
        "http://127.0.0.1:7243/ingest/ce75b66a-92eb-4bba-bdcd-9e0d58fc8a1a",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "tiptap-editor.tsx:handleHeadingClick",
            message: `Heading ${level} clicked`,
            data: {
              level,
              beforeActive,
              afterActive,
              commandResult: result,
              currentNodeType: currentNode.type.name,
              selectionEmpty: selection.empty,
              selectionFrom: selection.from,
              selectionTo: selection.to,
            },
            timestamp: Date.now(),
            sessionId: "debug-session",
            hypothesisId: "C,D,E",
          }),
        }
      ).catch(() => {});
    };
    // #endregion

    // #region agent log
    console.log("[DEBUG] Render - isActive states:", {
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      h2: editor.isActive("heading", { level: 2 }),
      h3: editor.isActive("heading", { level: 3 }),
      storedMarks: editor.state.storedMarks?.map((m) => m.type.name),
    });
    // #endregion

    return (
      <div className={cn("relative group", className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Floating Toolbar - appears on selection or hover near top */}
        <div className="sticky top-20 z-10 mx-auto mb-8 w-fit overflow-hidden rounded-full border bg-background/95 p-1 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60 transition-all opacity-0 group-hover:opacity-100 focus-within:opacity-100">
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleBoldClick}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleItalicClick}
            >
              <Italic className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
              }
              size="sm"
              className="h-8 px-2.5 rounded-full font-serif"
              onClick={() => handleHeadingClick(2)}
            >
              H2
            </Button>
            <Button
              type="button"
              variant={
                editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
              }
              size="sm"
              className="h-8 px-2.5 rounded-full font-serif"
              onClick={() => handleHeadingClick(3)}
            >
              H3
            </Button>

            <Separator orientation="vertical" className="mx-1 h-4" />

            <Button
              type="button"
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant={editor.isActive("link") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={setLink}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleImageUpload}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <EditorContent editor={editor} />
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";
