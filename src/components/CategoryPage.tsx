import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Layers, 
  SlidersHorizontal, 
  ChevronRight, 
  CheckCircle2, 
  ChevronDown, 
  Award, 
  Zap, 
  Cpu, 
  HelpCircle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Swords
} from 'lucide-react';
import { AITool, ToolCategory, PricingType } from '../types';
import { categoryToSlug, CATEGORY_DETAILS } from '../utils/categoryUtils';
import { ToolCard } from './ToolCard';
import { AdSenseUnit, StickyAnchorAd, ADS_ENABLED } from './AdSenseUnit';

interface CategoryPageProps {
  category: ToolCategory;
  allTools: AITool[];
  onSelectTool: (toolId: string) => void;
  onBackToHome: () => void;
  onSelectCategory: (category: ToolCategory) => void;
  onCompareTools: (toolAId?: string, toolBId?: string) => void;
}

const PAGE_SIZE = 18;

export const CategoryPage: React.FC<CategoryPageProps> = ({
  category,
  allTools,
  onSelectTool,
  onBackToHome,
  onSelectCategory,
  onCompareTools
}) => {
  const [pricingFilter, setPricingFilter] = useState<PricingType>('All');
  const [sortOption, setSortOption] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Category rich metadata
  const meta = CATEGORY_DETAILS[category] || {
    title: `Best ${category} AI Tools of 2026`,
    tagline: `Compare top-rated artificial intelligence software and tools in ${category}.`,
    description: `Explore independently vetted and benchmarked AI applications in ${category} to automate workflows and enhance productivity.`,
    buyersGuide: `When selecting tools in ${category}, balance cost, API latency, integration capabilities, and commercial licensing guarantees.`,
    keyEvaluationCriteria: [
      'Inference Speed & Quality',
      'API & Workspace Integration',
      'Pricing Transparency & Free Tier Limits',
      'Data Privacy & Security Guarantees'
    ],
    faqs: [
      {
        question: `How do I pick the right ${category} AI tool?`,
        answer: `Compare your primary workflow requirements against trial tiers, benchmark ratings, and integrations.`
      }
    ]
  };

  // Filter tools belonging to this category
  const categoryTools = useMemo(() => {
    return allTools.filter((t) => t.category.toLowerCase() === category.toLowerCase());
  }, [allTools, category]);

  // Apply pricing and sort
  const filteredTools = useMemo(() => {
    let result = [...categoryTools];

    if (pricingFilter !== 'All') {
      result = result.filter((t) => (t.pricingModel || t.pricing || '').toLowerCase() === pricingFilter.toLowerCase());
    }

    result.sort((a, b) => {
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortOption === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [categoryTools, pricingFilter, sortOption]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  // Category Statistics
  const stats = useMemo(() => {
    const total = categoryTools.length;
    const avgRating = total > 0 ? (categoryTools.reduce((acc, t) => acc + t.rating, 0) / total).toFixed(2) : '4.8';
    const freeCount = categoryTools.filter((t) => t.pricing === 'Free').length;
    const freemiumCount = categoryTools.filter((t) => t.pricing === 'Freemium').length;
    const paidCount = categoryTools.filter((t) => t.pricing === 'Paid').length;
    const topTool = categoryTools[0];

    return { total, avgRating, freeCount, freemiumCount, paidCount, topTool };
  }, [categoryTools]);

  // Top 5 tools for comparative table
  const topComparisonTools = useMemo(() => {
    return [...categoryTools].sort((a, b) => b.rating - a.rating).slice(0, 5);
  }, [categoryTools]);

  // Sync document title and meta description
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${meta.title} — Ratings, Pricing & Benchmarks | AuraGenix AI`;
  }, [category, meta.title]);

  // Inject Schema.org FAQPage structured data
  useEffect(() => {
    const scriptId = `faq-schema-cat-${categoryToSlug(category)}`;
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': meta.faqs.map((faq) => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    };

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [category, meta.faqs]);

  const allCategories: ToolCategory[] = [
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

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col pb-24">
      
      {/* 1. Category Header & Breadcrumb */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-[#0e142b] via-[#090d1f] to-[#070913] pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <button 
              onClick={onBackToHome}
              className="hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>AuraGenix Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-400">Categories</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-cyan-300 font-semibold">{category}</span>
          </nav>

          {/* Title & Tagline */}
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>2026 Verified Industry Directory &amp; Benchmark Report</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
              {meta.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-6">
              {meta.tagline}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
              {meta.description}
            </p>
          </div>

          {/* Category Quick Telemetry Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800/60">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Tools Evaluated</span>
              <span className="text-2xl font-black text-cyan-300 font-mono">{stats.total}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Independently tested</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Average Rating</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-white font-mono">{stats.avgRating}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">Out of 5.0 scale</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Pricing Breakdown</span>
              <span className="text-sm font-bold text-slate-200 block">
                {stats.freemiumCount} Freemium / {stats.freeCount} Free
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{stats.paidCount} Enterprise plans</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Category Leader</span>
              <button 
                onClick={() => stats.topTool && onSelectTool(stats.topTool.id)}
                className="text-sm font-bold text-cyan-400 hover:underline truncate block text-left"
              >
                {stats.topTool?.name || 'Verified Standard'}
              </button>
              <span className="text-[11px] text-slate-400 block mt-0.5">Benchmark Winner</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Responsive Display AdSense Slot (Hidden pending AdSense approval) */}
      {ADS_ENABLED && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <AdSenseUnit
            slotId="4455667788"
            type="responsive-display"
            format="auto"
          />
        </div>
      )}

      {/* 3. Main Catalog Section with Sub-filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Controls & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              All {category} Platforms ({filteredTools.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Showing verified tools ranked by benchmark precision and user review scores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Pricing Chips */}
            <div className="flex items-center gap-1 bg-[#0b0f1e] p-1 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 px-2">Pricing:</span>
              {(['All', 'Free', 'Freemium', 'Paid'] as PricingType[]).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPricingFilter(p); setVisibleCount(PAGE_SIZE); }}
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

            {/* Sort Selector */}
            <div className="flex items-center gap-2 bg-[#0b0f1e] px-3 py-1.5 rounded-xl border border-slate-800">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="rating" className="bg-[#0b0f1e]">Highest Rated</option>
                <option value="reviews" className="bg-[#0b0f1e]">Most Reviewed</option>
                <option value="name" className="bg-[#0b0f1e]">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tools Cards Grid */}
        {filteredTools.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  onReadReview={() => onSelectTool(tool.id)}
                  onCompare={() => onCompareTools(tool.id)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/40 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <span>Load More {category} Tools ({filteredTools.length - visibleTools.length} remaining)</span>
                  <ChevronDown className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-[#090d1c] rounded-2xl border border-slate-800 p-8">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No tools matched your current filter</h3>
            <p className="text-xs text-slate-400 mb-4">Try clearing the pricing filter to view all available tools.</p>
            <button
              onClick={() => setPricingFilter('All')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 4. In-Article AdSense Unit (Hidden pending AdSense approval) */}
        {ADS_ENABLED && (
          <div className="my-12">
            <AdSenseUnit
              slotId="2233445566"
              type="in-article"
              className="my-4"
            />
          </div>
        )}

        {/* 5. Category Comparison Table */}
        {topComparisonTools.length >= 2 && (
          <section className="mt-14 pt-10 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Swords className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {category} Comparison Table (2026)
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Side-by-side comparison of the top-performing AI tools in {category}.
                </p>
              </div>
              <button
                onClick={() => onCompareTools(topComparisonTools[0]?.id, topComparisonTools[1]?.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 transition-colors"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>Compare #{topComparisonTools[0]?.name} vs #{topComparisonTools[1]?.name}</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#090d1c]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0e142b] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Tool Name</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Pricing Model</th>
                    <th className="py-3.5 px-4">Starting Price</th>
                    <th className="py-3.5 px-4">Primary Strength</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topComparisonTools.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-cyan-400 font-mono">
                          {idx + 1}
                        </span>
                        <span>{t.name}</span>
                        {t.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {t.badge}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{t.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-slate-400 font-normal font-mono">({t.reviewCount})</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          t.pricing === 'Free' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                          t.pricing === 'Freemium' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                          'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {t.pricing}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {t.pricingStarting || 'Free Tier'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">
                        {t.bestFor || t.shortTagline}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onSelectTool(t.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                        >
                          View Review →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 6. Comprehensive Editorial Buyer's Guide (SEO Content Block) */}
        <section className="mt-16 p-8 rounded-2xl bg-[#090d1c] border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              2026 {category} Buyer's Guide &amp; Technical Criteria
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            {meta.buyersGuide}
          </p>

          <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-3">
            Key Architectural Evaluation Factors:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {meta.keyEvaluationCriteria.map((criterion, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium">{criterion}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Category FAQ Accordion Section */}
        {meta.faqs.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                Frequently Asked Questions about {category}
              </h3>
            </div>
            <div className="space-y-3">
              {meta.faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div 
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-[#090d1c] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 8. Browse Other AI Categories Strip */}
        <section className="mt-16 pt-10 border-t border-slate-800/80">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">
            Explore Other AI Software Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {allCategories.filter((c) => c !== category).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Sticky Bottom Anchor Ad */}
      <StickyAnchorAd slotId="3344556677" />

    </div>
  );
};
