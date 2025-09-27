import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Edit3, Trash2, Check, AlertTriangle } from "lucide-react";
import { Script } from "@/types";
import { useAccount } from "@/hooks/useAccount";

const AccountDetails = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  
  const { account, loading, updateAccount } = useAccount(parseInt(accountId || "0"));
  const [editingScript, setEditingScript] = useState<string | null>(null);
  const [editingScriptContent, setEditingScriptContent] = useState("");

  if (loading) {
    return <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Chargement...</p>
      </div>
    </div>;
  }

  if (!account) {
    return <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Compte introuvable</h1>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    </div>;
  }

  // Mock data for scripts - will be replaced with actual data later
  const mockScripts: Script[] = [
    { id: "1", content: "Top 5 des apps IA révolutionnaires en 2024", isValidated: false, createdAt: new Date() },
    { id: "2", content: "Pourquoi ChatGPT va changer ton travail", isValidated: false, createdAt: new Date() },
  ];

  const handleValidateScript = (scriptId: string) => {
    // TODO: Implement with real Supabase data
  };

  const handleDeleteScript = (scriptId: string) => {
    // TODO: Implement with real Supabase data
  };

  const handleEditScript = (script: Script) => {
    setEditingScript(script.id);
    setEditingScriptContent(script.content);
  };

  const handleSaveScript = (scriptId: string) => {
    // TODO: Implement with real Supabase data
    setEditingScript(null);
  };

  const nonValidatedScripts = mockScripts.filter(script => !script.isValidated);
  const showAlert = nonValidatedScripts.length < 20;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="transition-smooth"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">{account.nom}</h1>
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
                  src={account.photo_url || account.image_url || "/placeholder.svg"} 
                  alt={account.nom}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-2 border-border"
                />
                <Button variant="outline" size="sm">
                  Changer photo
                </Button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input 
                  value={account.nom}
                  onChange={(e) => updateAccount({ nom: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Jours de stage</label>
                <div className="text-2xl font-bold text-primary">{account.days_in_internship}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Vues totales</label>
                <div className="text-2xl font-bold text-accent">{account.vues_totales.toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Compte TikTok</label>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => account.lien_tiktok && window.open(account.lien_tiktok, '_blank')}
                  disabled={!account.lien_tiktok}
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
                    value={account.prompt || ""}
                    onChange={(e) => updateAccount({ prompt: e.target.value })}
                    className="min-h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Personnalité</label>
                  <Textarea 
                    value={account.personnalite || ""}
                    onChange={(e) => updateAccount({ personnalite: e.target.value })}
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
                  {mockScripts.map((script) => (
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

            {/* Posts publiés - placeholder for now */}
            <Card>
              <CardHeader>
                <CardTitle>Posts publiés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <p>Fonctionnalité en cours de développement</p>
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