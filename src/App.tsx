import React, { useState, useMemo } from 'react';
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
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
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

const INITIAL_VISIBLE_COUNT = 18;
const LOAD_MORE_STEP = 18;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('All');
  const [pricingFilter, setPricingFilter] = useState<PricingType>('All');
  const [sortOption, setSortOption] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  // Modals state
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Filtered and sorted tools
  const filteredTools = useMemo(() => {
    return AI_TOOLS_DATA.filter((tool) => {
      // Category match
      const matchesCat = 
        activeCategory === 'All' || 
        tool.category.toLowerCase() === activeCategory.toLowerCase();

      // Pricing match
      const matchesPricing = 
        pricingFilter === 'All' || 
        tool.pricing.toLowerCase() === pricingFilter.toLowerCase();

      // Search query match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.shortDescription.toLowerCase().includes(q) ||
        tool.fullReview.toLowerCase().includes(q) ||
        tool.bestFor.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesPricing && matchesSearch;
    }).sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
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
    setSortOption('rating');
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const currentVisibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Header / Navbar */}
      <Navbar 
        onSubmitToolClick={() => setIsSubmitOpen(true)} 
      />

      <main className="flex-grow">
        
        {/* 2. Hero Section with dynamic search and quick category pills */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          categories={CATEGORIES}
          totalResults={filteredTools.length}
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
                Independent laboratory reviews with benchmark ratings, pricing transparency, and verified editorial summaries.
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
                    onReadReview={(t) => setSelectedTool(t)}
                  />
                ))}
              </div>

              {/* Load More & Pagination Bar */}
              {hasMore && (
                <div className="mt-12 text-center flex flex-col items-center gap-3">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-cyan-500/20"
                  >
                    <span>Load 18 More Tools</span>
                    <ChevronDown className="w-4 h-4 text-cyan-400" />
                  </button>
                  <span className="text-xs text-slate-400">
                    Showing {currentVisibleTools.length} of {filteredTools.length} matching AI tools
                  </span>
                </div>
              )}

              {!hasMore && filteredTools.length > INITIAL_VISIBLE_COUNT && (
                <div className="mt-10 text-center py-4 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>You have viewed all {filteredTools.length} tools in this selection.</span>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="text-center py-20 px-4 rounded-2xl bg-slate-900/30 border border-slate-800 max-w-xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Matching AI Tools Found</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                We couldn't find any tools matching "<span className="text-cyan-400">{searchQuery}</span>" under the {activeCategory} category. Try refining your keywords or resetting filters.
              </p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl shadow-md hover:opacity-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Search Filters</span>
              </button>
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
                  We measure tokens-per-second, time-to-first-token (TTFT), and video/image rendering render queues across US cloud regions.
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
                Most US software teams spend between $40 to $200 per seat each month on overlapping AI tools. Explore our comparative breakdown of Free, Freemium, and Enterprise plans across 100 benchmarked platforms.
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
              <span>View all 100 tool reviews</span>
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
                onClick={() => {
                  const claude = AI_TOOLS_DATA.find(t => t.id === 'claude-3-7-sonnet');
                  if (claude) setSelectedTool(claude);
                }}
                className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Read Benchmark Comparison</span>
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
                onClick={() => {
                  const runway = AI_TOOLS_DATA.find(t => t.id === 'runway-gen-3');
                  if (runway) setSelectedTool(runway);
                }}
                className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Read Video AI Breakdown</span>
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
                onClick={() => {
                  const per = AI_TOOLS_DATA.find(t => t.id === 'perplexity-pro');
                  if (per) setSelectedTool(per);
                }}
                className="mt-4 pt-4 border-t border-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Read Research Analysis</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </article>

          </div>
        </section>

      </main>

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
