"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createPost } from "@/lib/actions/posts";
import type { PostStatus } from "@/lib/types";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { PostSettings } from "@/components/editor/post-settings";
import { toast } from "sonner";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState<string>("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize title
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!title.trim()) {
      setError("Please enter a title for your post");
      toast.error("Please enter a title for your post");
      setIsSubmitting(false);
      return;
    }

    const result = await createPost({
      title,
      slug,
      summary,
      body,
      image,
      read_time: readTime ? parseInt(readTime, 10) : null,
      status,
      scheduled_at: scheduledAt || null,
    });

    if (!result.success) {
      setError(result.error);
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success("Post created successfully");
    router.push("/dashboard/blogs");
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen pb-20">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="-ml-2">
            <Link href="/dashboard/blogs">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div className="text-sm font-medium text-muted-foreground">
            New Story
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PostSettings
            slug={slug}
            setSlug={setSlug}
            summary={summary}
            setSummary={setSummary}
            image={image}
            setImage={setImage}
            readTime={readTime}
            setReadTime={setReadTime}
            status={status}
            setStatus={setStatus}
            scheduledAt={scheduledAt}
            setScheduledAt={setScheduledAt}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="max-w-3xl mx-auto w-full px-6 pt-12 animate-in fade-in duration-500">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Untitled Story"
          className="w-full resize-none overflow-hidden bg-transparent text-5xl font-serif font-bold placeholder:text-muted-foreground/40 focus:outline-none border-none p-0 mb-8"
          rows={1}
          autoFocus
        />

        <TipTapEditor
          content={body}
          onChange={setBody}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
}
