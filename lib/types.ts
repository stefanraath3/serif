export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  image: string | null;
  author: string | null;
  read_time: number | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  first_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostFormData {
  title: string;
  slug: string;
  summary: string;
  body: string;
  image: string;
  author: string;
  read_time: number | null;
  status: PostStatus;
}
