import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVideoGenerator } from "@/hooks/useVideoGenerator";
import PromptInput from "./PromptInput";
import StoryboardSelector from "./StoryboardSelector";
import VideoPreview from "./VideoPreview";
import { Storyboard, GeneratedVideo } from "@/types";

type WorkflowStep = "prompt" | "storyboards" | "generating" | "preview";

interface TikTokGeneratorProps {
  accountId: string;
}

const TikTokGenerator: React.FC<TikTokGeneratorProps> = ({ accountId }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<WorkflowStep>("prompt");
  const [selectedStoryboardId, setSelectedStoryboardId] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);

  const { 
    generateStoryboards, 
    generateVideo, 
    fetchStoryboards,
    fetchGeneratedVideos 
  } = useVideoGenerator();

  // Récupérer les storyboards et vidéos existants pour le compte
  const { data: storyboards = [], refetch: refetchStoryboards } = fetchStoryboards(accountId);
  const { data: videos = [] } = fetchGeneratedVideos(accountId);

  const handleGenerateStoryboards = async (prompt: string) => {
    try {
      setStep("generating");
      await generateStoryboards.mutateAsync({ userPrompt: prompt, accountId });
      await refetchStoryboards(); // Rafraîchir les storyboards après la génération
      setStep("storyboards");
      toast({
        title: "Succès",
        description: "Les scénarios ont été générés avec succès !"
      });
    } catch (error) {
      setStep("prompt"); // Revenir à l'étape de prompt en cas d'erreur
      console.error("Erreur lors de la génération des storyboards:", error);
      toast({
        title: "Erreur",
        description: "Échec de la génération des scénarios. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  const handleSelectStoryboard = (id: string) => {
    setSelectedStoryboardId(id);
  };

  const handleGenerateVideo = async (storyboardId: string) => {
    try {
      setStep("generating");
      await generateVideo.mutateAsync({ storyboardId });
      
      // Trouver la vidéo nouvellement créée
      const newVideo = videos.find(v => v.storyboard_id === storyboardId);
      if (newVideo) {
        setGeneratedVideo(newVideo);
      }
      
      setStep("preview");
      toast({
        title: "Succès",
        description: "La vidéo est en cours de génération !"
      });
    } catch (error) {
      setStep("storyboards");
      console.error("Erreur lors de la génération de la vidéo:", error);
      toast({
        title: "Erreur",
        description: "Échec de la génération de la vidéo. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Afficher la dernière vidéo générée si aucune n'est sélectionnée
  const displayVideo = generatedVideo || videos[0] || null;

  return (
    <div className="space-y-6">
      {step === "prompt" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Créer une vidéo TikTok</h2>
          <p className="text-muted-foreground">
            Décrivez le concept de votre vidéo TikTok et nous allons créer des scénarios pour vous.
          </p>
          <PromptInput 
            onSubmit={handleGenerateStoryboards} 
            isLoading={generateStoryboards.isPending} 
          />
        </div>
      )}

      {step === "storyboards" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Sélectionner un storyboard</h2>
          <p className="text-muted-foreground">
            Choisissez un scénario parmi les options ci-dessous pour générer votre vidéo.
          </p>
          <StoryboardSelector
            storyboards={storyboards}
            selectedStoryboardId={selectedStoryboardId}
            onSelectStoryboard={handleSelectStoryboard}
            onGenerateVideo={handleGenerateVideo}
            isGenerating={generateVideo.isPending}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep("prompt")}
              className="text-sm text-muted-foreground hover:underline"
            >
              Modifier le prompt
            </button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Génération en cours</h2>
          <p className="text-muted-foreground text-center">
            {generateStoryboards.isPending 
              ? "Création des scénarios..." 
              : generateVideo.isPending 
              ? "Génération de la vidéo..." 
              : "Traitement en cours..."}
          </p>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Prévisualisation de la vidéo</h2>
          <p className="text-muted-foreground">
            Voici votre vidéo TikTok générée. Vous pouvez la visionner et la télécharger.
          </p>
          <VideoPreview 
            video={displayVideo} 
            isLoading={generateVideo.isPending || (step === "preview" && !displayVideo)}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep("storyboards")}
              className="text-sm text-muted-foreground hover:underline"
            >
              Choisir un autre storyboard
            </button>
            <button
              onClick={() => setStep("prompt")}
              className="text-sm text-muted-foreground hover:underline ml-4"
            >
              Créer une nouvelle vidéo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TikTokGenerator;