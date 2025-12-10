"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updatePost } from "@/lib/actions/posts";
import type { PostStatus } from "@/lib/types";
import { TipTapEditor } from "@/components/editor/tiptap-editor";
import { PostSettings } from "@/components/editor/post-settings";
import { toast } from "sonner";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [readTime, setReadTime] = useState<string>("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadPost = async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        router.push("/auth/login");
        return;
      }

      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .eq("user_id", authData.user.id)
        .single();

      if (fetchError || !post) {
        setError("Post not found");
        setIsLoading(false);
        return;
      }

      setTitle(post.title);
      setSlug(post.slug);
      setSummary(post.summary || "");
      setBody(post.body || "");
      setImage(post.image || "");
      setReadTime(post.read_time?.toString() || "");
      setStatus(post.status);
      setScheduledAt(
        post.scheduled_at
          ? new Date(post.scheduled_at).toISOString().slice(0, 16)
          : ""
      );
      setIsLoading(false);
    };

    loadPost();
  }, [postId, router]);

  // Auto-resize title
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title, isLoading]);

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

    const result = await updatePost(postId, {
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

    toast.success("Post updated successfully");
    setIsSubmitting(false);
    router.push("/dashboard/blogs");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <Button asChild>
          <Link href="/dashboard/blogs">Back to Posts</Link>
        </Button>
      </div>
    );
  }

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
            {status === "published" ? "Published" : "Draft"}
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
