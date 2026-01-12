
import React from 'react';
import { YouTubeVideo, CommentAnalysis, ScriptOutline } from '../types';

interface Props {
  video: YouTubeVideo;
  analysis: CommentAnalysis | null;
  isLoading: boolean;
  onClose: () => void;
  onSelectKeyword: (keyword: string) => void;
  selectedKeyword: string | null;
  scriptOutline: ScriptOutline | null;
  isGeneratingScript: boolean;
}

const AnalysisModal: React.FC<Props> = ({ 
  video, 
  analysis, 
  isLoading, 
  onClose, 
  onSelectKeyword,
  selectedKeyword,
  scriptOutline,
  isGeneratingScript
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <img src={video.thumbnail} className="w-24 h-14 object-cover rounded-lg shadow-sm" alt="thumb" />
            <div>
              <h2 className="font-bold text-lg line-clamp-1 text-gray-800">{video.title}</h2>
              <p className="text-xs text-rose-600 font-bold uppercase tracking-widest">
                <i className="fa-solid fa-chart-line mr-1"></i> 
                Performance Analysis
              </p>
            </div>
          </div>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 transition-colors rounded-full w-10 h-10 flex items-center justify-center text-gray-500">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-600"></div>
                <i className="fa-brands fa-google absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-600"></i>
              </div>
              <p className="mt-6 text-gray-500 font-medium animate-pulse italic">Gemini 2.5 is reading 50+ comments and synthesizing data...</p>
            </div>
          ) : analysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Analysis Insights */}
              <div className="lg:col-span-7 space-y-8">
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <h3 className="text-blue-900 font-black mb-3 flex items-center gap-2 uppercase text-sm tracking-tighter">
                    <i className="fa-solid fa-brain"></i> Audience Intelligence
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Summary</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{analysis.summary}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">Sentiment & Reaction</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{analysis.audienceReaction}</p>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                    <h4 className="text-green-800 font-bold text-xs mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-check-circle"></i> Strengths (PROS)
                    </h4>
                    <ul className="space-y-2">
                      {analysis.pros.map((p, i) => (
                        <li key={i} className="text-xs text-green-700 bg-white p-2 rounded shadow-sm border border-green-100">{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                    <h4 className="text-amber-800 font-bold text-xs mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-exclamation-triangle"></i> Gaps (CONS)
                    </h4>
                    <ul className="space-y-2">
                      {analysis.cons.map((c, i) => (
                        <li key={i} className="text-xs text-amber-700 bg-white p-2 rounded shadow-sm border border-amber-100">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <section>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-tags text-rose-500"></i> Recommended Content Keywords
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">Click a keyword to generate a professional script outline for your next video.</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((k, i) => (
                      <button
                        key={i}
                        onClick={() => onSelectKeyword(k)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                          selectedKeyword === k 
                            ? 'bg-rose-600 border-rose-600 text-white scale-105 shadow-md' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-rose-400 hover:text-rose-600'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right Column: Script Generation */}
              <div className="lg:col-span-5">
                <div className="bg-gray-900 text-white rounded-2xl p-6 min-h-[400px] flex flex-col shadow-xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center">
                      <i className="fa-solid fa-feather-pointed text-xs"></i>
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-widest">Script Planner</h3>
                  </div>

                  {isGeneratingScript ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-gray-400 animate-pulse">Drafting content structure...</p>
                    </div>
                  ) : scriptOutline ? (
                    <div className="space-y-6 overflow-y-auto pr-2">
                      <div className="border-b border-gray-800 pb-4">
                        <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Suggested Title</span>
                        <h4 className="text-lg font-bold mt-1 text-white leading-tight">{scriptOutline.title}</h4>
                      </div>
                      
                      <div className="space-y-5">
                        {scriptOutline.sections.map((sec, i) => (
                          <div key={i} className="group">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-black text-rose-500/50 tabular-nums">0{i+1}</span>
                              <h5 className="font-bold text-sm text-gray-200 group-hover:text-rose-400 transition-colors">{sec.title}</h5>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed ml-7">{sec.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full mt-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                        <i className="fa-solid fa-copy group-hover:scale-110 transition-transform"></i> 
                        COPY OUTLINE TO CLIPBOARD
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                      <i className="fa-solid fa-arrow-left text-3xl text-gray-700 mb-4 animate-bounce-x"></i>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Select one of the <span className="text-rose-500 font-bold">5 keywords</span> on the left to instantly generate a professional video outline.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">Analysis failed to load.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
