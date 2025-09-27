import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, TrendingUp, Users } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ContentAI
            </span>
            <span className="text-xs text-muted-foreground">
              Génération intelligente
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="#dashboard" className="text-sm font-medium hover:text-primary transition-smooth">
            Dashboard
          </a>
          <a href="#content" className="text-sm font-medium hover:text-primary transition-smooth">
            Création
          </a>
          <a href="#trends" className="text-sm font-medium hover:text-primary transition-smooth">
            Tendances
          </a>
          <a href="#analytics" className="text-sm font-medium hover:text-primary transition-smooth">
            Analytics
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="hidden sm:flex">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
          <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-smooth">
            <TrendingUp className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;