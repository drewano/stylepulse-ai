export interface Company {
  name: string;
  description: string;
}

export interface TikTokAccount {
  id: number;
  nom: string; // Corresponds to comptes.nom
  prompt: string | null;
  personnalite: string | null;
  photo_url: string | null;
  image_url: string | null;
  days_in_internship: number;
  lien_tiktok: string | null;
  vues_totales: number;
  entreprise_id: number | null;
  platform: string;
  created_at: string;
  updated_at: string;
  pendingScripts?: Script[];
  publishedPosts?: PublishedPost[];
}

export interface Script {
  id: string;
  content: string;
  isValidated: boolean;
  createdAt: Date;
}

export interface PublishedPost {
  id: string;
  script: string;
  publishedAt: Date;
  views: number;
  likes: number;
  comments: number;
  shares: number;
}