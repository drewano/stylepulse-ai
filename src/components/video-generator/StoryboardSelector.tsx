import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Storyboard } from "@/types";

interface StoryboardSelectorProps {
  storyboards: Storyboard[];
  selectedStoryboardId: string | null;
  onSelectStoryboard: (id: string) => void;
  onGenerateVideo: (id: string) => void;
  isGenerating: boolean;
}

const StoryboardSelector: React.FC<StoryboardSelectorProps> = ({
  storyboards,
  selectedStoryboardId,
  onSelectStoryboard,
  onGenerateVideo,
  isGenerating
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sélectionnez un storyboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storyboards.map((storyboard) => (
          <Card 
            key={storyboard.id} 
            className={`cursor-pointer transition-all ${
              selectedStoryboardId === storyboard.id 
                ? "ring-2 ring-primary" 
                : "hover:shadow-md"
            }`}
            onClick={() => onSelectStoryboard(storyboard.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">
                Scénario #{storyboards.indexOf(storyboard) + 1}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {storyboard.user_prompt.substring(0, 80)}...
              </p>
              <div className="text-xs bg-secondary rounded px-2 py-1 inline-block">
                {storyboard.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedStoryboardId && (
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => onGenerateVideo(selectedStoryboardId)}
            disabled={isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Générer la vidéo"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryboardSelector;