import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

  const handleAccountClick = (accountId: string) => {
    navigate(`/account/${accountId}`);
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
          <h2 className="text-xl font-semibold">
            Comptes TikTok ({mockAccounts.length})
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockAccounts.map((account) => (
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
