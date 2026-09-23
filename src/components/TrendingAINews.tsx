import React, { useState } from 'react';
import { 
  Radio, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Zap, 
  ArrowRight,
  Filter,
  Bookmark
} from 'lucide-react';
import { AdSenseUnit } from './AdSenseUnit';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'Model Release' | 'Developer Tools' | 'Hardware & Compute' | 'Industry & Policy';
  date: string;
  readTime: string;
  source: string;
  url: string;
  trendingScore: number;
}

const AI_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Hybrid Reasoning Architecture Sets New Coding & Math Benchmark',
    summary: 'Next-generation frontier models combine instant token streaming with switchable deep chain-of-thought, beating traditional LLM benchmarks by 28% on SWE-bench.',
    category: 'Model Release',
    date: 'Today, 2h ago',
    readTime: '3 min read',
    source: 'AuraGenix Intelligence',
    url: 'https://news.ycombinator.com',
    trendingScore: 99,
  },
  {
    id: 'news-2',
    title: 'Open-Weights AI Adoption Reaches 68% Among Enterprise Teams',
    summary: 'Enterprises cite air-gapped data sovereignty and zero-latency local execution as primary catalysts driving migration from closed proprietary APIs to distilled weights.',
    category: 'Industry & Policy',
    date: 'Yesterday',
    readTime: '4 min read',
    source: 'TechRadar Enterprise',
    url: 'https://venturebeat.com',
    trendingScore: 94,
  },
  {
    id: 'news-3',
    title: 'Sub-50ms Speculative Decoding Transforms Code Editor AI Autocompletions',
    summary: 'A new wave of local quantized draft models allows IDE copilots to predict multi-token syntax completions simultaneously without hitting remote cloud servers.',
    category: 'Developer Tools',
    date: '2 days ago',
    readTime: '5 min read',
    source: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog',
    trendingScore: 91,
  },
  {
    id: 'news-4',
    title: 'Generative Video Diffusion Models Achieve Real-Time 60 FPS Camera Controls',
    summary: 'Video generation engines introduce direct keyframe camera trajectory manipulation, giving 3D animators and filmmakers frame-accurate motion consistency.',
    category: 'Model Release',
    date: '3 days ago',
    readTime: '4 min read',
    source: 'ArXiv AI Preprints',
    url: 'https://arxiv.org',
    trendingScore: 88,
  },
  {
    id: 'news-5',
    title: 'Inference Compute Pricing Drops by 60% Following Quantization Breakthroughs',
    summary: 'Hardware accelerators leverage FP4 and INT2 weight representations to double throughput while reducing kilowatt power usage across hyperscale data centers.',
    category: 'Hardware & Compute',
    date: '4 days ago',
    readTime: '3 min read',
    source: 'Semiconductor Digest',
    url: 'https://semiengineering.com',
    trendingScore: 85,
  },
];

export const TrendingAINews: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Model Release', 'Developer Tools', 'Hardware & Compute', 'Industry & Policy'];

  const filteredNews = selectedCategory === 'All' 
    ? AI_NEWS_ITEMS 
    : AI_NEWS_ITEMS.filter((n) => n.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      {/* Top Heading */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4 shadow-sm">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Real-Time AI Radar &amp; Model Benchmark Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Trending AI News &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">Industry Radar</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Stay ahead of the generative AI curve. Objective daily reports on frontier model releases, developer tooling shifts, open-weight breakthroughs, and API economics.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top Banner AdSense Slot */}
      <AdSenseUnit
        slotId="6677889900"
        type="horizontal-banner"
        format="auto"
        className="mb-8"
      />

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {filteredNews.map((news, idx) => (
          <article
            key={news.id}
            className="p-6 rounded-3xl bg-[#090e21] border border-slate-800 hover:border-cyan-500/40 hover:bg-[#0c122b] transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  {news.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {news.date}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
                {news.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {news.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Source: <strong className="text-slate-200">{news.source}</strong></span>
              <a
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <span>Read Full Coverage</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Mid-Feed In-Article AdSense Unit */}
      <AdSenseUnit
        slotId="7788990011"
        type="in-article"
        format="auto"
        className="my-8"
      />
    </div>
  );
};
