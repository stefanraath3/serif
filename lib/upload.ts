import { createClient } from "@/lib/supabase/client";

type UploadResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string };

export async function uploadImage(file: File): Promise<UploadResult> {
  const supabase = createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) {
    return { success: false, error: "You must be logged in to upload images" };
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return { success: false, error: "File must be an image" };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
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

  return { success: true, url: publicUrl, path: filePath };
}
