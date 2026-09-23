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
import { getEnterpriseAITools } from './data/scalableDatabase';
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
import { AIComparisonModal } from './components/AIComparisonModal';
import { DailyAIDeals } from './components/DailyAIDeals';
import { TrendingAINews } from './components/TrendingAINews';
import { CategoryPage } from './components/CategoryPage';
import { AdSenseUnit, StickyAnchorAd } from './components/AdSenseUnit';
import { ReviewBannerAdGrid } from './components/ReviewBannerAdGrid';
import { Swords, Tag, Radio } from 'lucide-react';
import { categoryToSlug, slugToCategory } from './utils/categoryUtils';

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
  'Legal AI',
  'Finance AI',
];

const INITIAL_VISIBLE_COUNT = 24;
const LOAD_MORE_STEP = 24;
const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

type RouteState = 
  | { view: 'home' }
  | { view: 'tool'; toolId: string }
  | { view: 'category'; category: ToolCategory }
  | { view: 'deals' }
  | { view: 'news' };

// Multi-Page Dynamic Route Parser (Supports both clean path and hash formats)
function parseCurrentRoute(allTools: AITool[]): RouteState {
  if (typeof window === 'undefined') return { view: 'home' };

  const pathname = window.location.pathname;
  const hash = window.location.hash;

  // 1. Check pathname (e.g., /tool/[tool-name] or /category/[category-name])
  if (pathname.startsWith('/tool/')) {
    const toolId = pathname.replace('/tool/', '').replace(/\/$/, '').trim();
    if (toolId && allTools.some((t) => t.id === toolId)) {
      return { view: 'tool', toolId };
    }
  } else if (pathname.startsWith('/category/')) {
    const slug = pathname.replace('/category/', '').replace(/\/$/, '').trim();
    const cat = slugToCategory(slug);
    if (cat && cat !== 'All') {
      return { view: 'category', category: cat };
    }
  } else if (pathname === '/deals' || pathname === '/deals/') {
    return { view: 'deals' };
  } else if (pathname === '/news' || pathname === '/news/') {
    return { view: 'news' };
  }

  // 2. Check hash (e.g., #/tool/[tool-name] or #/category/[category-name])
  if (hash.startsWith('#/tool/')) {
    const toolId = hash.replace('#/tool/', '').replace(/\/$/, '').trim();
    if (toolId && allTools.some((t) => t.id === toolId)) {
      return { view: 'tool', toolId };
    }
  } else if (hash.startsWith('#/category/')) {
    const slug = hash.replace('#/category/', '').replace(/\/$/, '').trim();
    const cat = slugToCategory(slug);
    if (cat && cat !== 'All') {
      return { view: 'category', category: cat };
    }
  } else if (hash === '#/deals') {
    return { view: 'deals' };
  } else if (hash === '#/news') {
    return { view: 'news' };
  }

  return { view: 'home' };
}

