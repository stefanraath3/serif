import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, summary, image")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    notFound();
  }

  const authorName = post.author || "Anonymous";
  const authorAvatar: string | null = null;
  const authorInitials = authorName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <article className="container mx-auto px-6 pt-32 pb-16 max-w-4xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-stone-900">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-xl text-stone-600 mb-8 leading-relaxed">
              {post.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-stone-600 mb-8">
            <div className="flex items-center gap-2">
              {authorAvatar && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback className="text-xs bg-stone-200 text-stone-700">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="font-medium">{authorName}</span>
            </div>
            <span>•</span>
            <time dateTime={post.created_at} className="text-stone-500">
              {formattedDate}
            </time>
            {post.read_time && (
              <>
                <span>•</span>
                <span className="text-stone-500">
                  {post.read_time} min read
                </span>
              </>
            )}
          </div>

          {post.image && (
            <div className="relative w-full h-64 md:h-96 lg:h-128 rounded-xl overflow-hidden bg-stone-100">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-stone max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:font-serif [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-serif [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:font-serif [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-stone-700 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4 [&_li]:mb-2 [&_li]:text-stone-700 [&_a]:text-stone-900 [&_a]:underline [&_a]:hover:text-stone-700 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-6 [&_strong]:font-semibold [&_strong]:text-stone-900 [&_code]:bg-stone-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-stone-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: post.body || "" }}
        />
      </article>
    </div>
  );
}
