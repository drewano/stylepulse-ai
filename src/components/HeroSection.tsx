import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Target, Clock, Users } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-accent text-accent-foreground">
                <Zap className="h-3 w-3 mr-1" />
                IA Générative Avancée
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Créez du contenu
                <span className="bg-gradient-hero bg-clip-text text-transparent"> 
                  {" "}viral{" "}
                </span>
                automatiquement
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Plateforme IA qui génère du contenu cohérent avec votre identité de marque 
                en exploitant les tendances temps réel pour maximiser l'engagement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-glow">
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="transition-smooth">
                Voir la démo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">90%</div>
                <div className="text-sm text-muted-foreground">Temps économisé</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3x</div>
                <div className="text-sm text-muted-foreground">Plus d'engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Détection tendances</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <Card className="overflow-hidden shadow-lg">
              <img 
                src={heroImage} 
                alt="Dashboard ContentAI"
                className="w-full h-auto transition-smooth hover:scale-105"
              />
            </Card>
            
            {/* Floating cards */}
            <Card className="absolute -top-4 -left-4 p-4 bg-card/90 backdrop-blur">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">Ciblage précis</span>
              </div>
            </Card>
            
            <Card className="absolute -bottom-4 -right-4 p-4 bg-card/90 backdrop-blur">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Temps réel</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;