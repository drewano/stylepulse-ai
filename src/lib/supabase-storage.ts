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
 * Uses the account name to find the corresponding image file
 */
export const getProfilePictureUrl = (account: { 
  id: number; 
  nom: string;
  photo_url?: string | null; 
  image_url?: string | null; 
}): string => {
  // If we have existing URLs, use them as fallback
  if (account.photo_url) return account.photo_url;
  if (account.image_url) return account.image_url;
  
  // Try to get image from Supabase storage bucket using account name
  try {
    // Convert account name to lowercase and remove special characters for file name
    const fileName = account.nom.toLowerCase().replace(/[^a-z0-9]/g, '');
    const profilePicturePath = `${fileName}`;
    const storageUrl = getPublicUrl("Profil pictures", profilePicturePath);
    return storageUrl;
  } catch (error) {
    console.error('Error getting profile picture from storage:', error);
    return "/placeholder.svg";
  }
};