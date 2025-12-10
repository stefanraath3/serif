import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PublicPost } from "@/lib/types";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<PublicPost | null> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("public_posts")
    .select("*")
    .eq("slug", slug)
    .single<PublicPost>();
  return post;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data: posts } = await supabase.from("public_posts").select("slug");

  return (posts || []).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const url = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.summary || undefined,
    authors: [{ name: post.author_name }],
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: "article",
      url,
      publishedTime: post.created_at,
      authors: [post.author_name],
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || undefined,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const authorInitials = post.author_name
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

  // JSON-LD structured data for Article
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary || undefined,
    image: post.image || undefined,
    datePublished: post.created_at,
    author: {
      "@type": "Person",
      name: post.author_name,
      image: post.author_avatar || undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Serif",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-stone-50">
        <article className="container mx-auto px-6 pt-32 pb-16 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-8 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Back to Blog
          </Link>
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
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={post.author_avatar || ""}
                    alt={post.author_name}
                  />
                  <AvatarFallback className="text-xs bg-stone-200 text-stone-700">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author_name}</span>
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
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
    </>
  );
}
