import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Décrivez la vidéo que vous souhaitez générer..."
        className="min-h-[120px]"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !prompt.trim()}>
        {isLoading ? "Génération en cours..." : "Générer les scénarios"}
      </Button>
    </form>
  );
};

export default PromptInput;