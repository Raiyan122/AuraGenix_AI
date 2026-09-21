import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronRight, 
  Cpu, 
  TrendingUp,
  Calendar,
  Clock,
  ArrowRight,
  PlusCircle,
  Filter,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { AI_TOOLS_DATA } from './data/tools';
import { AITool, ToolCategory, PricingType } from './types';
import { filterAndRankTools, POPULAR_SEARCH_TERMS } from './utils/search';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { ToolDetailPage } from './components/ToolDetailPage';
import { ReviewModal } from './components/ReviewModal';
import { SubmitToolModal } from './components/SubmitToolModal';
import { InfoModals } from './components/InfoModals';
import { Footer } from './components/Footer';

const CATEGORIES: ToolCategory[] = [
  'All',
  'Chatbots & Assistants',
  'Coding & Dev',
  'Copywriting & Content',
  'Image Generation',
  'Video Generation',
  'Audio & Music',
  'Productivity & Notes',
  'SEO & Marketing',
  'Design & 3D',
  'Research & Data',
];

const INITIAL_VISIBLE_COUNT = 24;
const LOAD_MORE_STEP = 24;
const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

type RouteState = 
  | { view: 'home' }
  | { view: 'tool'; toolId: string };

export default function App() {
  // Hash-based client-side routing
  const [route, setRoute] = useState<RouteState>(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/tool/')) {
      const toolId = window.location.hash.replace('#/tool/', '').trim();
      if (toolId) return { view: 'tool', toolId };
    }
    return { view: 'home' };
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [pricingFilter, setPricingFilter] = useState<PricingType>('All');
  const [sortOption, setSortOption] = useState<'relevance' | 'rating' | 'reviews' | 'name'>('relevance');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Modals state
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Sync hash changes (Back / Forward browser buttons and bookmarks)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tool/')) {
        const toolId = hash.replace('#/tool/', '').trim();
        const found = AI_TOOLS_DATA.find((t) => t.id === toolId);
        if (found) {
          setRoute({ view: 'tool', toolId });
          return;
        }
      }
      setRoute({ view: 'home' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync document title and meta tag based on current view
  useEffect(() => {
    if (route.view === 'tool') {
      const tool = AI_TOOLS_DATA.find((t) => t.id === route.toolId);
      if (tool) {
        document.title = `${tool.name} Review (2026) - Features, Pricing & Alternatives | AuraGenix AI`;
        return;
      }
    }
    document.title = 'AuraGenix AI — Discover & Compare the Best AI Tools of 2026';
  }, [route]);

  // Navigation handlers
  const navigateToTool = (toolId: string) => {
    window.location.hash = `#/tool/${toolId}`;
    setRoute({ view: 'tool', toolId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (sectionId?: string) => {
    window.location.hash = '#/';
    setRoute({ view: 'home' });
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToCategory = (category: ToolCategory) => {
    setActiveCategory(category);
    navigateToHome('tools-grid');
  };

  const focusSearch = () => {
    if (route.view === 'tool') {
      navigateToHome();
    }
    setTimeout(() => {
      const input = document.getElementById('ai-tool-search-input') as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
      } else {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  // Keyboard shortcut: Pressing '/' focuses the search bar anywhere in the app
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (e.key === '/' && !isInput) {
        e.preventDefault();
        focusSearch();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [route.view]);

  // Find currently active tool if in detail view
  const activeTool = useMemo(() => {
    if (route.view === 'tool') {
      return AI_TOOLS_DATA.find((t) => t.id === route.toolId) || null;
    }
    return null;
  }, [route]);

  // Filtered and sorted tools for the home view with multi-token real-time narrowing & relevance ranking
  const filteredTools = useMemo(() => {
    return filterAndRankTools(
      AI_TOOLS_DATA,
      searchQuery,
      activeCategory,
      pricingFilter,
      sortOption
    );
  }, [searchQuery, activeCategory, pricingFilter, sortOption]);

  // Reset pagination when search query, category, or pricing changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleCategorySelect = (category: ToolCategory) => {
    setActiveCategory(category);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handlePricingSelect = (pricing: PricingType) => {
    setPricingFilter(pricing);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
    setPricingFilter('All');
    setSortOption('relevance');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const currentVisibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Header / Navbar */}
      <Navbar 
        onSubmitToolClick={() => setIsSubmitOpen(true)} 
        onNavigateHome={navigateToHome}
        onSearchClick={focusSearch}
        currentView={route.view}
      />

      {/* 2. DYNAMIC VIEW SWITCHING */}
      {route.view === 'tool' && activeTool ? (
        <ToolDetailPage
          tool={activeTool}
          allTools={AI_TOOLS_DATA}
          onBackToHome={() => navigateToHome('tools-grid')}
          onSelectAlternative={navigateToTool}
          onSelectCategory={navigateToCategory}
        />
      ) : (
        <main className="flex-grow">
          
          {/* 2. Hero Section with dynamic search and quick category pills */}
          <Hero
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
            categories={CATEGORIES}
            totalResults={filteredTools.length}
            allTools={AI_TOOLS_DATA}
            onSelectTool={(tool) => navigateToTool(tool.id)}
            onViewAllResults={() => {
              const grid = document.getElementById('tools-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 3. AI Tool Grid Section */}
          <section id="tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Controls Bar: Section Heading, Pricing Chips & Sort */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-8 border-b border-slate-800/80">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Featured AI Software Reviews
                  </h2>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
                    {filteredTools.length} of {AI_TOOLS_DATA.length} tools
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  {searchQuery ? (
                    <span>
                      Showing live matching AI tools for <strong className="text-cyan-400">"{searchQuery}"</strong>
                      {activeCategory !== 'All' && <span> in <strong className="text-slate-200">{activeCategory}</strong></span>}
                    </span>
                  ) : (
                    <span>Independent laboratory reviews with benchmark ratings, pricing transparency, and verified editorial summaries.</span>
                  )}
                </p>
              </div>

              {/* Filter and Sort controls */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Pricing Filter Chips */}
                <div className="flex items-center gap-1 bg-[#0b0f1e] p-1 rounded-xl border border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 px-2">Pricing:</span>
                  {(['All', 'Free', 'Freemium', 'Paid'] as PricingType[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePricingSelect(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        pricingFilter === p
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 bg-[#0b0f1e] px-3 py-1.5 rounded-xl border border-slate-800">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-400">Sort:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="relevance" className="bg-[#0b0f1e]">Best Match (Relevance)</option>
                    <option value="rating" className="bg-[#0b0f1e]">Highest Rated</option>
                    <option value="reviews" className="bg-[#0b0f1e]">Most Reviews</option>
                    <option value="name" className="bg-[#0b0f1e]">Alphabetical</option>
                  </select>
                </div>

                {/* Reset Filters button if filters are active */}
                {(searchQuery || activeCategory !== 'All' || pricingFilter !== 'All') && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    title="Reset all search and category filters"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Reset</span>
                  </button>
                )}

              </div>
            </div>

            {/* Quick in-page Category Scroller for fast browsing */}
            <div className="mb-8 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
                <Filter className="w-3 h-3 text-cyan-400" />
                <span>Category:</span>
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Tool Cards Grid */}
            {filteredTools.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="tool-cards-container">
                  {currentVisibleTools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      tool={tool}
                      onReadReview={(t) => navigateToTool(t.id)}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>

                {/* Load More & High-Performance Pagination Bar */}
                {hasMore && (
                  <div className="mt-12 text-center flex flex-col items-center gap-4">
                    {/* Visual Progress Bar */}
                    <div className="w-full max-w-xs bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((currentVisibleTools.length / filteredTools.length) * 100))}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-cyan-500/20"
                        id="load-more-tools-btn"
                      >
                        <span>Load Next {Math.min(LOAD_MORE_STEP, filteredTools.length - currentVisibleTools.length)} Tools</span>
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      </button>

                      {filteredTools.length > visibleCount && (
                        <button
                          onClick={() => setVisibleCount((prev) => prev + 96)}
                          className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
                          title="Quick load next 96 entries"
                        >
                          <span>+96 Batch</span>
                        </button>
                      )}

                      {filteredTools.length > 48 && (
                        <button
                          onClick={() => setVisibleCount(filteredTools.length)}
                          className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all cursor-pointer"
                        >
                          <span>Show All ({filteredTools.length.toLocaleString()})</span>
                        </button>
                      )}
                    </div>

                    <span className="text-xs text-slate-400">
                      Showing {currentVisibleTools.length.toLocaleString()} of {filteredTools.length.toLocaleString()} matching AI tools ({Math.round((currentVisibleTools.length / filteredTools.length) * 100)}%)
                    </span>
                  </div>
                )}

                {!hasMore && filteredTools.length > INITIAL_VISIBLE_COUNT && (
                  <div className="mt-10 text-center py-4 border-t border-slate-800/60 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>You have viewed all {filteredTools.length.toLocaleString()} tools in this selection.</span>
                    </div>
                    <button
                      onClick={() => {
                        const grid = document.getElementById('tools-grid');
                        if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      Back to Top ↑
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Upgraded Clean "No AI Tools Found" Empty State */
              <div className="text-center py-16 px-6 rounded-3xl bg-[#0a0e1e]/90 border border-slate-800/90 max-w-2xl mx-auto shadow-2xl" id="no-tools-found-state">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-950/70 to-slate-800/80 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                  <Search className="w-8 h-8 text-cyan-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">No AI Tools Found</h3>
                
                <p className="text-sm text-slate-300 mb-6 leading-relaxed max-w-lg mx-auto">
                  {searchQuery ? (
                    <>
                      No artificial intelligence software matched your search for <strong className="text-cyan-300 font-semibold">"{searchQuery}"</strong>
                      {activeCategory !== 'All' ? ` within the ${activeCategory} category` : ''}.
                    </>
                  ) : (
                    <>No tools currently match the selected {activeCategory} category and {pricingFilter} pricing filters.</>
                  )}
                </p>

                {/* Helpful Suggestions */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 mb-6 text-left max-w-md mx-auto">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                    Popular AI Tool Searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SEARCH_TERMS.slice(0, 6).map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          handleSearchChange(term);
                          setActiveCategory('All');
                        }}
                        className="px-3 py-1 text-xs rounded-xl bg-[#070b16] hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                    >
                      <span>Clear Search Keywords</span>
                    </button>
                  )}
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters &amp; View All Tools</span>
                  </button>
                </div>
              </div>
            )}

          </section>

          {/* 4. Editorial Guide / Methodology Section */}
          <section id="categories-section" className="py-16 bg-[#060813] border-t border-slate-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evaluation Standard 2026</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
                  How We Review &amp; Benchmark AI Tools
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Every artificial intelligence platform in the AuraGenix directory undergoes rigorous hands-on technical testing across four pillars before earning our editorial verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 font-bold text-sm">
                    01
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Throughput &amp; Latency</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We measure tokens-per-second, time-to-first-token (TTFT), and video/image rendering queues across US cloud regions.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-blue-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 font-bold text-sm">
                    02
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Instruction Adherence</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tested against rigorous edge cases, complex multi-step reasoning, negative prompt adherence, and output format consistency.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-purple-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-bold text-sm">
                    03
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Data Privacy &amp; IP Rights</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verification of training data opt-outs, enterprise Zero Data Retention (ZDR) guarantees, and commercial copyright warranties.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-bold text-sm">
                    04
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">True Cost-to-Value</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Audit of credit burning rates, hidden overages, and cost per seat compared against direct API model invocation.
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* 5. Pricing Guide Teaser */}
          <section id="pricing-guide" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-950/40 via-purple-950/30 to-slate-900/50 border border-slate-800 p-8 sm:p-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
                  2026 AI Budgeting Guide
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                  Which AI Subscription Model Fits Your Team?
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Most US software teams spend between $40 to $200 per seat each month on overlapping AI tools. Explore our comparative breakdown of Free, Freemium, and Enterprise plans across 1,000 benchmarked platforms.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      handlePricingSelect('Free');
                      const grid = document.getElementById('tools-grid');
                      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    View 100% Free Tools
                  </button>
                  <button
                    onClick={() => {
                      handlePricingSelect('Freemium');
                      const grid = document.getElementById('tools-grid');
                      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    View Freemium Tools
                  </button>
                  <button
                    onClick={() => {
                      handlePricingSelect('Paid');
                      const grid = document.getElementById('tools-grid');
                      if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer"
                  >
                    View Enterprise Tools
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Blog & AI Insights */}
          <section id="ai-insights" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1 block">
                  AuraGenix Intelligence
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Latest AI Software Analyses
                </h2>
              </div>
              <a href="#tools-grid" className="text-xs font-semibold text-cyan-400 hover:underline mt-2 sm:mt-0 flex items-center gap-1">
                <span>View all 1,000 tool reviews</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <article className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2026 Analysis</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>5 min read</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 hover:text-cyan-300 transition-colors">
                    Claude 3.7 vs. Cursor vs. Windsurf: Which Coding Agent Wins in 2026?
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    A side-by-side benchmark measuring multi-file refactoring accuracy, terminal tool calling, and token consumption across a 40,000-line TypeScript codebase.
                  </p>
                </div>
                <button 
                  onClick={() => navigateToTool('claude-3-7-sonnet')}
                  className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Read In-Depth Review</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </article>

              <article className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2026 Analysis</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>7 min read</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 hover:text-cyan-300 transition-colors">
                    Runway Gen-3 vs. Luma vs. Sora: Best AI Video Workflows
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    Examining camera trajectory controls, temporal consistency, and prompt fidelity across top generative video foundation models.
                  </p>
                </div>
                <button 
                  onClick={() => navigateToTool('runway-gen-3')}
                  className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Read In-Depth Review</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </article>

              <article className="p-6 rounded-2xl bg-[#090d1c] border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>2026 Analysis</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>4 min read</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 hover:text-cyan-300 transition-colors">
                    The Death of 10 Blue Links: How Perplexity Pro Replaced Traditional Search
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    How real-time citation synthesis and multi-LLM routing cut technical research time by 65% for startup founders and analysts.
                  </p>
                </div>
                <button 
                  onClick={() => navigateToTool('perplexity-pro')}
                  className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Read In-Depth Review</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </article>

            </div>
          </section>

        </main>
      )}

      {/* 7. Footer */}
      <Footer
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenContact={() => setInfoModalType('contact')}
      />

      {/* Modals */}
      <ReviewModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
      />

      <SubmitToolModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        categories={CATEGORIES}
      />

      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

    </div>
  );
}
