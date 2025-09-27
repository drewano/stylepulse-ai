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
        .from('comptes')
        .select('*')
        .order('created_at', { ascending: false });

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
    nom: string;
    prompt: string;
    personnalite: string;
    lien_tiktok?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('comptes')
        .insert([{
          nom: accountData.nom,
          prompt: accountData.prompt,
          personnalite: accountData.personnalite,
          lien_tiktok: accountData.lien_tiktok || null,
          platform: 'tiktok',
          days_in_internship: 0,
          vues_totales: 0,
          photo_url: null,
          image_url: null
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

  const updateAccount = async (id: number, updates: Partial<TikTokAccount>) => {
    try {
      const { data, error } = await supabase
        .from('comptes')
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

  const deleteAccount = async (id: number) => {
    try {
      const { error } = await supabase
        .from('comptes')
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