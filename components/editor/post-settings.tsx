"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";
import type { PostStatus } from "@/lib/types";
import { ImageUpload } from "@/components/editor/image-upload";

interface PostSettingsProps {
  slug: string;
  setSlug: (slug: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  image: string;
  setImage: (image: string) => void;
  readTime: string;
  setReadTime: (readTime: string) => void;
  status: PostStatus;
  setStatus: (status: PostStatus) => void;
  scheduledAt: string;
  setScheduledAt: (scheduledAt: string) => void;
}

export function PostSettings({
  slug,
  setSlug,
  summary,
  setSummary,
  image,
  setImage,
  readTime,
  setReadTime,
  status,
  setStatus,
  scheduledAt,
  setScheduledAt,
}: PostSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title="Post Settings">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Post Settings</SheetTitle>
          <SheetDescription>
            Configure metadata, SEO, and publishing details for your story.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-8 py-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              General
            </h3>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-post"
              />
              <p className="text-xs text-muted-foreground">
                The URL-friendly version of the title.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A brief description of your post..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Appears in search results and social media previews.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={image}
                onChange={setImage}
                label="Cover Image"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Publishing
            </h3>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as PostStatus);
                  if (value !== "scheduled") {
                    setScheduledAt("");
                  }
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {status === "scheduled" && (
              <div className="space-y-2">
                <Label htmlFor="scheduled-at">Scheduled Date & Time</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={status === "scheduled"}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="read-time">Read Time (minutes)</Label>
              <Input
                id="read-time"
                type="number"
                min="1"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
