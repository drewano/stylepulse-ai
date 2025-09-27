import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Edit3, Trash2, Check, AlertTriangle } from "lucide-react";
import { TikTokAccount, Script } from "@/types";

// Mock data - à remplacer par des données réelles
const mockAccount: TikTokAccount = {
  id: "1",
  name: "Sophie Martin",
  prompt: "Créer du contenu sur les tendances tech pour les jeunes professionnels",
  personality: "Dynamique, passionnée par l'innovation, pédagogue et accessible",
  profileImage: "/placeholder.svg",
  daysInInternship: 15,
  tikTokUrl: "https://tiktok.com/@sophietech",
  totalViews: 125000,
  pendingScripts: [
    { id: "1", content: "Top 5 des apps IA révolutionnaires en 2024", isValidated: false, createdAt: new Date() },
    { id: "2", content: "Pourquoi ChatGPT va changer ton travail", isValidated: false, createdAt: new Date() },
  ],
  publishedPosts: [
    { 
      id: "1", 
      script: "Les nouveautés tech qui vont exploser", 
      publishedAt: new Date("2024-01-15"), 
      views: 45000, 
      likes: 3200, 
      comments: 156, 
      shares: 89 
    },
  ]
};

const AccountDetails = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  
  const [account, setAccount] = useState<TikTokAccount>(mockAccount);
  const [editingScript, setEditingScript] = useState<string | null>(null);
  const [editingScriptContent, setEditingScriptContent] = useState("");

  const handleValidateScript = (scriptId: string) => {
    setAccount(prev => ({
      ...prev,
      pendingScripts: prev.pendingScripts.map(script =>
        script.id === scriptId ? { ...script, isValidated: true } : script
      )
    }));
  };

  const handleDeleteScript = (scriptId: string) => {
    setAccount(prev => ({
      ...prev,
      pendingScripts: prev.pendingScripts.filter(script => script.id !== scriptId)
    }));
  };

  const handleEditScript = (script: Script) => {
    setEditingScript(script.id);
    setEditingScriptContent(script.content);
  };

  const handleSaveScript = (scriptId: string) => {
    setAccount(prev => ({
      ...prev,
      pendingScripts: prev.pendingScripts.map(script =>
        script.id === scriptId ? { ...script, content: editingScriptContent } : script
      )
    }));
    setEditingScript(null);
  };

  const nonValidatedScripts = account.pendingScripts.filter(script => !script.isValidated);
  const showAlert = nonValidatedScripts.length < 20;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">{account.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <img 
                  src={account.profileImage} 
                  alt={account.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-border"
                />
                <Button variant="outline" size="sm">
                  Changer photo
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input 
                  value={account.name}
                  onChange={(e) => setAccount(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Jours de stage</label>
                <div className="text-2xl font-bold text-primary">{account.daysInInternship}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vues totales</label>
                <div className="text-2xl font-bold text-accent">{account.totalViews.toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Compte TikTok</label>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => window.open(account.tikTokUrl, '_blank')}
                >
                  Voir le compte
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt & Personality */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt du personnage</label>
                  <Textarea 
                    value={account.prompt}
                    onChange={(e) => setAccount(prev => ({ ...prev, prompt: e.target.value }))}
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Personnalité</label>
                  <Textarea 
                    value={account.personality}
                    onChange={(e) => setAccount(prev => ({ ...prev, personality: e.target.value }))}
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Scripts en attente */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Scripts en attente</CardTitle>
                <Badge variant="secondary">
                  {nonValidatedScripts.length} non validés
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAlert && (
                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      Alerte : Moins de 20 scripts en attente ! Générez-en plus.
                    </span>
                  </div>
                )}

                <div className="max-h-96 overflow-y-auto space-y-3">
                  {account.pendingScripts.map((script) => (
                    <div 
                      key={script.id} 
                      className={`p-4 rounded-lg border ${script.isValidated ? 'bg-success/10 border-success/30' : 'bg-card'}`}
                    >
                      {editingScript === script.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editingScriptContent}
                            onChange={(e) => setEditingScriptContent(e.target.value)}
                            className="min-h-20"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => handleSaveScript(script.id)}>
                              <Check className="h-4 w-4 mr-1" />
                              Sauvegarder
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingScript(null)}>
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm mb-3">{script.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {!script.isValidated && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleValidateScript(script.id)}
                                  className="bg-gradient-primary"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Valider
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditScript(script)}
                              >
                                <Edit3 className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteScript(script.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                            {script.isValidated && (
                              <Badge className="bg-success text-success-foreground">
                                Validé
                              </Badge>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Posts publiés */}
            <Card>
              <CardHeader>
                <CardTitle>Posts publiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {account.publishedPosts.map((post) => (
                    <div key={post.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium">{post.script}</p>
                        <span className="text-xs text-muted-foreground">
                          {post.publishedAt.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>{post.views.toLocaleString()} vues</span>
                        <span>{post.likes.toLocaleString()} likes</span>
                        <span>{post.comments} commentaires</span>
                        <span>{post.shares} partages</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;