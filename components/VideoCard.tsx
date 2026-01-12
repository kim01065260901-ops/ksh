
import React from 'react';
import { YouTubeVideo } from '../types';

interface Props {
  video: YouTubeVideo;
  onSelect: (video: YouTubeVideo) => void;
}

const VideoCard: React.FC<Props> = ({ video, onSelect }) => {
  const isBanger = video.performanceRatio > 2;

  return (
    <div 
      onClick={() => onSelect(video)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100 flex flex-col"
    >
      <div className="relative">
        <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
          isBanger ? 'bg-rose-500 animate-pulse' : 'bg-gray-800/80'
        }`}>
          {isBanger ? '🔥 BANGER' : 'Normal'}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        
        <p className="text-xs text-gray-500 mb-3">{video.channelTitle}</p>
        
        <div className="mt-auto space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Ratio (Views/Subs)</span>
            <span className={`font-bold ${isBanger ? 'text-rose-600' : 'text-gray-700'}`}>
              {(video.performanceRatio).toFixed(2)}x
            </span>
          </div>
          
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isBanger ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(video.performanceRatio * 20, 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-gray-400 pt-1">
            <span>Views: {video.viewCount.toLocaleString()}</span>
            <span>Subs: {video.subscriberCount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
