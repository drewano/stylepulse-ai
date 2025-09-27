import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TikTokAccount } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('platform', 'tiktok');

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les comptes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (accountData: {
    username: string;
    prompt: string;
    personality: string;
    tiktok_url?: string;
  }) => {
    try {
      // For now, create a default workspace. In production, get from user context
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .select('id')
        .limit(1)
        .single();

      let workspaceId = workspace?.id;

      if (!workspace) {
        // Create a default workspace if none exists
        const { data: newWorkspace, error: createWorkspaceError } = await supabase
          .from('workspaces')
          .insert([{
            name: 'Mon Espace',
            description: 'Espace par défaut',
            owner_id: (await supabase.auth.getUser()).data.user?.id
          }])
          .select()
          .single();

        if (createWorkspaceError) throw createWorkspaceError;
        workspaceId = newWorkspace.id;
      }

      const { data, error } = await supabase
        .from('social_accounts')
        .insert([{
          username: accountData.username,
          prompt: accountData.prompt,
          personality: accountData.personality,
          tiktok_url: accountData.tiktok_url || null,
          platform: 'tiktok',
          workspace_id: workspaceId,
          days_in_internship: 0,
          total_views: 0,
          profile_picture_url: null
        }])
        .select()
        .single();

      if (error) throw error;

      setAccounts(prev => [...prev, data]);
      toast({
        title: "Succès",
        description: "Compte créé avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le compte",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAccount = async (id: string, updates: Partial<TikTokAccount>) => {
    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAccounts(prev => prev.map(account => 
        account.id === id ? { ...account, ...data } : account
      ));

      toast({
        title: "Succès",
        description: "Compte mis à jour",
      });

      return data;
    } catch (error) {
      console.error('Error updating account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le compte",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccounts(prev => prev.filter(account => account.id !== id));
      toast({
        title: "Succès",
        description: "Compte supprimé",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le compte",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    createAccount,
    updateAccount,
    deleteAccount,
    refetch: fetchAccounts
  };
};