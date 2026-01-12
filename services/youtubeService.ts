
import { YouTubeVideo } from '../types';

const API_KEY = process.env.API_KEY;

export const searchYouTubeVideos = async (
  query: string, 
  duration: 'any' | 'short' | 'medium' | 'long' = 'any',
  minRatio: number = 0
): Promise<YouTubeVideo[]> => {
  try {
    const durationParam = duration !== 'any' ? `&videoDuration=${duration}` : '';
    
    // 1. Search for videos
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=15${durationParam}&key=${API_KEY}`
    );
    const searchData = await searchRes.json();

    if (searchData.error) throw new Error(searchData.error.message);

    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
    const channelIds = Array.from(new Set(searchData.items.map((item: any) => item.snippet.channelId))).join(',');

    // 2. Get Video Statistics
    const videoStatsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${API_KEY}`
    );
    const videoStatsData = await videoStatsRes.json();

    // 3. Get Channel Statistics
    const channelStatsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${API_KEY}`
    );
    const channelStatsData = await channelStatsRes.json();

    const channelStatsMap = channelStatsData.items.reduce((acc: any, item: any) => {
      acc[item.id] = parseInt(item.statistics.subscriberCount) || 1;
      return acc;
    }, {});

    // 4. Transform and Filter by Ratio
    const videos = videoStatsData.items.map((item: any) => {
      const viewCount = parseInt(item.statistics.viewCount) || 0;
      const subCount = channelStatsMap[item.snippet.channelId] || 1;
      const performanceRatio = (viewCount / subCount);

      return {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        viewCount,
        commentCount: parseInt(item.statistics.commentCount) || 0,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        subscriberCount: subCount,
        performanceRatio,
        publishedAt: item.snippet.publishedAt,
      };
    });

    return videos.filter((v: YouTubeVideo) => v.performanceRatio >= minRatio);
  } catch (err: any) {
    console.error('YouTube API Error:', err);
    throw err;
  }
};

export const fetchComments = async (videoId: string): Promise<string[]> => {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&textFormat=plainText&key=${API_KEY}`
    );
    const data = await res.json();
    if (data.error) return [];
    return data.items.map((item: any) => item.snippet.topLevelComment.snippet.textDisplay);
  } catch (err) {
    console.error('Fetch Comments Error:', err);
    return [];
  }
};
