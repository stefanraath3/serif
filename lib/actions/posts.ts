"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { PostFormData } from "@/lib/types";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(
  formData: PostFormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "You must be logged in to create a post" };
  }

  // Get user profile for author name
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", authData.user.id)
    .single();

  const authorName =
    profile?.first_name || authData.user.email?.split("@")[0] || "Anonymous";

  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: authData.user.id,
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary || null,
      body: formData.body || null,
      image: formData.image || null,
      author: authorName,
      read_time: formData.read_time || null,
      status: formData.status,
      scheduled_at: formData.scheduled_at
        ? new Date(formData.scheduled_at).toISOString()
        : null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/blogs");
  return { success: true, data: { id: data.id } };
}

export async function updatePost(
  postId: string,
  formData: PostFormData
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "You must be logged in to update a post" };
  }

  // Get user profile for author name
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", authData.user.id)
    .single();

  const authorName =
    profile?.first_name || authData.user.email?.split("@")[0] || "Anonymous";

  const { error } = await supabase
    .from("posts")
    .update({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary || null,
      body: formData.body || null,
      image: formData.image || null,
      author: authorName,
      read_time: formData.read_time || null,
      status: formData.status,
      scheduled_at: formData.scheduled_at
        ? new Date(formData.scheduled_at).toISOString()
        : null,
    })
    .eq("id", postId)
    .eq("user_id", authData.user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/blogs");
  revalidatePath(`/dashboard/blogs/${postId}`);
  revalidatePath(`/blog/${formData.slug}`);
  return { success: true, data: undefined };
}

export async function deletePost(postId: string): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "You must be logged in to delete a post" };
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", authData.user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/blogs");
  return { success: true, data: undefined };
}

export async function uploadImage(
  file: File,
  postId?: string
): Promise<ActionResult<{ url: string; path: string }>> {
  const supabase = await createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "You must be logged in to upload images" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image" };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { success: false, error: "Image size must be less than 5MB" };
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;
  const filePath = `${authData.user.id}/${fileName}`;

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("post-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { success: false, error: uploadError.message };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("post-images").getPublicUrl(filePath);

  return { success: true, data: { url: publicUrl, path: filePath } };
}
