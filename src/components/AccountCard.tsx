import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, TrendingUp } from "lucide-react";
import { TikTokAccount } from "@/types";
import { getProfilePictureUrl } from "@/lib/supabase-storage";

interface AccountCardProps {
  account: TikTokAccount;
  onClick: () => void;
}

const AccountCard = ({ account, onClick }: AccountCardProps) => {
  const isActive = account.days_in_internship > 0;
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-md hover:shadow-glow bg-gradient-to-br from-card to-card-elevated"
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header with status */}
        <div className="flex justify-between items-start mb-4">
          <Badge 
            variant={isActive ? "default" : "secondary"} 
            className={isActive ? "bg-gradient-primary" : ""}
          >
            {isActive ? "Actif" : "Nouveau"}
          </Badge>
          {account.vues_totales > 0 && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>+{Math.floor(Math.random() * 20 + 5)}%</span>
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="relative mx-auto mb-4 w-fit">
          <img 
            src={getProfilePictureUrl(account)} 
            alt={account.nom}
            className="w-20 h-20 rounded-full object-cover border-3 border-gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          {isActive && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg mb-3 text-center group-hover:text-primary transition-colors">
          {account.nom}
        </h3>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Stage</span>
            </div>
            <span className="font-semibold">{account.days_in_internship} jours</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>Vues</span>
            </div>
            <span className="font-semibold text-accent">
              {account.vues_totales.toLocaleString()}
            </span>
          </div>

          {/* Progress bar for visual appeal */}
          <div className="mt-4 pt-3 border-t border-muted">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Progression</span>
              <span>{Math.min(account.days_in_internship * 3, 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-500 group-hover:shadow-glow"
                style={{ width: `${Math.min(account.days_in_internship * 3, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;