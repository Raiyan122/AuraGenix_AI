import { ToolCategory } from '../types';

export interface CategoryMeta {
  title: string;
  tagline: string;
  description: string;
  buyersGuide: string;
  keyEvaluationCriteria: string[];
  faqs: { question: string; answer: string }[];
}

export const CATEGORY_SLUG_MAP: Record<ToolCategory, string> = {
  'All': 'all',
  'Chatbots & Assistants': 'chatbots-assistants',
  'Coding & Dev': 'coding-dev',
  'Copywriting & Content': 'writing-assistants',
  'Image Generation': 'image-generation',
  'Video Generation': 'video-editing',
  'Audio & Music': 'audio-voice',
  'Productivity & Notes': 'productivity-notes',
  'SEO & Marketing': 'seo-marketing',
  'Design & 3D': 'design-3d',
  'Research & Data': 'research-data',
  'Legal AI': 'legal-ai',
  'Finance AI': 'finance-ai',
};

export const SLUG_TO_CATEGORY_MAP: Record<string, ToolCategory> = {
  'all': 'All',
  // Chatbots
  'chatbots': 'Chatbots & Assistants',
  'chatbots-assistants': 'Chatbots & Assistants',
  'assistants': 'Chatbots & Assistants',
  // Coding
  'coding': 'Coding & Dev',
  'coding-dev': 'Coding & Dev',
  'development': 'Coding & Dev',
  // Writing & Copywriting
  'writing': 'Copywriting & Content',
  'writing-assistants': 'Copywriting & Content',
  'copywriting': 'Copywriting & Content',
  'copywriting-content': 'Copywriting & Content',
  // Image
  'image-generation': 'Image Generation',
  'image': 'Image Generation',
  'art': 'Image Generation',
  // Video
  'video-generation': 'Video Generation',
  'video': 'Video Generation',
  'video-editing': 'Video Generation',
  // Audio
  'audio-music': 'Audio & Music',
  'audio': 'Audio & Music',
  'audio-voice': 'Audio & Music',
  'voice': 'Audio & Music',
  // Productivity
  'productivity-notes': 'Productivity & Notes',
  'productivity': 'Productivity & Notes',
  // SEO & Marketing
  'seo-marketing': 'SEO & Marketing',
  'seo': 'SEO & Marketing',
  'marketing': 'SEO & Marketing',
  'seo-business': 'SEO & Marketing',
  // Design & 3D
  'design-3d': 'Design & 3D',
  'design': 'Design & 3D',
  // Research & Data
  'research-data': 'Research & Data',
  'research': 'Research & Data',
  'data': 'Research & Data',
  // Legal & Finance
  'legal-ai': 'Legal AI',
  'legal': 'Legal AI',
  'finance-ai': 'Finance AI',
  'finance': 'Finance AI',
};

export function categoryToSlug(category: ToolCategory): string {
  return CATEGORY_SLUG_MAP[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function slugToCategory(slug: string): ToolCategory | null {
  const normalized = slug.toLowerCase().trim();
  return SLUG_TO_CATEGORY_MAP[normalized] || null;
}

export const CATEGORY_DETAILS: Record<string, CategoryMeta> = {
  'Chatbots & Assistants': {
    title: 'Best AI Chatbots & Conversational Assistants of 2026',
    tagline: 'Compare reasoning models, multi-turn conversational agents, and knowledge retrieval platforms.',
    description: 'Conversational AI has evolved from basic probabilistic text completion into sophisticated autonomous agents capable of extended multi-step reasoning, mathematical problem solving, and complex file execution.',
    buyersGuide: 'When evaluating chatbots in 2026, prioritize effective context window length, latency per token, tool-calling support, and pricing per million tokens. For deep analytical coding and math, reasoning-focused models like OpenAI o3-mini or Claude 3.7 Sonnet lead the benchmarks.',
    keyEvaluationCriteria: [
      'Reasoning & Logic Accuracy (MMLU-Pro / MATH 500 benchmarks)',
      'Token Throughput & API Latency',
      'Context Retention & Multi-Turn Needle-in-a-Haystack Score',
      'Native Web Browsing & Tool Use Integration'
    ],
    faqs: [
      {
        question: 'Which AI chatbot is best for complex coding and reasoning?',
        answer: 'Currently, Claude 3.7 Sonnet (Anthropic) and OpenAI o1/o3-mini hold the highest coding and engineering benchmarks, featuring dedicated reflection modes and extensive scratchpad execution.'
      },
      {
        question: 'Can these AI assistants search the live web in real time?',
        answer: 'Yes. Perplexity Pro, Google Gemini Advanced, and ChatGPT Plus all feature automated live web search and real-time citation synthesis.'
      }
    ]
  },
  'Coding & Dev': {
    title: 'Top AI Coding Assistants, Agents & IDEs (2026)',
    tagline: 'Accelerate software delivery with intelligent code generation, multi-file refactoring, and agentic debugging.',
    description: 'Modern developer AI has progressed from single-line autocompletion to full-repository semantic indexing, proactive bug scanning, and agentic multi-file pull request creation.',
    buyersGuide: 'Choose an AI developer tool that matches your editor workflow. If you prefer VS Code, Cursor provides seamless codebase-wide indexing. If you need tight GitHub enterprise integration, GitHub Copilot remains the enterprise compliance standard.',
    keyEvaluationCriteria: [
      'Repository-wide Semantic Context & RAG Speed',
      'Multi-File Diff Generation Precision',
      'Terminal Shell & Test Execution Agent Capabilities',
      'Enterprise SOC2 & Zero-Data-Retention Compliance'
    ],
    faqs: [
      {
        question: 'What is the difference between Cursor AI and GitHub Copilot?',
        answer: 'While Copilot excels as an editor extension, Cursor is a dedicated fork of VS Code engineered specifically for codebase-wide reasoning and agentic terminal command correction.'
      },
      {
        question: 'Do these tools send proprietary source code to external servers?',
        answer: 'Most professional tiers (Cursor Business, Copilot Enterprise, Supermaven Team) offer zero-retention privacy policies and SOC 2 Type II compliance.'
      }
    ]
  },
  'Copywriting & Content': {
    title: 'Best AI Writing Assistants & Content Generators of 2026',
    tagline: 'Draft high-converting blog posts, editorial essays, and marketing copy with tone-matching precision.',
    description: 'Modern AI writing tools specialize in brand voice replication, nuanced stylistic adjustments, and SEO readability scoring to produce authentic, human-grade prose.',
    buyersGuide: 'Look for platforms that integrate fact-checking citations, plagiarism scanning, and customizable brand knowledge libraries to maintain editorial integrity across your organization.',
    keyEvaluationCriteria: [
      'Nuance and Natural Prose Fluency (Low AI Cliché Index)',
      'Custom Brand Voice & Style Guide Enforcement',
      'Built-in Plagiarism & Hallucination Checks',
      'Direct CMS & Google Docs Publishing Extensions'
    ],
    faqs: [
      {
        question: 'Will AI-generated content get penalized by Google Search?',
        answer: 'Google Search guidelines state that content is rewarded based on E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) regardless of how it is produced.'
      },
      {
        question: 'What is the top tool for maintaining strict brand voice?',
        answer: 'Jasper AI and Writer.com lead in enterprise style guide enforcement and brand voice consistency.'
      }
    ]
  },
  'Image Generation': {
    title: 'Top AI Image Generators & Generative Art Platforms (2026)',
    tagline: 'Create photorealistic renders, commercial graphic design, and artistic illustrations from text prompts.',
    description: 'Generative image technology has reached photographic realism with impeccable typography rendering, accurate anatomy, and precise aesthetic controls.',
    buyersGuide: 'Evaluate tools based on their rendering fidelity, prompt alignment, and commercial licensing guarantees. Midjourney excels in artistic aesthetics, while Flux.1 Pro and Ideogram 2.0 lead in crisp text inpainting.',
    keyEvaluationCriteria: [
      'Photorealism and Anatomical Accuracy',
      'Text & Typography Inpainting Precision',
      'Inpainting, Outpainting & Resolution Upscaling',
      'Commercial Indemnity and Copyright Protection'
    ],
    faqs: [
      {
        question: 'Which AI image generator renders readable typography best?',
        answer: 'Flux.1 Pro, Ideogram 2.0, and DALL-E 3 produce the cleanest, spelled-out typographic rendering directly on rendered signs and graphics.'
      },
      {
        question: 'Are images generated by Midjourney cleared for commercial use?',
        answer: 'Yes, paid subscribers own all assets generated during their subscription for commercial projects.'
      }
    ]
  },
  'Video Generation': {
    title: 'Best AI Video Generators & Video Editing Tools (2026)',
    tagline: 'Generate cinema-grade video clips, AI avatars, and automated video edits from text descriptions.',
    description: 'Generative video models allow creators to direct camera movement, control temporal consistency, and produce high-definition B-roll in minutes.',
    buyersGuide: 'Focus on temporal coherence (minimal morphing between frames), camera trajectory control, rendering duration limits, and audio-video synchronization.',
    keyEvaluationCriteria: [
      'Temporal Consistency & Physics Simulation',
      'Camera Angle & Motion Trajectory Controls',
      'Resolution (1080p / 4K) & Frame Rate Fluidity',
      'Multi-scene Storyboarding & Audio Synchronization'
    ],
    faqs: [
      {
        question: 'What is the best tool for cinematic AI video clips?',
        answer: 'Runway Gen-3 Alpha, Luma Dream Machine, and Kling AI deliver the highest cinematic fidelity and motion consistency.'
      },
      {
        question: 'Which tool is best for talking head avatar videos?',
        answer: 'HeyGen and Synthesia lead the market for corporate presentations, multilingual translations, and photorealistic avatars.'
      }
    ]
  },
  'Audio & Music': {
    title: 'Top AI Voice Generators & Music Production Tools (2026)',
    tagline: 'High-fidelity voice synthesis, emotional speech cloning, and automated music composition.',
    description: 'From natural conversational speech synthesis to complete song production across multiple genres, audio AI enables rapid studio-grade audio production.',
    buyersGuide: 'Key metrics include emotional nuance, latency (essential for real-time conversational agents), voice clone fidelity from brief samples, and commercial music royalties.',
    keyEvaluationCriteria: [
      'Voice Naturalness and Emotional Prosody',
      'Low-Latency Speech Inference (<150ms)',
      'Few-Shot Voice Cloning Fidelity',
      'Commercial Music Distribution Rights'
    ],
    faqs: [
      {
        question: 'What is the gold standard for voice cloning and text-to-speech?',
        answer: 'ElevenLabs is universally recognized as the leader in emotional depth, multilingual voice cloning, and realistic prosody.'
      },
      {
        question: 'Can I release songs generated with Suno or Udio on Spotify?',
        answer: 'Yes, users on paid subscription plans retain full commercial rights to monetize their generated tracks across streaming services.'
      }
    ]
  },
  'Productivity & Notes': {
    title: 'Top AI Productivity, Meeting Assistants & Note Apps (2026)',
    tagline: 'Automate meeting transcriptions, knowledge graphs, and repetitive digital workflows.',
    description: 'AI productivity suites transform messy meetings, chaotic documentation, and inbox overload into organized, actionable execution plans.',
    buyersGuide: 'Prioritize tools that integrate natively into your existing stack (Slack, Zoom, Google Workspace, Notion) with strong permission controls.',
    keyEvaluationCriteria: [
      'Speech-to-Text Transcription Accuracy',
      'Automated Action Item Extraction',
      'Workspace Integration (Notion, Google Drive, Slack)',
      'Enterprise Privacy & Role-Based Access Control'
    ],
    faqs: [
      {
        question: 'Which AI tool is best for meeting summaries and action items?',
        answer: 'Otter.ai, Fireflies.ai, and Notion AI provide exceptional automated meeting notes and structured follow-ups.'
      }
    ]
  },
  'SEO & Marketing': {
    title: 'Best AI Tools for SEO, Marketing & Growth (2026)',
    tagline: 'Dominate organic search rankings with automated keyword clustering, SERP analysis, and content optimization.',
    description: 'AI SEO software decodes search intent, clusters topical authority maps, and identifies high-converting long-tail keyword opportunities before competitors.',
    buyersGuide: 'Ensure the tool analyzes real SERP ranking factors rather than generic keyword counts, and offers automated internal linking suggestions.',
    keyEvaluationCriteria: [
      'Real-Time SERP Analysis & Content Scoring',
      'Topical Authority & Semantic Clustering',
      'Automated Internal Linking and Optimization',
      'Competitor Gap Analysis & ROI Tracking'
    ],
    faqs: [
      {
        question: 'What is the most effective AI tool for content SEO scoring?',
        answer: 'Surfer SEO and Semrush AI provide real-time recommendations that align directly with currently ranking Google results.'
      }
    ]
  },
  'Design & 3D': {
    title: 'Top AI Tools for UI/UX Design & 3D Modeling (2026)',
    tagline: 'Transform wireframes into production UI designs and text into textured 3D meshes.',
    description: 'AI design tools accelerate creative pipelines from initial Figma concept to functional 3D game assets and responsive user interfaces.',
    buyersGuide: 'Examine export formats (.obj, .gltf, Figma components, clean Tailwind CSS) and mesh topology cleanliness.',
    keyEvaluationCriteria: [
      'Export Fidelity (Figma / glTF / Clean Mesh)',
      'Vector SVG & UI Component Generation',
      'Texture Mapping & UV Unwrapping Quality',
      'Design System Consistency'
    ],
    faqs: [
      {
        question: 'Can AI generate editable Figma designs directly?',
        answer: 'Yes, platforms like Uizard, Relume, and v0 generate fully structured design components and code.'
      }
    ]
  },
  'Research & Data': {
    title: 'Best AI Tools for Academic Research & Data Analysis (2026)',
    tagline: 'Synthesize scientific literature, extract tabular data, and run Python code against complex datasets.',
    description: 'Research AI bridges peer-reviewed literature with natural language queries, delivering cited syntheses and automated statistical analysis.',
    buyersGuide: 'Verify that every claim links to a real DOI, PubMed, or ArXiv citation with zero hallucinated bibliographies.',
    keyEvaluationCriteria: [
      'Verified Peer-Reviewed Citation Mapping (DOI/PubMed)',
      'Hallucination-Free Synthesis Index',
      'Python Sandbox Execution for Data Analysis',
      'PDF & Mathematical Formula Extraction'
    ],
    faqs: [
      {
        question: 'Which AI tool is best for systematic literature reviews?',
        answer: 'Consensus and Elicit query over 200 million research papers and provide verified takeaways without hallucinating citations.'
      }
    ]
  },
  'Legal AI': {
    title: 'Top AI Tools for Legal Research & Contract Review (2026)',
    tagline: 'Accelerate contract clause redlining, legal precedent discovery, and compliance audits.',
    description: 'Specialized legal AI engines trained on jurisdictional statutes and case law to reduce billable hours while enhancing accuracy.',
    buyersGuide: 'Ensure strict confidentiality, SOC2 compliance, and clear audit trails for legal defense verification.',
    keyEvaluationCriteria: [
      'Contract Clause Deviation Detection',
      'Jurisdictional Precedent Retrieval',
      'Zero-Model-Training Data Guarantees',
      'Attorney-Client Privilege Protection'
    ],
    faqs: [
      {
        question: 'Can legal AI replace attorneys for contract drafting?',
        answer: 'No, legal AI acts as an intelligence multiplier that redlines standard clauses, but human legal counsel remains essential for strategic binding agreements.'
      }
    ]
  },
  'Finance AI': {
    title: 'Best AI Software for Financial Modeling & Valuation (2026)',
    tagline: 'Automate financial statement analysis, earnings call summarization, and equity research.',
    description: 'Purpose-built financial AI models that parse 10-K filings, calculate DCF valuations, and detect subtle market sentiment shifts.',
    buyersGuide: 'Prioritize precision in tabular calculations, source document linking, and audit-ready formula transparency.',
    keyEvaluationCriteria: [
      'Numerical Calculation Accuracy (Zero Math Hallucinations)',
      'Direct SEC Filing & Earnings Call Grounding',
      'Excel & Google Sheets Plugin Integration',
      'Real-Time Market Data Feeds'
    ],
    faqs: [
      {
        question: 'Which AI tool connects directly to financial spreadsheets?',
        answer: 'Julius AI and FinChat provide direct spreadsheet integration and Python data visualization.'
      }
    ]
  }
};
