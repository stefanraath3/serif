export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string | null;
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
  content: string;
  status: PostStatus;
}
