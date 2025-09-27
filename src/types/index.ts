export interface Company {
  name: string;
  description: string;
}

export interface TikTokAccount {
  id: string;
  name: string;
  prompt: string;
  personality: string;
  profileImage: string;
  daysInInternship: number;
  tikTokUrl: string;
  totalViews: number;
  pendingScripts: Script[];
  publishedPosts: PublishedPost[];
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