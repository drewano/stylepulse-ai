import { Card, CardContent } from "@/components/ui/card";
import { TikTokAccount } from "@/types";

interface AccountCardProps {
  account: TikTokAccount;
  onClick: () => void;
}

const AccountCard = ({ account, onClick }: AccountCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-smooth hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <img 
          src={account.profileImage} 
          alt={account.name}
          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-border"
        />
        <h3 className="font-semibold text-lg mb-2">{account.name}</h3>
        <p className="text-sm text-muted-foreground">
          {account.daysInInternship} jours de stage
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {account.totalViews.toLocaleString()} vues
        </p>
      </CardContent>
    </Card>
  );
};

export default AccountCard;