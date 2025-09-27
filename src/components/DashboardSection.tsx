import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Users, 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Target,
  Sparkles,
  Clock,
  Heart,
  MessageCircle,
  Share2
} from "lucide-react";

const DashboardSection = () => {
  const accounts = [
    { name: "Brand Fashion", followers: "125K", engagement: 4.2, color: "bg-accent" },
    { name: "TechStart", followers: "89K", engagement: 3.8, color: "bg-primary" },
    { name: "FoodieLife", followers: "203K", engagement: 5.1, color: "bg-success" },
  ];

  const recentContent = [
    { 
      type: "Post Instagram", 
      status: "Publié", 
      engagement: "+15%", 
      trend: "Summer vibes",
      metrics: { likes: 2400, comments: 156, shares: 89 }
    },
    { 
      type: "Reel TikTok", 
      status: "Programmé", 
      engagement: "Prévu +20%", 
      trend: "Dance challenge",
      metrics: { likes: 0, comments: 0, shares: 0 }
    },
    { 
      type: "Story Facebook", 
      status: "Généré", 
      engagement: "+8%", 
      trend: "Product launch",
      metrics: { likes: 890, comments: 34, shares: 12 }
    },
  ];

  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Dashboard multi-comptes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Gérez toutes vos marques depuis une interface centralisée avec l'intelligence artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Accounts Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Comptes gérés
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${account.color} flex items-center justify-center`}>
                      <span className="text-white font-bold">
                        {account.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {account.followers} followers
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-success text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {account.engagement}% engagement
                    </div>
                    <Progress value={account.engagement * 20} className="w-20 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-accent" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-primary">
                <Target className="h-4 w-4 mr-2" />
                Générer du contenu
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Planifier posts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analyser tendances
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Voir analytics
              </Button>
            </CardContent>
          </Card>

          {/* Recent Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Contenu récent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-smooth">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <div>
                        <h4 className="font-medium">{content.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Tendance: {content.trend}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {content.metrics.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {content.metrics.comments}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          {content.metrics.shares}
                        </span>
                      </div>
                      
                      <Badge 
                        variant={content.status === "Publié" ? "secondary" : "outline"}
                        className={content.status === "Publié" ? "bg-success text-success-foreground" : ""}
                      >
                        {content.status}
                      </Badge>
                      
                      <div className="text-sm font-medium text-success">
                        {content.engagement}
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

export default DashboardSection;