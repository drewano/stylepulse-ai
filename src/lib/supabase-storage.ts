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
  // If we have existing URLs, use them
  if (account.photo_url) return account.photo_url;
  if (account.image_url) return account.image_url;
  
  // Try to get image from Supabase storage bucket
  try {
    const profilePicturePath = `${account.id}.jpg`;
    const storageUrl = getPublicUrl("Profil pictures", profilePicturePath);
    return storageUrl;
  } catch (error) {
    console.error('Error getting profile picture from storage:', error);
    return "/placeholder.svg";
  }
};