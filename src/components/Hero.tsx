import React from 'react';
import { Search, X, Zap, ShieldCheck, Star, Award, TrendingUp } from 'lucide-react';
import { ToolCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: ToolCategory;
  onCategorySelect: (category: ToolCategory) => void;
  categories: ToolCategory[];
  totalResults: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategorySelect,
  categories,
  totalResults,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-400/20 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-medium shadow-sm mb-6 hover:border-cyan-500/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-cyan-400">2026 Annual AI Index</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">250+ Benchmarked Platforms</span>
        </div>

        {/* Catchy headline targeting US audiences */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
          Discover &amp; Compare the <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
            Best AI Tools of 2026
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
          Cut through the hype with unbiased performance benchmarks, verified pricing tiers, and deep-dive technical reviews designed for modern builders, creators, and US teams.
        </p>

        {/* Search Bar Element */}
        <div className="max-w-2xl mx-auto relative mb-8 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl blur-sm opacity-40 group-hover:opacity-75 transition duration-300 -z-10" />
          
          <div className="relative flex items-center bg-[#0d1222] border border-slate-700/80 group-focus-within:border-cyan-400/80 rounded-2xl px-4 py-3.5 shadow-2xl transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 group-focus-within:text-cyan-400 transition-colors" />
            
            <input
              type="text"
              id="ai-tool-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, category, or features (e.g. 'Claude', 'Video', 'Coding')..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mr-2 cursor-pointer"
                title="Clear search"
                id="clear-search-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-700 text-[11px] text-slate-400 font-mono flex-shrink-0">
              <span className="bg-slate-800/80 px-2 py-1 rounded text-slate-300">
                {totalResults} {totalResults === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Pill Filters */}
        <div className="flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filter by Category</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl" id="category-filter-pills">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  id={`filter-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/50 scale-105'
                      : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Trust Badges & Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/70 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Unbiased</p>
              <p className="text-xs text-slate-400">Strict editorial ethics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">4.8 / 5.0 Avg</p>
              <p className="text-xs text-slate-400">Real user verified score</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Daily Updates</p>
              <p className="text-xs text-slate-400">Tested against 2026 models</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">US Market Focus</p>
              <p className="text-xs text-slate-400">Pricing in USD & API costs</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
