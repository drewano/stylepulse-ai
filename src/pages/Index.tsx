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
import { Company, TikTokAccount } from "@/types";

// Mock data - à remplacer par des données réelles
const mockAccounts: TikTokAccount[] = [
  {
    id: "1",
    name: "Sophie Martin",
    prompt: "Créer du contenu sur les tendances tech",
    personality: "Dynamique et passionnée par l'innovation",
    profileImage: "/placeholder.svg",
    daysInInternship: 15,
    tikTokUrl: "https://tiktok.com/@sophietech",
    totalViews: 125000,
    pendingScripts: [],
    publishedPosts: []
  },
  {
    id: "2",
    name: "Lucas Dupont",
    prompt: "Contenu lifestyle et bien-être",
    personality: "Zen et inspirant",
    profileImage: "/placeholder.svg",
    daysInInternship: 22,
    tikTokUrl: "https://tiktok.com/@lucaswellness",
    totalViews: 89000,
    pendingScripts: [],
    publishedPosts: []
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    prompt: "Mode et beauty tips",
    personality: "Créative et tendance",
    profileImage: "/placeholder.svg",
    daysInInternship: 8,
    tikTokUrl: "https://tiktok.com/@emmastyle",
    totalViews: 203000,
    pendingScripts: [],
    publishedPosts: []
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company>({
    name: "TechStart Studio",
    description: "Agence digitale spécialisée dans la création de contenu IA pour les réseaux sociaux. Nous développons des personnages virtuels authentiques qui engagent votre audience."
  });
  
  const [accounts, setAccounts] = useState<TikTokAccount[]>(mockAccounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<TikTokAccount>>({
    name: "",
    prompt: "",
    personality: "",
    tikTokUrl: "",
    profileImage: "/placeholder.svg"
  });

  const handleAccountClick = (accountId: string) => {
    navigate(`/account/${accountId}`);
  };

  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.prompt || !newAccount.personality) {
      return;
    }

    const account: TikTokAccount = {
      id: Date.now().toString(),
      name: newAccount.name,
      prompt: newAccount.prompt,
      personality: newAccount.personality,
      profileImage: newAccount.profileImage || "/placeholder.svg",
      tikTokUrl: newAccount.tikTokUrl || "",
      daysInInternship: 0,
      totalViews: 0,
      pendingScripts: [],
      publishedPosts: []
    };

    setAccounts(prev => [...prev, account]);
    setNewAccount({
      name: "",
      prompt: "",
      personality: "",
      tikTokUrl: "",
      profileImage: "/placeholder.svg"
    });
    setIsAddDialogOpen(false);
  };

  // Calculate stats
  const totalAccounts = accounts.length;
  const totalViews = accounts.reduce((sum, account) => sum + account.totalViews, 0);
  const totalDays = accounts.reduce((sum, account) => sum + account.daysInInternship, 0);
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
                value={company.name}
                onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                className="text-3xl font-bold bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                placeholder="Nom de votre entreprise"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Description</span>
              </div>
              <Textarea
                value={company.description}
                onChange={(e) => setCompany(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-24 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
                placeholder="Description de votre entreprise et de ses activités"
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
                      <Label htmlFor="name" className="text-sm font-medium">Nom du personnage*</Label>
                      <Input
                        id="name"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
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
                      <Label htmlFor="tiktokUrl" className="text-sm font-medium">URL TikTok (optionnel)</Label>
                      <Input
                        id="tiktokUrl"
                        value={newAccount.tikTokUrl}
                        onChange={(e) => setNewAccount(prev => ({ ...prev, tikTokUrl: e.target.value }))}
                        placeholder="https://tiktok.com/@username"
                        className="transition-smooth"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-6">
                      <Button 
                        onClick={handleAddAccount}
                        className="flex-1 bg-gradient-primary hover:shadow-glow transition-all"
                        disabled={!newAccount.name || !newAccount.prompt || !newAccount.personality}
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
                      {accounts.filter(a => a.daysInInternship > 0).length}
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
                <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="bg-gradient-primary">
                  <Plus className="h-5 w-5 mr-2" />
                  Créer mon premier stagiaire
                </Button>
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
