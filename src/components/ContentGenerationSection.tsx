import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wand2, 
  Image, 
  Video, 
  FileText, 
  Settings, 
  RefreshCw,
  Sparkles,
  Target,
  Palette,
  Type
} from "lucide-react";

const ContentGenerationSection = () => {
  return (
    <section id="content" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Génération de contenu
            <span className="bg-gradient-accent bg-clip-text text-transparent"> intelligente</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Créez du contenu personnalisé en quelques clics grâce à l'IA qui comprend votre marque
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Interface */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand2 className="h-5 w-5 mr-2 text-accent" />
                Assistant IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de contenu</label>
                  <Tabs defaultValue="post" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="post" className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Post
                      </TabsTrigger>
                      <TabsTrigger value="image" className="flex items-center">
                        <Image className="h-4 w-4 mr-1" />
                        Visuel
                      </TabsTrigger>
                      <TabsTrigger value="video" className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        Vidéo
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="post" className="space-y-4 mt-6">
                      <div>
                        <label className="text-sm font-medium">Sujet ou tendance</label>
                        <Input placeholder="Ex: Nouveaux produits été 2024" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Ton éditorial</label>
                        <Textarea 
                          placeholder="Décrivez le style de communication souhaité..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="image" className="space-y-4 mt-6">
                      <div>
                        <label className="text-sm font-medium">Description visuelle</label>
                        <Textarea 
                          placeholder="Décrivez l'image que vous voulez générer..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Style</label>
                          <Input placeholder="Ex: Moderne, minimal" className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Format</label>
                          <Input placeholder="Ex: Carré, Story" className="mt-1" />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="video" className="space-y-4 mt-6">
                      <div>
                        <label className="text-sm font-medium">Concept vidéo</label>
                        <Textarea 
                          placeholder="Décrivez le concept de votre vidéo courte..."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Durée cible</label>
                        <Input placeholder="Ex: 15-30 secondes" className="mt-1" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex items-center space-x-4">
                  <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer avec IA
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview/Results */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Aperçu généré
              </CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Régénérer
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mock generated content */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Post Instagram
                    </Badge>
                    <span className="text-sm text-muted-foreground">Généré avec IA</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    🌟 Découvrez notre nouvelle collection été ! Des couleurs vibrantes qui reflètent 
                    l'énergie de la saison. Chaque pièce raconte une histoire d'élégance et de modernité.
                    
                    #ModeFemme #CollectionEte2024 #StyleModerne #Fashion
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-muted/50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Palette className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">Cohérence marque: 95%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Type className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Ton éditorial: Optimisé</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-success/10">
                    <div className="text-lg font-bold text-success">8.2/10</div>
                    <div className="text-xs text-muted-foreground">Score viralité</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10">
                    <div className="text-lg font-bold text-accent">+25%</div>
                    <div className="text-xs text-muted-foreground">Engagement prévu</div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-accent hover:opacity-90">
                  Publier maintenant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContentGenerationSection;