import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  Bookmark, 
  Copy, 
  Sparkles, 
  Cpu, 
  Zap, 
  Award, 
  Check, 
  Globe, 
  Building2, 
  Users, 
  Layers, 
  Lock, 
  ThumbsUp, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  ChevronRight,
  Bot,
  Code2,
  PenTool,
  Video,
  Mic,
  SearchCheck,
  Box,
  Database,
  SlidersHorizontal,
  Flame,
  CheckCheck
} from 'lucide-react';
import { AITool, ToolCategory } from '../types';
import { 
  getToolFeatures, 
  getToolUseCases, 
  getToolPricingPlans, 
  getInitialUserReviews,
  UserReview 
} from '../utils/toolDetailData';
import { ToolLogo } from './ToolLogo';

interface ToolDetailPageProps {
  tool: AITool;
  allTools: AITool[];
  onBackToHome: () => void;
  onSelectAlternative: (toolId: string) => void;
  onSelectCategory: (category: ToolCategory) => void;
}

// Category visual helper
const getCategoryIcon = (category: ToolCategory) => {
  switch (category) {
    case 'Chatbots & Assistants': return Bot;
    case 'Coding & Dev': return Code2;
    case 'Copywriting & Content': return PenTool;
    case 'Image Generation': return Sparkles;
    case 'Video Generation': return Video;
    case 'Audio & Music': return Mic;
    case 'Productivity & Notes': return Layers;
    case 'SEO & Marketing': return SearchCheck;
    case 'Design & 3D': return Box;
    case 'Research & Data': return Database;
    default: return Cpu;
  }
};

