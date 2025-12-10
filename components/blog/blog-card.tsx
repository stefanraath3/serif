import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogCardProps {
  slug: string;
  title: string;
  summary: string | null;
  image: string | null;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  readTime: number | null;
}

export function BlogCard({
  slug,
  title,
  summary,
  image,
  authorName,
  authorAvatar,
  createdAt,
  readTime,
}: BlogCardProps) {
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-lg transition-all duration-300"
    >
      {image ? (
        <div className="relative w-full h-48 overflow-hidden bg-stone-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-linear-to-br from-stone-100 to-stone-200 flex items-center justify-center">
          <span className="text-stone-400 text-4xl font-serif">S</span>
        </div>
      )}

      <div className="flex flex-col gap-3 p-6 flex-1">
        <h3 className="font-serif text-xl font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-2">
          {title}
        </h3>

        {summary && (
          <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {summary}
          </p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            {authorAvatar && (
              <Avatar className="h-5 w-5">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback className="text-[10px] bg-stone-200 text-stone-600">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="font-medium">{authorName}</span>
          </div>
          <span>•</span>
          <time dateTime={createdAt}>{formattedDate}</time>
          {readTime && (
            <>
              <span>•</span>
              <span>{readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
