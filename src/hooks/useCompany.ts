import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Company {
  id: number;
  nom: string;
  description: string;
}

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('entreprise')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        // Create default company if none exists
        const { data: newCompany, error: createError } = await supabase
          .from('entreprise')
          .insert([
            {
              nom: 'Mon Entreprise',
              description: 'Description de mon entreprise'
            }
          ])
          .select()
          .single();

        if (createError) throw createError;
        setCompany(newCompany);
      } else {
        setCompany(data);
      }
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations de l'entreprise",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (updates: Partial<Pick<Company, 'nom' | 'description'>>) => {
    if (!company) return null;

    try {
      const { data, error } = await supabase
        .from('entreprise')
        .update(updates)
        .eq('id', company.id)
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      toast({
        title: "Succès",
        description: "Informations de l'entreprise mises à jour",
      });

      return data;
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations de l'entreprise",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return {
    company,
    loading,
    updateCompany,
    refetch: fetchCompany
  };
};