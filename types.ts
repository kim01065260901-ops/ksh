
export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  commentCount: number;
  channelId: string;
  channelTitle: string;
  subscriberCount: number;
  performanceRatio: number; // (viewCount / subscriberCount)
  publishedAt: string;
}

export interface CommentAnalysis {
  summary: string;
  pros: string[];
  cons: string[];
  keywords: string[]; // 5 recommended keywords
  audienceReaction: string;
}

export interface ScriptOutline {
  keyword: string;
  title: string;
  sections: {
    title: string;
    description: string;
  }[];
}

export interface ContentIdea {
  title: string;
  reason: string;
  expectedAppeal: string;
}

export interface AppState {
  isSearching: boolean;
  isAnalyzing: boolean;
  isGeneratingScript: boolean;
  videos: YouTubeVideo[];
  selectedVideo: YouTubeVideo | null;
  analysis: CommentAnalysis | null;
  selectedKeyword: string | null;
  scriptOutline: ScriptOutline | null;
  error: string | null;
}
