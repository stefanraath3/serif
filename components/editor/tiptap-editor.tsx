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
  List,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { uploadImage } from "@/lib/upload";
import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  memo,
} from "react";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";

export interface TipTapEditorRef {
  focus: () => void;
}

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ToolbarProps {
  editor: Editor;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const Toolbar = memo(({ editor, fileInputRef }: ToolbarProps) => {
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    h2: false,
    h3: false,
    bulletList: false,
    link: false,
  });

  useEffect(() => {
    if (!editor) return;

    const updateActive = () => {
      setActive({
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        link: editor.isActive("link"),
      });
    };

    editor.on("selectionUpdate", updateActive);
    editor.on("transaction", updateActive);
    updateActive(); // Initial state

    return () => {
      editor.off("selectionUpdate", updateActive);
      editor.off("transaction", updateActive);
    };
  }, [editor]);

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

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="sticky top-20 z-10 mx-auto mb-8 w-fit overflow-hidden rounded-full border bg-background/95 p-1 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/60 transition-all opacity-0 group-hover:opacity-100 focus-within:opacity-100">
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant={active.bold ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={active.italic ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Button
            type="button"
            variant={active.h2 ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2.5 rounded-full font-serif"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Button
            type="button"
            variant={active.h3 ? "default" : "ghost"}
            size="sm"
            className="h-8 px-2.5 rounded-full font-serif"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </Button>

          <Separator orientation="vertical" className="mx-1 h-4" />

          <Button
            type="button"
            variant={active.bulletList ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant={active.link ? "default" : "ghost"}
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
    </>
  );
});

Toolbar.displayName = "Toolbar";

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
      editorProps: {
        attributes: {
          class: cn(
            "focus:outline-none min-h-[300px] prose prose-lg prose-serif max-w-none dark:prose-invert",
            // Custom Typography overrides for cleaner look
            "[&_h1]:mt-8 [&_h1]:mb-4",
            "[&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-semibold",
            "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold",
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

    if (!editor) {
      return null;
    }

    return (
      <div className={cn("relative group", className)}>
        <Toolbar editor={editor} fileInputRef={fileInputRef} />
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";
