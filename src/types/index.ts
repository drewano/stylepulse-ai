export interface Company {
  name: string;
  description: string;
}

export interface TikTokAccount {
  id: string;
  username: string; // Corresponds to social_accounts.username
  prompt: string | null;
  personality: string | null;
  profile_picture_url: string | null;
  days_in_internship: number;
  tiktok_url: string | null;
  total_views: number;
  workspace_id: string;
  platform: string;
  created_at: string;
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