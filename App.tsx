
import React, { useState } from 'react';
import { AppState, YouTubeVideo, CommentAnalysis, ScriptOutline } from './types';
import { searchYouTubeVideos, fetchComments } from './services/youtubeService';
import { analyzeVideoContent, generateScriptOutline } from './services/geminiService';
import VideoCard from './components/VideoCard';
import AnalysisModal from './components/AnalysisModal';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState<'any' | 'short' | 'medium' | 'long'>('any');
  const [minRatio, setMinRatio] = useState<number>(0);
  
  const [state, setState] = useState<AppState>({
    isSearching: false,
    isAnalyzing: false,
    isGeneratingScript: false,
    videos: [],
    selectedVideo: null,
    analysis: null,
    selectedKeyword: null,
    scriptOutline: null,
    error: null,
  });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setState(prev => ({ ...prev, isSearching: true, error: null, videos: [] }));
    try {
      const results = await searchYouTubeVideos(query, duration, minRatio);
      setState(prev => ({ 
        ...prev, 
        isSearching: false, 
        videos: results.sort((a, b) => b.performanceRatio - a.performanceRatio) 
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isSearching: false, error: err.message || 'Failed to search' }));
    }
  };

  const handleSelectVideo = async (video: YouTubeVideo) => {
    setState(prev => ({ 
      ...prev, 
      selectedVideo: video, 
      isAnalyzing: true, 
      analysis: null, 
      selectedKeyword: null, 
      scriptOutline: null 
    }));
    try {
      const comments = await fetchComments(video.id);
      if (comments.length === 0) throw new Error("No comments found.");
      const analysis = await analyzeVideoContent(video.title, comments);
      setState(prev => ({ ...prev, isAnalyzing: false, analysis }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: err.message }));
    }
  };

  const handleKeywordSelect = async (keyword: string) => {
    if (!state.selectedVideo) return;
    setState(prev => ({ ...prev, selectedKeyword: keyword, isGeneratingScript: true, scriptOutline: null }));
    try {
      const outline = await generateScriptOutline(keyword, state.selectedVideo.title);
      setState(prev => ({ ...prev, isGeneratingScript: false, scriptOutline: outline }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isGeneratingScript: false, error: err.message }));
    }
  };

  const closeAnalysis = () => {
    setState(prev => ({ ...prev, selectedVideo: null, analysis: null, scriptOutline: null, selectedKeyword: null }));
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa]">
      {/* Search Header */}
      <nav className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 shrink-0">
                <div className="bg-rose-600 p-2 rounded-xl shadow-lg shadow-rose-200">
                  <i className="fa-brands fa-youtube text-white text-xl"></i>
                </div>
                <h1 className="font-black text-xl tracking-tighter">VIRAL<span className="text-rose-600 underline decoration-2 underline-offset-4">ENGINE</span></h1>
              </div>

              <form onSubmit={handleSearch} className="flex-1 w-full max-w-4xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Keyword (e.g., iPhone 16 Review, Cooking ASMR)..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl transition-all text-sm outline-none"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-500"></i>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <select 
                      value={duration} 
                      onChange={(e: any) => setDuration(e.target.value)}
                      className="bg-gray-100 border-none rounded-2xl px-4 py-3 text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-rose-500 transition-all"
                    >
                      <option value="any">ALL FORMATS</option>
                      <option value="short">SHORTS (< 4m)</option>
                      <option value="medium">MEDIUM (4-20m)</option>
                      <option value="long">LONG (> 20m)</option>
                    </select>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase">Min Ratio</span>
                      <input 
                        type="number" 
                        min="0" 
                        step="0.1"
                        value={minRatio}
                        onChange={(e) => setMinRatio(parseFloat(e.target.value))}
                        className="w-12 bg-transparent text-xs font-bold outline-none text-rose-600"
                      />
                      <span className="text-[10px] font-black text-gray-400">x</span>
                    </div>

                    <button 
                      type="submit"
                      disabled={state.isSearching}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg shadow-rose-200 disabled:bg-gray-300 transition-all active:scale-95"
                    >
                      {state.isSearching ? <i className="fa-solid fa-spinner animate-spin"></i> : 'DISCOVER'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <div className="mb-8 p-4 bg-rose-50 border-2 border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <span className="text-sm font-bold">{state.error}</span>
          </div>
        )}

        {!state.isSearching && state.videos.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-white border border-gray-100 shadow-xl rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3">
              <i className="fa-solid fa-bolt-lightning text-rose-600 text-3xl"></i>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Ready to break the algorithm?</h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              We track the <strong>Viral Ratio</strong> (Views vs. Subscribers) to find content that actually converts strangers into fans. Filter by format and ratio above to begin.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {state.videos.map(video => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onSelect={handleSelectVideo} 
            />
          ))}
        </div>
      </main>

      {state.selectedVideo && (
        <AnalysisModal 
          video={state.selectedVideo}
          analysis={state.analysis}
          isLoading={state.isAnalyzing}
          onClose={closeAnalysis}
          onSelectKeyword={handleKeywordSelect}
          selectedKeyword={state.selectedKeyword}
          scriptOutline={state.scriptOutline}
          isGeneratingScript={state.isGeneratingScript}
        />
      )}
    </div>
  );
};

export default App;
