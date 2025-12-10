import type { Post } from "@/lib/types";

export const mockPosts: Post[] = [
  {
    id: "1",
    user_id: "mock-user-id",
    title: "Getting Started with Next.js",
    slug: "getting-started-with-nextjs",
    content:
      "This is a comprehensive guide to getting started with Next.js. We will cover the basics and advanced topics.",
    status: "published",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_id: "mock-user-id",
    title: "Building Modern UIs with ShadCN",
    slug: "building-modern-uis-with-shadcn",
    content:
      "Learn how to build beautiful and accessible user interfaces using ShadCN components.",
    status: "published",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_id: "mock-user-id",
    title: "Understanding TypeScript Generics",
    slug: "understanding-typescript-generics",
    content:
      "A deep dive into TypeScript generics and how to use them effectively in your projects.",
    status: "draft",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    user_id: "mock-user-id",
    title: "Database Design Best Practices",
    slug: "database-design-best-practices",
    content:
      "Essential tips and patterns for designing robust and scalable databases.",
    status: "published",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    user_id: "mock-user-id",
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    content:
      "Exploring emerging trends and technologies that will shape the future of web development.",
    status: "draft",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
