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
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto p-0 border-l border-border/40 bg-background/95 backdrop-blur-md">
        <SheetHeader className="px-8 pt-8 pb-4 border-b border-border/40">
          <SheetTitle className="font-serif text-3xl font-medium tracking-tight">
            Post Settings
          </SheetTitle>
          <SheetDescription className="text-base font-light">
            Configure metadata and publishing details.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-10 px-8 py-8">
          <div className="space-y-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              General
            </h3>

            <div className="space-y-3">
              <Label htmlFor="slug" className="text-sm font-medium">
                URL Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-post"
                className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all"
              />
              <p className="text-xs text-muted-foreground font-light">
                The URL-friendly version of the title.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="summary" className="text-sm font-medium">
                Summary
              </Label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A brief description of your post..."
                rows={4}
                className="resize-none bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all"
              />
              <p className="text-xs text-muted-foreground font-light">
                Appears in search results and social media previews.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Cover Image</Label>
              <ImageUpload value={image} onChange={setImage} hideLabel />
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-border/40">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Publishing
            </h3>

            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as PostStatus);
                  if (value !== "scheduled") {
                    setScheduledAt("");
                  }
                }}
              >
                <SelectTrigger
                  id="status"
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                >
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
              <div className="space-y-3">
                <Label htmlFor="scheduled-at" className="text-sm font-medium">
                  Scheduled Date & Time
                </Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required={status === "scheduled"}
                  className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="read-time" className="text-sm font-medium">
                Read Time (minutes)
              </Label>
              <Input
                id="read-time"
                type="number"
                min="1"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5"
                className="bg-muted/30 border-transparent focus:border-primary/20 focus:bg-background transition-all"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
