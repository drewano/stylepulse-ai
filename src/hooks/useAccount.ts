import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TikTokAccount } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useAccount = (accountId: number) => {
  const [account, setAccount] = useState<TikTokAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('comptes')
        .select('*')
        .eq('id', accountId)
        .maybeSingle();

      if (error) throw error;
      setAccount(data);
    } catch (error) {
      console.error('Error fetching account:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le compte",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAccount = async (updates: Partial<TikTokAccount>) => {
    try {
      const { data, error } = await supabase
        .from('comptes')
        .update(updates)
        .eq('id', accountId)
        .select()
        .single();

      if (error) throw error;

      setAccount(data);
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

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  return {
    account,
    loading,
    updateAccount,
    refetch: fetchAccount
  };
};