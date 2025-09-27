import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Storyboard, GeneratedVideo } from "@/types";

interface GenerateStoryboardsParams {
  userPrompt: string;
  accountId: string;
}

interface GenerateVideoParams {
  storyboardId: string;
}

export const useVideoGenerator = () => {
  // Mutation pour générer des storyboards
  const generateStoryboards = useMutation({
    mutationFn: async ({ userPrompt, accountId }: GenerateStoryboardsParams) => {
      // Appel à la fonction Supabase Edge pour générer les storyboards
      const { data, error } = await supabase.functions.invoke("generate-storyboards", {
        body: { userPrompt, accountId }
      });
      
      if (error) throw error;
      return data;
    }
  });

  // Mutation pour générer une vidéo à partir d'un storyboard
  const generateVideo = useMutation({
    mutationFn: async ({ storyboardId }: GenerateVideoParams) => {
      // Appel à la fonction Supabase Edge pour générer la vidéo
      const { data, error } = await supabase.functions.invoke("generate-video", {
        body: { storyboardId }
      });
      
      if (error) throw error;
      return data;
    }
  });

  // Query pour récupérer les vidéos générées pour un compte spécifique
  const fetchGeneratedVideos = (accountId: string) => {
    return useQuery<GeneratedVideo[], Error>({
      queryKey: ["generatedVideos", accountId],
      queryFn: async () => {
        // Requête pour récupérer les vidéos générées liées à un compte via les storyboards
        const { data, error } = await supabase
          .from("generated_videos")
          .select(`
            id,
            storyboard_id,
            video_url,
            status,
            created_at,
            storyboards!inner(social_account_id)
          `)
          .eq("storyboards.social_account_id", accountId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as GeneratedVideo[];
      },
      enabled: !!accountId
    });
  };

  // Query pour récupérer les storyboards pour un compte spécifique
  const fetchStoryboards = (accountId: string) => {
    return useQuery<Storyboard[], Error>({
      queryKey: ["storyboards", accountId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("storyboards")
          .select("*")
          .eq("social_account_id", accountId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data as Storyboard[];
      },
      enabled: !!accountId
    });
  };

  return {
    generateStoryboards,
    generateVideo,
    fetchGeneratedVideos,
    fetchStoryboards
  };
};