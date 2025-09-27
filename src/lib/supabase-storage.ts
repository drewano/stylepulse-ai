import { supabase } from "@/integrations/supabase/client";

/**
 * Get the public URL for a file in a Supabase storage bucket
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/**
 * Get profile picture URL from the "Profil pictures" bucket
 * Falls back to photo_url, image_url, or placeholder if no profile picture exists
 */
export const getProfilePictureUrl = (account: { 
  id: number; 
  photo_url?: string | null; 
  image_url?: string | null; 
}): string => {
  // Try to get image from Supabase storage bucket first
  const profilePicturePath = `${account.id}.jpg`; // or .png
  const storageUrl = getPublicUrl("Profil pictures", profilePicturePath);
  
  // Fallback to existing URLs or placeholder
  return storageUrl || account.photo_url || account.image_url || "/placeholder.svg";
};