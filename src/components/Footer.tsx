import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
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
            <p className="text-sm text-muted-foreground">
              Révolutionnez votre création de contenu avec l'IA qui comprend vos tendances et votre marque.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold">Produit</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Génération de contenu
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Détection de tendances
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Analytics IA
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Multi-plateformes
              </a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Ressources</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Documentation
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Guides
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                API
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-smooth">
                Support
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Restez informé des dernières tendances IA et fonctionnalités.
            </p>
            <div className="flex space-x-2">
              <Input placeholder="Votre email" className="flex-1" />
              <Button size="sm" className="bg-gradient-primary">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 ContentAI. Tous droits réservés.
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;