export default function App() {
  // Load scalable database of 10,000+ AI tools
  const allTools = useMemo(() => getEnterpriseAITools(), []);

  // Multi-page dynamic routing state
  const [route, setRoute] = useState<RouteState>(() => parseCurrentRoute(getEnterpriseAITools()));

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [pricingFilter, setPricingFilter] = useState<PricingType>('All');
  const [sortOption, setSortOption] = useState<'relevance' | 'rating' | 'reviews' | 'name'>('relevance');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Modals state
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  
  // AI vs AI Comparison modal state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareToolAId, setCompareToolAId] = useState<string | undefined>('chatgpt');
  const [compareToolBId, setCompareToolBId] = useState<string | undefined>('claude');

  // Sync hash and popstate changes (Native Back / Forward browser buttons, tabs and bookmarks)
  useEffect(() => {
    const handleUrlChange = () => {
      const parsed = parseCurrentRoute(allTools);
      setRoute(parsed);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [allTools]);

  // Sync document title, meta description, and SEO canonical tag based on current sub-page
  useEffect(() => {
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    if (route.view === 'tool') {
      const tool = allTools.find((t) => t.id === route.toolId);
      if (tool) {
        document.title = `${tool.name} Review (2026) - Features, Pricing & Alternatives | AuraGenix AI`;
        canonical.href = `https://auragenixai.cyou/tool/${tool.id}`;
        return;
      }
    } else if (route.view === 'category') {
      document.title = `${route.category} AI Tools (2026) — Verified Reviews & Benchmarks | AuraGenix AI`;
      canonical.href = `https://auragenixai.cyou/category/${categoryToSlug(route.category)}`;
      return;
    } else if (route.view === 'deals') {
      document.title = 'Daily AI Deals & Promo Codes (2026) — Verified Discounts | AuraGenix AI';
      canonical.href = 'https://auragenixai.cyou/deals';
      return;
    } else if (route.view === 'news') {
      document.title = 'Trending AI News Radar (2026) — Model Releases & Benchmarks | AuraGenix AI';
      canonical.href = 'https://auragenixai.cyou/news';
      return;
    }
    document.title = 'AuraGenix AI — Discover & Compare 10,000+ Best AI Tools of 2026';
    canonical.href = 'https://auragenixai.cyou/';
  }, [route, allTools]);

  // Navigation handlers
  const navigateToTool = (toolId: string) => {
    window.location.hash = `#/tool/${toolId}`;
    setRoute({ view: 'tool', toolId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDeals = () => {
    window.location.hash = '#/deals';
    setRoute({ view: 'deals' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToNews = () => {
    window.location.hash = '#/news';
    setRoute({ view: 'news' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCompareModal = (toolAId?: string, toolBId?: string) => {
    if (toolAId) setCompareToolAId(toolAId);
    if (toolBId) setCompareToolBId(toolBId);
    setIsCompareModalOpen(true);
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
    if (category === 'All') {
      navigateToHome('tools-grid');
      return;
    }
    const slug = categoryToSlug(category);
    window.location.hash = `#/category/${slug}`;
    setRoute({ view: 'category', category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      return allTools.find((t) => t.id === route.toolId) || null;
    }
    return null;
  }, [route, allTools]);

  // Filtered and sorted tools for the home view with multi-token real-time narrowing & relevance ranking
  const filteredTools = useMemo(() => {
    return filterAndRankTools(
      allTools,
      searchQuery,
      activeCategory,
      pricingFilter,
      sortOption
    );
  }, [allTools, searchQuery, activeCategory, pricingFilter, sortOption]);

  // Reset pagination when search query, category, or pricing changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const handleCategorySelect = (category: ToolCategory) => {
    if (category === 'All') {
      setActiveCategory('All');
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    } else {
      navigateToCategory(category);
    }
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
        onCompareClick={() => openCompareModal()}
        onDealsClick={navigateToDeals}
        onNewsClick={navigateToNews}
        onCategoryClick={navigateToCategory}
        currentView={route.view}
      />

      {/* 2. DYNAMIC VIEW SWITCHING */}
      {route.view === 'deals' ? (
        <DailyAIDeals onBackToHome={() => navigateToHome()} />
      ) : route.view === 'news' ? (
        <TrendingAINews onBackToHome={() => navigateToHome()} />
      ) : route.view === 'category' ? (
        <CategoryPage
          category={route.category}
          allTools={allTools}
          onSelectTool={navigateToTool}
          onBackToHome={() => navigateToHome()}
          onSelectCategory={navigateToCategory}
          onCompareTools={(toolAId, toolBId) => openCompareModal(toolAId, toolBId)}
        />
      ) : route.view === 'tool' && activeTool ? (
        <ToolDetailPage
          tool={activeTool}
          allTools={allTools}
          onBackToHome={() => navigateToHome('tools-grid')}
          onSelectAlternative={navigateToTool}
          onSelectCategory={navigateToCategory}
          onCompareTool={(toolId) => openCompareModal(toolId)}
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
            allTools={allTools}
            onSelectTool={(tool) => navigateToTool(tool.id)}
            onViewAllResults={() => {
              const grid = document.getElementById('tools-grid');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
            onSelectPricing={(pricing) => setPricingFilter(pricing)}
            onOpenCompare={() => openCompareModal()}
            onNavigateDeals={navigateToDeals}
            onNavigateNews={navigateToNews}
            onResetFilters={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setPricingFilter('All');
            }}
          />

          {/* Quick-Access Feature Showcase Strip (Versus Mode + Deals + News Radar) */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Versus Mode */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1228] to-[#080d1e] border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Swords className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                    Interactive
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  AI vs AI Comparison Engine
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Head-to-head architectural showdowns with feature matrices, pricing, pros/cons &amp; verified verdicts.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <button
                    onClick={() => openCompareModal('chatgpt', 'claude')}
                    className="text-[11px] font-semibold text-slate-300 hover:text-cyan-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    ChatGPT vs Claude
                  </button>
                  <button
                    onClick={() => openCompareModal('midjourney-v6', 'flux-1-pro')}
                    className="text-[11px] font-semibold text-slate-300 hover:text-cyan-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    Midjourney vs Flux
                  </button>
                  <button
                    onClick={() => openCompareModal('cursor-ai', 'github-copilot')}
                    className="text-[11px] font-semibold text-slate-300 hover:text-cyan-300 bg-slate-900 px-2 py-1 rounded-md border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    Cursor vs Copilot
                  </button>
                </div>
                <button
                  onClick={() => openCompareModal()}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Launch Versus Comparison</span>
                </button>
              </div>

              {/* Card 2: Daily AI Deals */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161009] to-[#0c0d18] border border-amber-500/30 hover:border-amber-400/60 shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Tag className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30 font-bold">
                    Up to 50% Off
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                  Daily AI Deals &amp; Discounts
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Verified coupons, lifetime access offers, and exclusive educational promo codes for top AI platforms.
                </p>
                <div className="text-xs text-amber-400 font-semibold mb-4 bg-amber-950/40 p-2 rounded-lg border border-amber-500/20 flex items-center gap-2">
                  <span>🔥 Featured: 30% Off Perplexity Pro with code</span>
                  <span className="font-mono bg-amber-950 px-1.5 py-0.5 rounded border border-amber-500/30">AURAGENIX30</span>
                </div>
                <button
                  onClick={navigateToDeals}
                  className="w-full py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Browse All Verified Deals</span>
                </button>
              </div>

              {/* Card 3: Trending AI News */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1228] to-[#080d1e] border border-purple-500/30 hover:border-purple-400/60 shadow-lg transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 font-bold">
                    Live Telemetry
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                  Trending AI News &amp; Benchmarks
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Daily curated intelligence on LLM releases, benchmark shifts, regulatory updates, and breakthrough models.
                </p>
                <div className="text-xs text-slate-300 mb-4 space-y-1">
                  <div className="truncate">• Anthropic Claude 3.7 Sonnet Hybrid Reasoning</div>
                  <div className="truncate">• DeepSeek V3 Math &amp; Code Open Weights</div>
                </div>
                <button
                  onClick={navigateToNews}
                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Read Trending AI Radar</span>
                </button>
              </div>

            </div>

            {/* High-RPM Responsive AdSense Unit on Homepage */}
            <AdSenseUnit
              slotId="5566778899"
              type="responsive-display"
              format="auto"
              className="mt-8"
            />
          </section>

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
                      onCompare={(t) => openCompareModal(t.id)}
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

              {/* 4-Banner Grid Layout right below the benchmark evaluation section */}
              <div className="mt-12 pt-8 border-t border-slate-800/60">
                <ReviewBannerAdGrid />
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
                <span>Explore all {allTools.length.toLocaleString()}+ tool reviews</span>
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

      {/* AI vs AI Comparison Modal (Versus Mode) */}
      <AIComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        allTools={allTools}
        initialToolAId={compareToolAId}
        initialToolBId={compareToolBId}
        onSelectToolDetail={navigateToTool}
      />

      {/* Bottom Sticky Anchor Ad on Home View */}
      {route.view === 'home' && (
        <StickyAnchorAd slotId="3322114455" />
      )}

    </div>
  );
}
