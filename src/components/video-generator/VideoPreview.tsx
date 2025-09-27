import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GeneratedVideo } from "@/types";

interface VideoPreviewProps {
  video: GeneratedVideo | null;
  isLoading?: boolean;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ video, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prévisualisation de la vidéo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full aspect-video" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!video) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prévisualisation de la vidéo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aucune vidéo générée pour le moment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prévisualisation de la vidéo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {video.video_url ? (
          <div className="space-y-2">
            <video 
              src={video.video_url} 
              controls 
              className="w-full aspect-video rounded-md"
            />
            <p className="text-sm text-muted-foreground">
              Statut: <span className="capitalize">{video.status}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-video flex items-center justify-center">
              <p className="text-muted-foreground">Vidéo en cours de génération...</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Statut: <span className="capitalize">{video.status}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPreview;