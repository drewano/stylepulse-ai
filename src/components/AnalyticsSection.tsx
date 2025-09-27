import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  Target,
  Clock,
  Award,
  Zap
} from "lucide-react";

const AnalyticsSection = () => {
  const metrics = [
    { 
      title: "Engagement Total", 
      value: "2.4M", 
      change: "+32%", 
      icon: Heart, 
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    { 
      title: "Nouveaux Followers", 
      value: "12.8K", 
      change: "+18%", 
      icon: Users, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    { 
      title: "Portée Mensuelle", 
      value: "890K", 
      change: "+25%", 
      icon: TrendingUp, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      title: "Contenu Viral", 
      value: "47", 
      change: "+156%", 
      icon: Zap, 
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  const topContent = [
    {
      title: "Summer Fashion Reel",
      platform: "Instagram",
      type: "Reel",
      engagement: "245K",
      reach: "1.2M",
      trend: "Summer vibes",
      score: 9.2
    },
    {
      title: "AI Tools Review",
      platform: "YouTube",
      type: "Vidéo",
      engagement: "189K",
      reach: "890K",
      trend: "Tech innovation",
      score: 8.8
    },
    {
      title: "Sustainable Living Tips",
      platform: "TikTok",
      type: "Série",
      engagement: "312K",
      reach: "1.5M",
      trend: "Eco-friendly",
      score: 9.5
    }
  ];

  const weeklyData = [
    { day: "Lun", posts: 3, engagement: 85 },
    { day: "Mar", posts: 2, engagement: 92 },
    { day: "Mer", posts: 4, engagement: 78 },
    { day: "Jeu", posts: 3, engagement: 95 },
    { day: "Ven", posts: 5, engagement: 112 },
    { day: "Sam", posts: 2, engagement: 67 },
    { day: "Dim", posts: 1, engagement: 45 }
  ];

  return (
    <section id="analytics" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Analytics
            <span className="bg-gradient-accent bg-clip-text text-transparent"> intelligents</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez vos performances en temps réel et optimisez votre stratégie grâce aux insights IA
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-success">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold">{metric.value}</h3>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Charts */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Performance hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="engagement" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="reach">Portée</TabsTrigger>
                  <TabsTrigger value="growth">Croissance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="engagement" className="mt-6">
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium">{day.day}</div>
                        <div className="flex-1 flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full transition-smooth"
                              style={{ width: `${Math.min(day.engagement, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium w-12">{day.engagement}%</div>
                        </div>
                        <div className="text-xs text-muted-foreground w-16">
                          {day.posts} posts
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="reach" className="mt-6">
                  <div className="text-center p-8 text-muted-foreground">
                    Données de portée disponibles prochainement
                  </div>
                </TabsContent>
                
                <TabsContent value="growth" className="mt-6">
                  <div className="text-center p-8 text-muted-foreground">
                    Analyse de croissance en cours de développement
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-accent" />
                Insights IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-accent/10 border border-accent/20">
                <div className="flex items-center mb-2">
                  <Award className="h-4 w-4 mr-2 text-accent" />
                  <span className="text-sm font-medium">Opportunité détectée</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Vos posts du vendredi génèrent +40% d'engagement. Augmentez la fréquence.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Timing optimal</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Publiez entre 18h-20h pour maximiser la portée de votre audience.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-subtle border">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-4 w-4 mr-2 text-success" />
                  <span className="text-sm font-medium">Contenu recommandé</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Les formats "Behind the scenes" performent +65% mieux actuellement.
                </p>
              </div>

              <Button className="w-full bg-gradient-accent hover:opacity-90">
                Voir tous les insights
              </Button>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-success" />
                Contenu le plus performant
              </CardTitle>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Dernier mois
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-smooth">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                      <div>
                        <h4 className="font-semibold">{content.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{content.platform}</span>
                          <span>•</span>
                          <span>{content.type}</span>
                          <span>•</span>
                          <span>Trend: {content.trend}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center text-sm">
                          <Heart className="h-4 w-4 mr-1 text-accent" />
                          {content.engagement}
                        </div>
                        <div className="text-xs text-muted-foreground">Engagement</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-1 text-primary" />
                          {content.reach}
                        </div>
                        <div className="text-xs text-muted-foreground">Portée</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-bold text-success">{content.score}</div>
                        <div className="text-xs text-muted-foreground">Score IA</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;