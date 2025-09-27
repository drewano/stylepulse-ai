import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, FileText, Users, TrendingUp, Eye, Heart } from "lucide-react";
import AccountCard from "@/components/AccountCard";
import { TikTokAccount } from "@/types";
import { useAccounts } from "@/hooks/useAccounts";
import { useCompany } from "@/hooks/useCompany";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { accounts, loading, createAccount } = useAccounts();
  const { company, updateCompany, loading: companyLoading } = useCompany();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: "",
    prompt: "",
    personality: "",
    tiktok_url: ""
  });

  const handleAccountClick = (accountId: string) => {
    navigate(`/account/${accountId}`);
  };

  const handleAddAccount = async () => {
    if (!newAccount.username || !newAccount.prompt || !newAccount.personality) {
      return;
    }

    // Get default workspace
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .limit(1)
      .single();

    const accountData = {
      username: newAccount.username,
      prompt: newAccount.prompt,
      personality: newAccount.personality,
      tiktok_url: newAccount.tiktok_url || null,
      profile_picture_url: null,
      days_in_internship: 0,
      total_views: 0,
      platform: 'tiktok',
      workspace_id: workspace?.id || crypto.randomUUID(),
    };

    const result = await createAccount(accountData);
    if (result) {
      setNewAccount({
        username: "",
        prompt: "",
        personality: "",
        tiktok_url: ""
      });
      setIsAddDialogOpen(false);
    }
  };

  // Calculate stats
  const totalAccounts = accounts.length;
  const totalViews = accounts.reduce((sum, account) => sum + account.total_views, 0);
  const totalDays = accounts.reduce((sum, account) => sum + account.days_in_internship, 0);
  const avgDays = totalAccounts > 0 ? Math.round(totalDays / totalAccounts) : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Header */}
      <div className="bg-gradient-primary text-primary-foreground py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6" />
                <span className="text-sm font-medium opacity-90">Entreprise</span>
              </div>
              <Input
                value={company?.nom || ''}
                onChange={(e) => updateCompany({ nom: e.target.value })}
                className="text-3xl font-bold bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                placeholder="Nom de votre entreprise"
                disabled={companyLoading}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Description</span>
              </div>
              <Textarea
                value={company?.description || ''}
                onChange={(e) => updateCompany({ description: e.target.value })}
                className="min-h-24 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                placeholder="Description de votre entreprise et de ses activités"
                disabled={companyLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 -mt-8">
        <Card className="shadow-lg border-0 bg-background">
          <CardContent className="p-8">

            {/* Accounts Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold flex items-center">
                  <Users className="h-6 w-6 mr-3 text-primary" />
                  Vos stagiaires virtuels
                </h2>
                <p className="text-muted-foreground">
                  Gérez vos personnages TikTok et suivez leurs performances
                </p>
              </div>
              
              {totalAccounts > 0 && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-primary shadow-glow hover:shadow-lg transition-all">
                      <Plus className="h-5 w-5 mr-2" />
                      Nouveau stagiaire
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="space-y-3">
                    <DialogTitle className="text-xl">Créer un nouveau stagiaire</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Définissez la personnalité et le style de votre nouveau créateur de contenu IA
                    </p>
                  </DialogHeader>
                  <div className="space-y-6 pt-4">
                     <div className="space-y-2">
                       <Label htmlFor="username" className="text-sm font-medium">Nom du personnage*</Label>
                       <Input
                         id="username"
                         value={newAccount.username}
                         onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                         placeholder="Ex: Sophie Martin"
                         className="transition-smooth"
                       />
                     </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="prompt" className="text-sm font-medium">Prompt du personnage*</Label>
                      <Textarea
                        id="prompt"
                        value={newAccount.prompt}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, prompt: e.target.value }))}
                        placeholder="Ex: Créer du contenu sur les tendances tech pour les jeunes professionnels"
                        className="min-h-24 transition-smooth"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="personality" className="text-sm font-medium">Personnalité*</Label>
                      <Textarea
                        id="personality"
                        value={newAccount.personality}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, personality: e.target.value }))}
                        placeholder="Ex: Dynamique, passionnée par l'innovation, pédagogue"
                        className="min-h-24 transition-smooth"
                      />
                    </div>
                    
                     <div className="space-y-2">
                       <Label htmlFor="tiktok_url" className="text-sm font-medium">URL TikTok (optionnel)</Label>
                       <Input
                         id="tiktok_url"
                         value={newAccount.tiktok_url}
                         onChange={(e) => setNewAccount(prev => ({ ...prev, tiktok_url: e.target.value }))}
                         placeholder="https://tiktok.com/@username"
                         className="transition-smooth"
                       />
                     </div>
                    
                    <div className="flex space-x-3 pt-6">
                       <Button 
                         onClick={handleAddAccount}
                         className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                         disabled={!newAccount.username || !newAccount.prompt || !newAccount.personality}
                         size="lg"
                       >
                         Créer le stagiaire
                       </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddDialogOpen(false)}
                        className="flex-1 hover:bg-muted transition-smooth"
                        size="lg"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Enhanced Status Bar */}
            {totalAccounts > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{totalAccounts}</div>
                    <div className="text-xs text-muted-foreground">Stagiaires</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Eye className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">{totalViews.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Vues totales</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-success/5 border border-success/10">
                  <div className="p-2 rounded-lg bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-success">{avgDays}</div>
                    <div className="text-xs text-muted-foreground">Jours moyenne</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bg-warning/5 border border-warning/10">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Heart className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                 <div className="text-lg font-bold text-warning">
                   {accounts.filter(a => a.days_in_internship > 0).length}
                 </div>
                    <div className="text-xs text-muted-foreground">Actifs</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Accounts Grid */}
            {totalAccounts === 0 ? (
              <Card className="p-12 text-center border-dashed border-2">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Users className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Aucun stagiaire pour le moment</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Créez votre premier stagiaire virtuel pour commencer à générer du contenu TikTok automatiquement
                </p>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-primary">
                      <Plus className="h-5 w-5 mr-2" />
                      Créer mon premier stagiaire
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="space-y-3">
                      <DialogTitle className="text-xl">Créer un nouveau stagiaire</DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        Définissez la personnalité et le style de votre nouveau créateur de contenu IA
                      </p>
                    </DialogHeader>
                    <div className="space-y-6 pt-4">
                       <div className="space-y-2">
                         <Label htmlFor="username" className="text-sm font-medium">Nom du personnage*</Label>
                         <Input
                           id="username"
                           value={newAccount.username}
                           onChange={(e) => setNewAccount(prev => ({ ...prev, username: e.target.value }))}
                           placeholder="Ex: Sophie Martin"
                           className="transition-smooth"
                         />
                       </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="prompt" className="text-sm font-medium">Prompt du personnage*</Label>
                        <Textarea
                          id="prompt"
                          value={newAccount.prompt}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, prompt: e.target.value }))}
                          placeholder="Ex: Créer du contenu sur les tendances tech pour les jeunes professionnels"
                          className="min-h-24 transition-smooth"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="personality" className="text-sm font-medium">Personnalité*</Label>
                        <Textarea
                          id="personality"
                          value={newAccount.personality}
                          onChange={(e) => setNewAccount(prev => ({ ...prev, personality: e.target.value }))}
                          placeholder="Ex: Dynamique, passionnée par l'innovation, pédagogue"
                          className="min-h-24 transition-smooth"
                        />
                      </div>
                      
                       <div className="space-y-2">
                         <Label htmlFor="tiktok_url" className="text-sm font-medium">URL TikTok (optionnel)</Label>
                         <Input
                           id="tiktok_url"
                           value={newAccount.tiktok_url}
                           onChange={(e) => setNewAccount(prev => ({ ...prev, tiktok_url: e.target.value }))}
                           placeholder="https://tiktok.com/@username"
                           className="transition-smooth"
                         />
                       </div>
                      
                      <div className="flex space-x-3 pt-6">
                         <Button 
                           onClick={handleAddAccount}
                           className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                           disabled={!newAccount.username || !newAccount.prompt || !newAccount.personality}
                           size="lg"
                         >
                           Créer le stagiaire
                         </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddDialogOpen(false)}
                          className="flex-1 hover:bg-muted transition-smooth"
                          size="lg"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onClick={() => handleAccountClick(account.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
