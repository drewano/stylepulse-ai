import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Hash, 
  Music, 
  Zap,
  ArrowUp,
  Flame,
  Target,
  BarChart3
} from "lucide-react";

const TrendsSection = () => {
  const trends = [
    {
      id: 1,
      title: "Summer Vibes Challenge",
      platform: "TikTok",
      growth: "+245%",
      audience: "18-24 ans",
      relevance: 92,
      type: "Challenge danse",
      hashtagPrimary: "#SummerVibes",
      hashtags: ["#Dance", "#Summer", "#Challenge"],
      engagement: "2.4M",
      timeLeft: "3 jours"
    },
    {
      id: 2,
      title: "Sustainable Fashion",
      platform: "Instagram",
      growth: "+180%",
      audience: "25-35 ans",
      relevance: 88,
      type: "Tendance mode",
      hashtagPrimary: "#SustainableFashion",
      hashtags: ["#EcoFriendly", "#SlowFashion", "#Green"],
      engagement: "1.8M",
      timeLeft: "1 semaine"
    },
    {
      id: 3,
      title: "WFH Setup Tour",
      platform: "YouTube",
      growth: "+156%",
      audience: "25-40 ans",
      relevance: 85,
      type: "Format vidéo",
      hashtagPrimary: "#WFHSetup",
      hashtags: ["#WorkFromHome", "#ProductivityTips", "#DeskTour"],
      engagement: "980K",
      timeLeft: "5 jours"
    },
    {
      id: 4,
      title: "AI Art Creation",
      platform: "Multi-plateforme",
      growth: "+320%",
      audience: "22-35 ans",
      relevance: 94,
      type: "Technologie",
      hashtagPrimary: "#AIArt",
      hashtags: ["#ArtificialIntelligence", "#DigitalArt", "#CreativeAI"],
      engagement: "3.2M",
      timeLeft: "2 semaines"
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "TikTok": return "bg-primary";
      case "Instagram": return "bg-accent";
      case "YouTube": return "bg-destructive";
      default: return "bg-success";
    }
  };

  return (
    <section id="trends" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Tendances
            <span className="bg-gradient-primary bg-clip-text text-transparent"> temps réel</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre IA analyse 24/7 les réseaux sociaux pour détecter les tendances émergentes pertinentes pour votre audience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trends List */}
          <div className="lg:col-span-2 space-y-6">
            {trends.map((trend) => (
              <Card key={trend.id} className="hover:shadow-lg transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(trend.platform)} mt-2`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{trend.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {trend.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Plateforme: {trend.platform} • Audience: {trend.audience}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className="bg-primary text-primary-foreground">
                            <Hash className="h-3 w-3 mr-1" />
                            {trend.hashtagPrimary}
                          </Badge>
                          {trend.hashtags.map((hashtag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center">
                            <ArrowUp className="h-4 w-4 mr-1 text-success" />
                            <span className="font-medium text-success">{trend.growth}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{trend.engagement}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{trend.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-1 text-accent" />
                        <span className="text-sm font-medium">{trend.relevance}%</span>
                      </div>
                      <Progress value={trend.relevance} className="w-16" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button variant="outline" size="sm">
                      Analyser
                    </Button>
                    <Button size="sm" className="bg-gradient-primary">
                      <Target className="h-4 w-4 mr-2" />
                      Créer contenu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trends Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-accent" />
                  Détection IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg bg-gradient-subtle">
                  <div className="text-2xl font-bold text-primary mb-1">156</div>
                  <div className="text-sm text-muted-foreground">Tendances détectées aujourd'hui</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pertinentes pour vous</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Score moyen</span>
                    <span className="text-sm font-medium text-success">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mises à jour</span>
                    <span className="text-sm font-medium">Temps réel</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Contenus suivant tendances</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement moyen</span>
                      <span className="font-medium text-success">+45%</span>
                    </div>
                    <Progress value={85} className="[&>div]:bg-success" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Viralité obtenue</span>
                      <span className="font-medium text-accent">+120%</span>
                    </div>
                    <Progress value={90} className="[&>div]:bg-accent" />
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  Voir rapport complet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendsSection;