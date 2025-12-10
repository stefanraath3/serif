"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  Save,
  ImagePlus,
  X,
  User,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { createPost } from "@/lib/actions/posts";
import type { PostStatus, Profile } from "@/lib/types";
import {
  TipTapEditor,
  TipTapEditorRef,
} from "@/components/editor/tiptap-editor";
import { PostSettings } from "@/components/editor/post-settings";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/upload";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

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
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<TipTapEditorRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setUserProfile(data);
      }
    };
    loadProfile();
  }, []);

  // Auto-resize title
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  // Auto-resize summary
  useEffect(() => {
    if (summaryRef.current) {
      summaryRef.current.style.height = "auto";
      summaryRef.current.style.height = summaryRef.current.scrollHeight + "px";
    }
  }, [summary]);

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

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // If summary is empty, maybe jump to summary? Or directly to editor?
      // User asked to "takes you to the next line immediately. So there is a title... and then the actual editor".
      // But we inserted summary/meta. Let's focus editor for now as per "editor itself is right below".
      // Actually, if we have a summary field visible, logical flow is Title -> Summary -> Editor.
      // But user specifically said "press enter, it takes you to the next line immediately... editor itself is right below".
      // I'll try to be smart: Focus Summary if empty, else Editor.
      // Wait, let's stick to the prompt: "press enter... allow for that to happen... editor itself is right below".
      // I will focus the editor, as requested. The summary is optional.
      editorRef.current?.focus();
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    const result = await uploadImage(file);
    if (result.success) {
      setImage(result.url);
    } else {
      toast.error(result.error);
    }
    setIsUploadingCover(false);
  };

  const removeCover = () => {
    setImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
    <div className="flex flex-1 flex-col min-h-screen pb-20 bg-background">
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
        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onKeyDown={handleTitleKeyDown}
          placeholder="Untitled Story"
          className="w-full resize-none overflow-hidden bg-transparent text-5xl font-serif font-bold placeholder:text-muted-foreground/40 focus:outline-none border-none p-0 mb-4"
          rows={1}
          autoFocus
        />

        {/* Meta Info Row */}
        <div className="flex items-center gap-6 text-muted-foreground text-sm mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={userProfile?.avatar_url || ""} />
              <AvatarFallback>
                {userProfile?.first_name?.[0] || <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            <span>{userProfile?.first_name || "Author"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(), "MMM d, yyyy")}</span>
          </div>
          {(readTime || body) && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime ? `${readTime} min read` : "1 min read"}</span>
            </div>
          )}
        </div>

        {/* Summary (Subtitle) */}
        <textarea
          ref={summaryRef}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Write a subtitle..."
          className="w-full resize-none overflow-hidden bg-transparent text-xl text-muted-foreground focus:outline-none border-none p-0 mb-6 font-serif"
          rows={1}
        />

        {/* Cover Image Area */}
        <div className="mb-8 group relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverUpload}
          />

          {image ? (
            <div className="relative rounded-xl overflow-hidden aspect-video border bg-muted">
              <Image src={image} alt="Cover" fill className="object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeCover}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto p-0 hover:bg-transparent"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-2" />
                Add cover image
              </Button>
              {isUploadingCover && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        <TipTapEditor
          ref={editorRef}
          content={body}
          onChange={setBody}
          placeholder="Tell your story..."
        />
      </div>
    </div>
  );
}
