import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Company Info */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Nom de l'entreprise
            </label>
            <Input
              value={company.name}
              onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-bold border-none px-0 focus-visible:ring-0"
              placeholder="Nom de votre entreprise"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description de l'entreprise
            </label>
            <Textarea
              value={company.description}
              onChange={(e) => setCompany(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-24 border-none px-0 focus-visible:ring-0 text-muted-foreground"
              placeholder="Description de votre entreprise et de ses activités"
            />
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Comptes TikTok ({accounts.length})
            </h2>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un compte
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Nouveau compte TikTok</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom du personnage*</Label>
                    <Input
                      id="name"
                      value={newAccount.name}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Sophie Martin"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt du personnage*</Label>
                    <Textarea
                      id="prompt"
                      value={newAccount.prompt}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Ex: Créer du contenu sur les tendances tech pour les jeunes professionnels"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="personality">Personnalité*</Label>
                    <Textarea
                      id="personality"
                      value={newAccount.personality}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, personality: e.target.value }))}
                      placeholder="Ex: Dynamique, passionnée par l'innovation, pédagogue"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tiktokUrl">URL TikTok (optionnel)</Label>
                    <Input
                      id="tiktokUrl"
                      value={newAccount.tikTokUrl}
                      onChange={(e) => setNewAccount(prev => ({ ...prev, tikTokUrl: e.target.value }))}
                      placeholder="https://tiktok.com/@username"
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      onClick={handleAddAccount}
                      className="flex-1 bg-gradient-primary"
                      disabled={!newAccount.name || !newAccount.prompt || !newAccount.personality}
                    >
                      Créer le compte
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={() => handleAccountClick(account.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