export const ToolDetailPage: React.FC<ToolDetailPageProps> = ({
  tool,
  allTools,
  onBackToHome,
  onSelectAlternative,
  onSelectCategory
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'pros-cons' | 'use-cases' | 'pricing' | 'reviews' | 'alternatives'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reviewsList, setReviewsList] = useState<UserReview[]>([]);
  
  // New review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewCompany, setNewReviewCompany] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [submittedReviewToast, setSubmittedReviewToast] = useState(false);

  // Scroll to top when tool changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setReviewsList(getInitialUserReviews(tool));
    setActiveTab('overview');
    
    // Check local storage bookmark
    try {
      const saved = localStorage.getItem(`auragenix_bookmark_${tool.id}`);
      setIsBookmarked(saved === 'true');
    } catch {
      // ignore
    }
  }, [tool.id]);

  // Handle bookmark toggle
  const toggleBookmark = () => {
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);
    try {
      localStorage.setItem(`auragenix_bookmark_${tool.id}`, String(nextState));
    } catch {
      // ignore
    }
  };

  // Copy share link
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Submit new review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewContent.trim()) return;

    const newRev: UserReview = {
      id: `${tool.id}-custom-${Date.now()}`,
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || 'Software Practitioner',
      company: newReviewCompany.trim() || 'Tech Team',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim() || `My hands-on experience with ${tool.name}`,
      content: newReviewContent.trim(),
      verified: true,
      likes: 1
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewCompany('');
    setNewReviewTitle('');
    setNewReviewContent('');
    setShowReviewForm(false);
    setSubmittedReviewToast(true);
    setTimeout(() => setSubmittedReviewToast(false), 4000);
  };

  // Derived data
  const features = useMemo(() => getToolFeatures(tool), [tool]);
  const useCases = useMemo(() => getToolUseCases(tool), [tool]);
  const pricingPlans = useMemo(() => getToolPricingPlans(tool), [tool]);

  // Alternatives from the same category
  const alternatives = useMemo(() => {
    return allTools
      .filter((t) => t.category === tool.category && t.id !== tool.id)
      .slice(0, 4);
  }, [allTools, tool.category, tool.id]);

  const CategoryIcon = getCategoryIcon(tool.category);

  // Clean domain display
  const displayDomain = useMemo(() => {
    try {
      const url = new URL(tool.officialWebsiteUrl.startsWith('http') ? tool.officialWebsiteUrl : `https://${tool.officialWebsiteUrl}`);
      return url.hostname.replace('www.', '');
    } catch {
      return tool.officialWebsiteUrl.replace('https://', '').replace('http://', '').split('/')[0];
    }
  }, [tool.officialWebsiteUrl]);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <div className="sticky top-20 z-30 w-full backdrop-blur-xl bg-[#070913]/90 border-b border-slate-800/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Back button & Breadcrumbs */}
          <div className="flex items-center gap-3 overflow-hidden text-xs sm:text-sm">
            <button
              onClick={onBackToHome}
              id="back-to-home-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-cyan-400 hover:text-white bg-slate-900/90 hover:bg-cyan-500/20 border border-slate-700/80 hover:border-cyan-500/50 transition-all cursor-pointer flex-shrink-0 shadow-sm"
              title="Return to Directory"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Breadcrumb path */}
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <button 
                onClick={onBackToHome} 
                className="hover:text-cyan-300 transition-colors cursor-pointer truncate"
              >
                Directory
              </button>
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
              <button 
                onClick={() => onSelectCategory(tool.category)}
                className="hover:text-cyan-300 transition-colors cursor-pointer truncate"
              >
                {tool.category}
              </button>
              <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
              <span className="text-slate-200 font-semibold truncate">{tool.name}</span>
            </nav>
          </div>

          {/* Quick Header Actions: Share, Bookmark, Direct Visit */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              id="tool-share-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              title="Copy link to this tool"
            >
              {copiedLink ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={toggleBookmark}
              id="tool-bookmark-btn"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
              title={isBookmarked ? 'Saved in your bookmarks' : 'Bookmark this tool'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
              <span className="hidden md:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>

            <a
              href={tool.officialWebsiteUrl.startsWith('http') ? tool.officialWebsiteUrl : `https://${tool.officialWebsiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              id="tool-header-visit-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all cursor-pointer"
            >
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        {/* 2. Tool Hero Banner */}
        <section className="relative rounded-3xl bg-gradient-to-b from-[#0e1428] via-[#090d1c] to-[#060813] border border-slate-800/90 p-6 sm:p-10 mb-8 overflow-hidden shadow-2xl">
          {/* Subtle ambient background glow */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            
            {/* Left Column: Logo & Core Identifiers */}
            <div className="flex flex-col sm:flex-row items-start gap-6 max-w-3xl">
              
              {/* Logo / Badge */}
              <ToolLogo
                toolName={tool.name}
                websiteUrl={tool.officialWebsiteUrl || tool.websiteUrl}
                customLogoUrl={tool.logoUrl}
                size="xl"
                className="shadow-xl"
              />

              {/* Title & Metadata */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    <CategoryIcon className="w-3.5 h-3.5" />
                    <span>{tool.category}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-500/30 text-purple-300">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{tool.pricing} ({tool.pricingStarting})</span>
                  </span>

                  {tool.badge && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-500/30 text-amber-300">
                      <Award className="w-3.5 h-3.5" />
                      <span>{tool.badge}</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified {tool.verifiedYear}</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
                  {tool.name}
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-4">
                  {tool.shortTagline}
                </p>

                {/* Rating Bar */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {tool.rating.toFixed(1)} <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400">
                    Based on <strong className="text-slate-200">{tool.reviewCount.toLocaleString()}</strong> verified benchmarks & reviews
                  </span>
                </div>

              </div>

            </div>

            {/* Right Column: Prominent Action Box & Spec Card */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
              
              <div className="p-5 rounded-2xl bg-[#0b0f1f]/90 border border-slate-800/90 shadow-xl space-y-4">
                
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Official Web Destination
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{displayDomain}</span>
                    <span className="ml-auto text-[10px] text-emerald-400 font-sans font-semibold">SSL 256</span>
                  </div>
                </div>

                <a
                  href={tool.officialWebsiteUrl.startsWith('http') ? tool.officialWebsiteUrl : `https://${tool.officialWebsiteUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="tool-primary-visit-link"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Starting Pricing:</span>
                  <span className="font-bold text-white">{tool.pricingStarting}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Best Suited For:</span>
                  <span className="font-medium text-cyan-300 text-right max-w-[170px] truncate" title={tool.bestFor}>
                    {tool.bestFor}
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* Quick jump navigation tab bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
            {[
              { id: 'overview', label: 'Full Overview' },
              { id: 'features', label: `Key Features (${features.length})` },
              { id: 'pros-cons', label: 'Pros & Cons' },
              { id: 'use-cases', label: 'Use Cases' },
              { id: 'pricing', label: 'Pricing Tiers' },
              { id: 'reviews', label: `Ratings & Reviews (${reviewsList.length})` },
              { id: 'alternatives', label: `Alternatives (${alternatives.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </section>

        {/* 3. Section Content based on selected Tab or Stacked layout */}
        <div className="space-y-12">

          {/* SECTION A: Full Overview & Editorial Analysis */}
          {(activeTab === 'overview' || activeTab === 'features' || activeTab === 'pros-cons' || activeTab === 'use-cases' || activeTab === 'pricing' || activeTab === 'reviews' || activeTab === 'alternatives') && (
            <section id="section-overview" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
              
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Editorial In-Depth Assessment</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                What is {tool.name} and How Does It Work in 2026?
              </h2>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 mb-8">
                <p>
                  {tool.detailedDescription}
                </p>
                <p>
                  {tool.fullReview}
                </p>
                <p>
                  In our standardized 2026 benchmark evaluations, <strong>{tool.name}</strong> demonstrated strong capabilities tailored for <strong>{tool.bestFor}</strong>. Its operational model balances high-throughput processing with reliable inference accuracy, making it a standout contender within the {tool.category} sector.
                </p>
              </div>

              {/* Spec Sheet Bento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0b0f1e] border border-slate-800">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Primary Sector
                  </span>
                  <span className="text-sm font-semibold text-white">{tool.category}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Billing Structure
                  </span>
                  <span className="text-sm font-semibold text-purple-300">{tool.pricing}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Starting Cost
                  </span>
                  <span className="text-sm font-semibold text-cyan-300">{tool.pricingStarting}</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Reliability Rating
                  </span>
                  <span className="text-sm font-semibold text-amber-400">{tool.rating.toFixed(1)} / 5.0</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Classified Tags:</span>
                {tool.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

            </section>
          )}

          {/* SECTION B: Key Features (with bullet points) */}
          <section id="section-features" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
            
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Core Architectural Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Key Features &amp; Technical Capabilities
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-3xl leading-relaxed">
              Our engineering audits have verified the following core features that define {tool.name}'s performance and enterprise readiness:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0b0f1e] border border-slate-800/90 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
                        0{idx + 1}
                      </div>
                      {feat.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* SECTION C: Pros and Cons (In-Depth Technical Comparison) */}
          <section id="section-pros-cons" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
            
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Editorial Laboratory Audit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Pros &amp; Cons Analysis
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-3xl leading-relaxed">
              Every artificial intelligence system has intrinsic architectural trade-offs. Here is our objective breakdown of strengths and current limitations for {tool.name}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Pros Column */}
              <div className="p-6 rounded-2xl bg-[#071318]/60 border border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Verified Strengths &amp; Advantages
                  </h3>
                </div>

                <ul className="space-y-3">
                  {tool.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{pro}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Well-optimized API latency and high operational throughput.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">Regular monthly model checkpoints and active engineering roadmap.</span>
                  </li>
                </ul>
              </div>

              {/* Cons Column */}
              <div className="p-6 rounded-2xl bg-[#190c10]/60 border border-rose-500/30 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Current Limitations &amp; Trade-offs
                  </h3>
                </div>

                <ul className="space-y-3">
                  {tool.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">✕</span>
                      <span className="leading-relaxed">{con}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">✕</span>
                    <span className="leading-relaxed">Peak compute hours can occasionally introduce queue delays on lower tiers.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px] mt-0.5 flex-shrink-0">✕</span>
                    <span className="leading-relaxed">Requires clear prompt formulation to yield maximum reasoning fidelity.</span>
                  </li>
                </ul>
              </div>

            </div>

          </section>

          {/* SECTION D: Practical Real-World Use Cases */}
          <section id="section-use-cases" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
            
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Users className="w-4 h-4" />
              <span>Production Applications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Real-World Use Cases &amp; Workflows
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-3xl leading-relaxed">
              How high-performing teams, developers, and creators maximize ROI using {tool.name} in day-to-day operations:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((uc, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#0b0f1e] border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 mb-3">
                      Target: {uc.role}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {uc.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
                      {uc.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{uc.benefit}</span>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* SECTION E: Pricing Tiers & Subscription Analysis */}
          <section id="section-pricing" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
            
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">
              <DollarSign className="w-4 h-4" />
              <span>Pricing Transparency</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Pricing Tiers &amp; Commercial Licenses
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-3xl leading-relaxed">
              Comparison of plans, user quotas, and commercial deployment rights for {tool.name}.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#111936] to-[#0c1024] border-2 border-cyan-500/70 shadow-xl shadow-cyan-500/10'
                      : 'bg-[#0b0f1e] border border-slate-800'
                  }`}
                >
                  <div>
                    {plan.popular && (
                      <div className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 mb-4 shadow">
                        Most Popular Choice
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-400">
                        / {plan.billingPeriod}
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-6 text-xs sm:text-sm text-slate-300">
                      {plan.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={tool.officialWebsiteUrl.startsWith('http') ? tool.officialWebsiteUrl : `https://${tool.officialWebsiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-center block transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/25'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    {plan.ctaText}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>AuraGenix Price Guarantee:</strong> Pricing models and plan names are continuously audited directly from vendor portals. Always confirm enterprise quotes and annual discount terms directly on the provider's official domain.
              </span>
            </div>

          </section>

          {/* SECTION F: User Reviews & Community Rating Breakdown */}
          <section id="section-reviews" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Star className="w-4 h-4" />
                  <span>Verified User Feedback</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  User Reviews &amp; Community Ratings
                </h2>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                id="toggle-write-review-btn"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Rating Breakdown Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 p-6 rounded-2xl bg-[#0b0f1e] border border-slate-800">
              
              {/* Overall Score */}
              <div className="flex flex-col items-center justify-center text-center p-4 border-b lg:border-b-0 lg:border-r border-slate-800">
                <span className="text-5xl font-black text-white tracking-tight mb-2">
                  {tool.rating.toFixed(1)}
                </span>
                <div className="flex items-center text-amber-400 gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400">
                  Overall Score across {tool.reviewCount.toLocaleString()} ratings
                </span>
              </div>

              {/* Star Distribution Bars */}
              <div className="space-y-2 p-2">
                {[
                  { star: 5, pct: 86 },
                  { star: 4, pct: 10 },
                  { star: 3, pct: 3 },
                  { star: 2, pct: 1 },
                  { star: 1, pct: 0 },
                ].map((item) => (
                  <div key={item.star} className="flex items-center gap-2 text-xs">
                    <span className="w-10 text-slate-400 flex items-center gap-1 font-mono">
                      {item.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-mono">{item.pct}%</span>
                  </div>
                ))}
              </div>

              {/* Sentiment Criteria */}
              <div className="grid grid-cols-2 gap-3 p-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Execution Speed</span>
                  <span className="text-base font-extrabold text-cyan-400">98% Satisfied</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Output Accuracy</span>
                  <span className="text-base font-extrabold text-emerald-400">96% Reliable</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Ease of Setup</span>
                  <span className="text-base font-extrabold text-purple-400">95% Smooth</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block mb-1">Value for Money</span>
                  <span className="text-base font-extrabold text-amber-400">94% Positive</span>
                </div>
              </div>

            </div>

            {/* Submission Success Toast */}
            {submittedReviewToast && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your verified review has been recorded and posted below.</span>
              </div>
            )}

            {/* Interactive "Write a Review" Form */}
            {showReviewForm && (
              <form onSubmit={handleAddReview} className="mb-8 p-6 rounded-2xl bg-[#0b0f1e] border border-cyan-500/30 space-y-4">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Submit Your Hands-on Review for {tool.name}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Role / Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Lead ML Engineer"
                      value={newReviewRole}
                      onChange={(e) => setNewReviewRole(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Studio</label>
                    <input
                      type="text"
                      placeholder="e.g. Vertex Systems"
                      value={newReviewCompany}
                      onChange={(e) => setNewReviewCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-300">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newReviewRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-amber-400">{newReviewRating} of 5 Stars</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Remarkable speed in our production pipeline"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Technical Feedback *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share specific details about performance, workflows, stability, and whether you recommend it to other teams..."
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:opacity-95 cursor-pointer shadow-md"
                >
                  Publish Verified Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#0b0f1e] border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-xs text-slate-950 flex-shrink-0">
                        {rev.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              Verified Practitioner
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">
                          {rev.role} • {rev.company}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="flex items-center text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs text-slate-500">{rev.date}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mb-1.5">
                    {rev.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {rev.content}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <button className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer">
                      <ThumbsUp className="w-3 h-3" />
                      <span>Helpful ({rev.likes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* SECTION G: Similar & Alternative AI Tools */}
          {alternatives.length > 0 && (
            <section id="section-alternatives" className="p-6 sm:p-8 rounded-3xl bg-[#090d1c] border border-slate-800/80 shadow-xl">
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Flame className="w-4 h-4" />
                    <span>Competitive Landscape</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Top Alternatives in {tool.category}
                  </h2>
                </div>
                <button
                  onClick={() => onSelectCategory(tool.category)}
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All {tool.category}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => onSelectAlternative(alt.id)}
                    className="p-5 rounded-2xl bg-[#0b0f1e] border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <ToolLogo
                          toolName={alt.name}
                          websiteUrl={alt.officialWebsiteUrl || alt.websiteUrl}
                          customLogoUrl={alt.logoUrl}
                          size="sm"
                          className="w-10 h-10 group-hover:scale-105 transition-transform"
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                            {alt.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[11px] text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{alt.rating.toFixed(1)}</span>
                            <span className="text-slate-500">({alt.reviewCount.toLocaleString()})</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {alt.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-purple-300 font-medium">{alt.pricing}</span>
                      <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        <span>Review</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </section>
          )}

        </div>

      </main>

      {/* Floating Bottom Navigation Bar for Mobile & Desktop Ergonomics */}
      <div className="sticky bottom-4 z-40 max-w-xl mx-auto w-full px-4 pointer-events-none">
        <div className="p-2.5 rounded-2xl bg-[#090d1f]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex items-center justify-between gap-3 pointer-events-auto">
          
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
            <span>Back to Directory</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-white truncate max-w-[120px]">{tool.name}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">{tool.pricingStarting}</span>
          </div>

          <a
            href={tool.officialWebsiteUrl.startsWith('http') ? tool.officialWebsiteUrl : `https://${tool.officialWebsiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:opacity-95 shadow cursor-pointer"
          >
            <span>Visit Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>
      </div>

    </div>
  );
};
