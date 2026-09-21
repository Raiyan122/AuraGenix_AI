import { AITool, ToolCategory } from '../types';

export interface ToolFeature {
  title: string;
  description: string;
  badge?: string;
}

export interface UseCaseScenario {
  title: string;
  role: string;
  description: string;
  benefit: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

export interface UserReview {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  likes: number;
}

// Generates category-specific deep features for any tool
export function getToolFeatures(tool: AITool): ToolFeature[] {
  const cat = tool.category;
  
  const commonFeatures: Record<ToolCategory, ToolFeature[]> = {
    'All': [],
    'Chatbots & Assistants': [
      {
        title: 'Deep Multi-Turn Context Processing',
        description: 'Retains long conversation histories with active context caching, allowing complex multi-step technical inquiries without semantic drift.',
        badge: 'Core Engine'
      },
      {
        title: 'Real-Time Web Search & Grounding',
        description: 'Synthesizes live internet sources with inline clickable citations, cross-verifying recent news and technical updates.',
        badge: 'Up to Date'
      },
      {
        title: 'Multimodal Vision & Document Ingestion',
        description: 'Analyzes high-resolution diagrams, complex multi-column PDFs, code screenshots, and spreadsheets natively.',
        badge: 'Multimodal'
      },
      {
        title: 'Advanced Reasoning & Chain-of-Thought',
        description: 'Exposes step-by-step logical reasoning before generating answers, significantly reducing hallucinations on math and logic.',
      },
      {
        title: 'Developer API & Custom Instructions',
        description: 'Enables tailored system prompts, temperature controls, schema-enforced JSON outputs, and webhook integrations.',
      },
      {
        title: 'Zero Data Retention (ZDR) Privacy Mode',
        description: 'Enterprise privacy toggles prevent proprietary company chat logs and uploaded documents from being used in future model training.',
        badge: 'Enterprise Safe'
      }
    ],
    'Coding & Dev': [
      {
        title: 'Full-Repository Context Understanding',
        description: 'Indexes local codebases using neural embeddings to understand cross-file dependencies, schema exports, and type hierarchies.',
        badge: 'Deep Index'
      },
      {
        title: 'Zero-Latency Ghost Autocompletions',
        description: 'Streams speculative tokens directly in your editor as you type, predicting repetitive boilerplate and complex function logic.',
        badge: 'Sub-50ms'
      },
      {
        title: 'Autonomous Multi-File Refactoring Agents',
        description: 'Generates unified diffs across multiple project directories, automatically creating unit tests and executing terminal commands.',
        badge: 'Agentic'
      },
      {
        title: 'Terminal Tool Calling & Error Self-Healing',
        description: 'Reads stdout and stderr compiler tracebacks, diagnosing dependency conflicts or syntax errors and applying instant fixes.',
      },
      {
        title: 'Automated Test Suite Generation',
        description: 'Synthesizes comprehensive unit, integration, and edge-case test suites matching your project framework conventions.',
      },
      {
        title: 'Strict SOC2 & Air-Gapped Compliance',
        description: 'Features enterprise deployment options including local self-hosted weights, VPN gateways, and strict NDA-compliant IP protections.',
        badge: 'Security'
      }
    ],
    'Copywriting & Content': [
      {
        title: 'Adaptive Brand Voice Calibration',
        description: 'Analyzes existing style guides, blog archives, and tone samples to consistently reproduce your company’s unique editorial personality.',
        badge: 'Brand Tone'
      },
      {
        title: 'High-Volume Batch Content Generation',
        description: 'Generates hundreds of SEO-optimized articles, product descriptions, or ad variants simultaneously from structured CSV files.',
        badge: 'Scale'
      },
      {
        title: 'Built-in Grammar & Plagiarism Auditing',
        description: 'Cross-checks billions of web documents to verify originality score, reading grade level, and syntactic fluidity.',
      },
      {
        title: 'Omnichannel Format Transformation',
        description: 'Instantly turns a single long-form whitepaper into tweet threads, LinkedIn carousels, email newsletters, and video scripts.',
      },
      {
        title: 'SERP & Search Intent Alignment',
        description: 'Scores drafts against top Google search ranking pages, recommending semantic LSI keywords and optimal header structures.',
      },
      {
        title: 'Collaborative Multi-Editor Workspaces',
        description: 'Supports real-time co-authoring, version rollbacks, feedback comments, and granular team approval workflows.',
      }
    ],
    'Image Generation': [
      {
        title: 'Photorealistic Rendering & Text Fidelity',
        description: 'Renders intricate skin textures, volumetric ray-traced lighting, and legible typography inside generated visual compositions.',
        badge: 'Photoreal'
      },
      {
        title: 'Interactive Inpainting & Generative Fill',
        description: 'Allows precise brush-based selection to modify, add, or erase objects seamlessly while preserving background perspective.',
        badge: 'Canvas Edit'
      },
      {
        title: 'Precise ControlNet & Pose Guidance',
        description: 'Locks character poses, architectural depth maps, and edge sketches using reference images for consistent multi-shot outputs.',
        badge: 'Pose Lock'
      },
      {
        title: 'Native 4K & Vector Upscaling',
        description: 'Enhances micro-details and textures up to ultra-high resolutions ready for print, billboard, and commercial digital displays.',
      },
      {
        title: 'Fine-Tuned Character Consistency (LoRA)',
        description: 'Trains custom lightweight models on your brand mascot or product line to generate identical subjects in any setting.',
      },
      {
        title: 'Full Commercial Copyright Clearances',
        description: 'Enterprise indemnity and trained-on-licensed-data guarantees protecting commercial advertising assets from legal dispute.',
        badge: 'Commercial Safe'
      }
    ],
    'Video Generation': [
      {
        title: 'Temporal Consistency & Physics Simulation',
        description: 'Maintains fluid object geometry, realistic fluid dynamics, and accurate gravitational physics throughout multi-second video clips.',
        badge: 'Physics Engine'
      },
      {
        title: 'Cinematic Camera Motion Controls',
        description: 'Directs virtual camera pans, tilts, zooms, roll trajectories, and drone fly-throughs with precision speed controls.',
        badge: 'Camera Rig'
      },
      {
        title: 'Multi-Prompt Keyframe Interpolation',
        description: 'Morphs scenes smoothly between start and end reference frames, enabling narrative storyboarding and complex transformations.',
      },
      {
        title: 'High Frame-Rate 60fps & 4K Export',
        description: 'Neural frame interpolation produces silky-smooth motion and crisp detail suitable for film, broadcast, and social video.',
      },
      {
        title: 'Motion Brush & Regional Masking',
        description: 'Isolates and animates specific portions of a static photo while keeping background elements completely stationary.',
      },
      {
        title: 'Lip-Sync & Expressive Audio Matching',
        description: 'Synchronizes character mouth movements, head nods, and micro-expressions perfectly with uploaded spoken voice audio tracks.',
        badge: 'Lip-Sync'
      }
    ],
    'Audio & Music': [
      {
        title: 'Studio-Grade Neural Vocal Synthesis',
        description: 'Generates emotive, lifelike speech with pitch inflection, breathing nuances, dynamic pacing, and accent adaptability.',
        badge: '99.4% Human'
      },
      {
        title: 'Full Multi-Instrumental Music Generation',
        description: 'Composes full radio-ready songs across genres with layered guitars, synths, drums, basslines, and synchronized lyrical vocals.',
        badge: 'Radio Quality'
      },
      {
        title: 'Instant Voice Cloning from 10s Samples',
        description: 'Replicates vocal timbre, resonance, and speaking cadences from short microphone clips for localized dubbing and audiobooks.',
      },
      {
        title: 'AI Stem Separation & Audio De-Noising',
        description: 'Isolates vocals, background music, reverb, and ambient room noise into separate lossless WAV stems for clean post-production.',
      },
      {
        title: 'Sub-150ms Real-Time Streaming Audio',
        description: 'Ultra-low latency audio generation ready for interactive voice bots, conversational agents, and real-time gaming avatars.',
        badge: 'Low Latency'
      },
      {
        title: 'Royalty-Free Commercial Licensing',
        description: 'Generated sound effects, musical cues, and voiceovers include clean copyright licenses for streaming, TV, and video games.',
      }
    ],
    'Productivity & Notes': [
      {
        title: 'Automated Meeting Intelligence & Action Items',
        description: 'Transcribes multi-speaker conversations with high fidelity, tagging owners, deadlines, and key decisions automatically.',
        badge: 'Meeting AI'
      },
      {
        title: 'Bi-Directional Knowledge Base Sync',
        description: 'Integrates natively with Google Drive, Slack, Notion, Jira, and GitHub to maintain an always-updated organizational brain.',
        badge: 'Live Sync'
      },
      {
        title: 'Semantic Vector Search Across All Docs',
        description: 'Queries thousands of past PDFs, emails, and notes using natural language to retrieve exact answers with source timestamps.',
      },
      {
        title: 'Predictive Schedule & Priority Automation',
        description: 'Reorganizes calendar blocks dynamically based on task deadlines, focus time preferences, and team time-zone availability.',
      },
      {
        title: 'Automated Executive Briefings',
        description: 'Summarizes daily email threads, sprint status updates, and customer support tickets into 2-minute actionable digests.',
      },
      {
        title: 'SOC2 Type II & GDPR Data Governance',
        description: 'Employs bank-grade AES-256 encryption at rest, role-based access control, and complete audit logging for enterprise IT.',
        badge: 'Security'
      }
    ],
    'SEO & Marketing': [
      {
        title: 'Reverse-Engineered SERP Content Scores',
        description: 'Audits top-ranking search competitors to uncover required keyword frequencies, word counts, and semantic topic clusters.',
        badge: 'Top SERP'
      },
      {
        title: 'Multi-Variant Ad Creative Generation',
        description: 'Generates high-converting visual banners, headlines, and call-to-actions scored against proven conversion data.',
        badge: 'Ad ROI'
      },
      {
        title: 'Automated Internal Linking Architect',
        description: 'Scans your entire website hierarchy and suggests context-rich internal anchors to boost organic page equity.',
      },
      {
        title: 'Competitor Backlink & Content Gap Radar',
        description: 'Identifies high-value keywords and referring domains where your competitors are gaining traffic ahead of you.',
      },
      {
        title: 'Automated Multi-Channel Campaign Sync',
        description: 'Deploys cohesive ad sets, landing pages, and email nurture sequences simultaneously across Google, Meta, and LinkedIn.',
      },
      {
        title: 'AI Attribution & ROAS Predictive Modeling',
        description: 'Predicts which ad creatives and keywords will yield highest return on ad spend before spending campaign budget.',
      }
    ],
    'Design & 3D': [
      {
        title: 'Text & Image to Game-Ready 3D Mesh',
        description: 'Generates textured 3D models with clean manifold quad topology ready for game engines, AR, and 3D printing in seconds.',
        badge: 'Mesh Gen'
      },
      {
        title: 'Physically Based Rendering (PBR) Materials',
        description: 'Outputs complete roughness, normal, displacement, metallic, and ambient occlusion texture map suites.',
        badge: 'PBR 4K'
      },
      {
        title: 'Automated Bipedal Skeleton Rigging',
        description: 'Analyzes character proportions and applies a functional 53-bone skeleton with standard animation weights in one click.',
        badge: 'Auto-Rig'
      },
      {
        title: 'Real-Time WebGL & Spatial Collaboration',
        description: 'Inspect, rotate, light, and sculpt 3D assets collaboratively inside the browser with live multi-user cursors.',
      },
      {
        title: 'Multi-Format Export Pipeline',
        description: 'Exports cleanly to industry standards including GLTF, USDZ, FBX, OBJ, and native Blender project formats.',
      },
      {
        title: 'Procedural Scene Lighting & Environment Maps',
        description: 'Synthesizes 360-degree high-dynamic-range panoramic skyboxes and lighting setups matching real-world conditions.',
      }
    ],
    'Research & Data': [
      {
        title: 'Synthesis of 200M+ Peer-Reviewed Papers',
        description: 'Extracts empirical findings directly from verified academic journals with citation links, sample sizes, and p-values.',
        badge: 'Academic Grade'
      },
      {
        title: 'Interactive Python Data Science Notebook',
        description: 'Executes automated data cleaning, statistical regression models, and exploratory charts from uploaded CSV/Excel files.',
        badge: 'Python Runner'
      },
      {
        title: 'Evidence-Based Consensus Matrix',
        description: 'Classifies scientific consensus (Yes / No / Inconclusive) on medical, biological, or macroeconomic hypotheses.',
        badge: 'Consensus'
      },
      {
        title: 'Automated Executive Dashboard Builder',
        description: 'Transforms unstructured SQL databases into interactive executive visualization charts and cohort retention graphs.',
      },
      {
        title: 'Deep Multi-Document PDF Comparative Extraction',
        description: 'Correlates financial numbers, balance sheets, and contract covenants across hundreds of 10-K filings simultaneously.',
      },
      {
        title: 'Audit Trails & Code Reproducibility',
        description: 'Exports reproducible Jupyter notebooks with step-by-step mathematical justifications for all calculated figures.',
        badge: 'Audit Ready'
      }
    ]
  };

  return commonFeatures[cat] || commonFeatures['Chatbots & Assistants'];
}

// Generates real-world use cases
export function getToolUseCases(tool: AITool): UseCaseScenario[] {
  const cat = tool.category;
  
  if (cat === 'Coding & Dev') {
    return [
      {
        title: 'Full-Stack Feature Prototyping',
        role: 'Senior Software Engineers',
        description: `Use ${tool.name} to scaffold complex backend endpoints, type-safe database schemas, and responsive UI components in minutes instead of days.`,
        benefit: 'Estimated 60% reduction in boilerplate coding time.'
      },
      {
        title: 'Legacy Codebase Refactoring & Migration',
        role: 'Tech Leads & Systems Architects',
        description: `Analyze thousands of lines of legacy code, trace dependencies across modules, and modernize libraries with automated regression test validation.`,
        benefit: 'Minimizes human error during multi-file architecture migrations.'
      },
      {
        title: 'Automated CI/CD Code Reviews',
        role: 'DevOps & QA Teams',
        description: `Integrate with GitHub pull requests to automatically catch memory leaks, security vulnerabilities, and unhandled edge cases prior to deployment.`,
        benefit: 'Elevates test coverage and expedites release velocity.'
      }
    ];
  }

  if (cat === 'Image Generation' || cat === 'Design & 3D') {
    return [
      {
        title: 'Brand Concept & Moodboard Creation',
        role: 'Creative Directors & Brand Designers',
        description: `Quickly generate dozens of photorealistic campaign concepts, packaging mockups, and stylistic visual directions for client pitch decks.`,
        benefit: 'Accelerates pre-production design approval by 4x.'
      },
      {
        title: 'Game & Virtual Production Asset Pipelines',
        role: '3D Artists & Game Developers',
        description: `Transform concept sketches into clean 3D meshes, procedural textures, and rigged characters compatible with Unreal Engine and Unity.`,
        benefit: 'Dramatically cuts 3D modeling turnaround costs.'
      },
      {
        title: 'Digital Marketing & Social Ad Creatives',
        role: 'Performance Marketers',
        description: `Create hundreds of bespoke image ad variants tailored to different demographics, testing lighting styles and product placements.`,
        benefit: 'Boosts ad click-through rate with fresh imagery.'
      }
    ];
  }

  if (cat === 'Video Generation') {
    return [
      {
        title: 'Commercial Advertising & B-Roll Generation',
        role: 'Video Producers & Agencies',
        description: `Produce cinematic 4K camera fly-throughs and atmospheric establishing shots without booking expensive on-location film crews.`,
        benefit: 'Saves thousands of dollars on physical production gear.'
      },
      {
        title: 'Social Media Short-Form Content',
        role: 'Content Creators & Influencers',
        description: `Create viral TikTok, Reels, and YouTube Shorts narratives with dynamic camera transitions, animated artwork, and lip-synced audio.`,
        benefit: 'Maintains daily posting cadence effortlessly.'
      },
      {
        title: 'Corporate Training & Internal Communications',
        role: 'HR & Educational Directors',
        description: `Build engaging video explainers and safety demonstrations with lifelike digital avatars and localized foreign language dubbing.`,
        benefit: 'Replaces static PDF manuals with memorable video lessons.'
      }
    ];
  }

  if (cat === 'Copywriting & Content' || cat === 'SEO & Marketing') {
    return [
      {
        title: 'High-Impact Editorial & Thought Leadership',
        role: 'Content Strategists & Copywriters',
        description: `Draft in-depth whitepapers, case studies, and executive opinion pieces while adhering strictly to proprietary brand tone guidelines.`,
        benefit: 'Triples editorial publishing capacity without sacrificing voice.'
      },
      {
        title: 'Top-Ranking SEO Pillar Pages',
        role: 'SEO Managers & Webmasters',
        description: `Map out comprehensive keyword clusters, generate optimized metadata, and build exhaustive pillar content addressing target search intent.`,
        benefit: 'Accelerates organic search traffic acquisition.'
      },
      {
        title: 'Omnichannel Email & Ad Copy Testing',
        role: 'Growth & Lifecycle Marketers',
        description: `Produce dozens of subject lines, headline angles, and call-to-action variants to conduct rigorous A/B split tests across email lists.`,
        benefit: 'Measurably lifts open rates and customer conversion.'
      }
    ];
  }

  if (cat === 'Research & Data') {
    return [
      {
        title: 'Literature Review & Citation Mapping',
        role: 'Academic Researchers & Postdocs',
        description: `Scan thousands of biomedical or computational studies to identify consensus points, contradictory trial findings, and methodological limitations.`,
        benefit: 'Shortens weeks of manual JSTOR/PubMed reading into hours.'
      },
      {
        title: 'Financial 10-K & Competitor Earnings Synthesis',
        role: 'Investment Analysts & VC Associates',
        description: `Upload multi-hundred-page quarterly filings to compare margin expansion, risk disclosures, and forward guidance across competitors.`,
        benefit: 'Surfaces subtle corporate risk indicators with audit trails.'
      },
      {
        title: 'Business Intelligence & Automated SQL Analytics',
        role: 'Data Scientists & Product Managers',
        description: `Query internal metrics warehouses using conversational natural language, producing instant cohort heatmaps and predictive churn charts.`,
        benefit: 'Empowers non-technical team members with instant data access.'
      }
    ];
  }

  // Default for Chatbots, Productivity, Audio, etc.
  return [
    {
      title: 'Daily Workflow Acceleration & Task Automation',
      role: 'Founders & Operations Leaders',
      description: `Use ${tool.name} as an always-available cognitive co-pilot to draft strategic emails, parse contract terms, and summarize sprawling meeting threads.`,
      benefit: 'Frees up 8+ hours of weekly executive cognitive load.'
    },
    {
      title: 'Customer Experience & Real-Time Support',
      role: 'Support Managers & Customer Success',
      description: `Resolve customer inquiries instantly with grounded company documentation, escalating only high-complexity issues to human specialists.`,
      benefit: 'Reduces first-response SLA from hours to seconds.'
    },
    {
      title: 'Knowledge Synthesizer & Cross-Team Brain',
      role: 'Knowledge Workers & Product Teams',
      description: `Centralize scattered documentation across Notion, Slack, and cloud storage into a unified queryable intelligence layer.`,
      benefit: 'Eliminates redundant work and keeps cross-functional teams aligned.'
    }
  ];
}

// Generates pricing tier breakdown
export function getToolPricingPlans(tool: AITool): PricingPlan[] {
  const isFree = tool.pricing === 'Free' || tool.pricing === 'Open Source';
  const isPaid = tool.pricing === 'Paid';

  if (isFree) {
    return [
      {
        name: 'Community / Open',
        price: 'Free',
        billingPeriod: 'Forever Free',
        description: `Full access to ${tool.name} without recurring subscription costs.`,
        features: [
          'Uncapped community usage',
          'Access to core model capabilities',
          'Self-hosting / Open weights availability',
          'Community Discord & GitHub support',
          'Standard processing throughput'
        ],
        popular: true,
        ctaText: 'Get Started for Free'
      },
      {
        name: 'Pro Cloud / Supporter',
        price: '$12',
        billingPeriod: 'per month',
        description: 'Optional cloud-hosted infrastructure with priority compute nodes.',
        features: [
          'High-throughput dedicated GPU servers',
          'Early preview access to new model checkpoints',
          'Priority queuing during peak hours',
          'Direct email developer support',
          'Commercial deployment rights'
        ],
        ctaText: 'Upgrade to Pro'
      },
      {
        name: 'Enterprise Dedicated',
        price: 'Custom',
        billingPeriod: 'annual contract',
        description: 'Air-gapped on-premise installation and dedicated SLA warranties.',
        features: [
          'Custom VPC or on-prem deployment',
          'Zero Data Retention (ZDR) guarantee',
          'SOC2 Type II compliance audit',
          'Dedicated Customer Success Architect',
          '99.9% uptime SLA guarantee'
        ],
        ctaText: 'Contact Enterprise Sales'
      }
    ];
  }

  if (isPaid) {
    return [
      {
        name: 'Starter / Individual',
        price: tool.pricingStarting || '$20',
        billingPeriod: 'per user / month',
        description: `Entry tier offering core features of ${tool.name} for individual professionals.`,
        features: [
          'Standard access to primary features',
          '500 monthly generation credits',
          'Email support with 24h turnaround',
          'Export in standard formats',
          'Single user license'
        ],
        ctaText: 'Start 14-Day Trial'
      },
      {
        name: 'Professional Team',
        price: '$49',
        billingPeriod: 'per seat / month',
        description: 'The standard plan chosen by high-growth startups and fast-moving teams.',
        features: [
          'Unlimited generation throughput',
          'Advanced multi-user team collaboration',
          'Shared workspace & centralized billing',
          'Priority queue access 24/7',
          'High-speed API endpoints',
          'Commercial copyright clearance'
        ],
        popular: true,
        ctaText: 'Choose Pro Team'
      },
      {
        name: 'Enterprise Scale',
        price: 'Custom',
        billingPeriod: 'annual billing',
        description: 'Tailored for large organizations requiring custom SLAs and deep integrations.',
        features: [
          'Custom volume discounts & unmetered API',
          'SSO (SAML, Okta) & SCIM user provisioning',
          'Dedicated Technical Account Manager',
          'Custom fine-tuned weights & brand presets',
          'Legal indemnification & SOC2 compliance'
        ],
        ctaText: 'Request Custom Quote'
      }
    ];
  }

  // Freemium default
  return [
    {
      name: 'Free Tier',
      price: '$0',
      billingPeriod: 'No credit card required',
      description: `Try out the core capabilities of ${tool.name} with generous daily limits.`,
      features: [
        'Access to foundational model weights',
        'Standard generation speed',
        'Web interface & mobile app access',
        'Community forum support',
        'Public project sharing'
      ],
      ctaText: 'Start Free'
    },
    {
      name: 'Pro Subscription',
      price: tool.pricingStarting.includes('$') ? tool.pricingStarting : '$20',
      billingPeriod: 'per month',
      description: 'Unlock maximum model intelligence, speed, and premium feature tiers.',
      features: [
        '5x higher usage limits or unlimited access',
        'Access to flagship reasoning engines',
        'Fastest response throughput & zero queues',
        'Early access to beta features & canvas',
        'Full commercial usage license',
        'Priority customer support'
      ],
      popular: true,
      ctaText: 'Upgrade to Pro'
    },
    {
      name: 'Enterprise / Business',
      price: 'Custom',
      billingPeriod: 'billed annually',
      description: 'Centralized admin controls, security hardening, and dedicated support.',
      features: [
        'Zero Data Retention (ZDR) guarantee',
        'SSO/SAML authentication & directory sync',
        'Centralized workspace analytics & audit logs',
        'Custom corporate invoicing & PO support',
        'Dedicated account manager & SLA'
      ],
      ctaText: 'Contact Sales'
    }
  ];
}

// Generates verified user reviews
export function getInitialUserReviews(tool: AITool): UserReview[] {
  return [
    {
      id: `${tool.id}-rev-1`,
      author: 'Marcus Vance',
      role: 'Staff Product Engineer',
      company: 'Dataview Cloud',
      rating: 5,
      date: '2 weeks ago',
      title: `Indispensable tool for our daily operations`,
      content: `We integrated ${tool.name} into our pipeline 3 months ago. The speed and quality of output exceeded our expectations. ${tool.pros[0] || 'Reliable and fast.'} It has fundamentally changed how our team collaborates.`,
      verified: true,
      likes: 42
    },
    {
      id: `${tool.id}-rev-2`,
      author: 'Elena Rostova',
      role: 'Creative Director',
      company: 'Studio Neoform',
      rating: tool.rating >= 4.8 ? 5 : 4,
      date: '1 month ago',
      title: `Impressive fidelity with minor learning curve`,
      content: `The consistency across iterations is stellar. While ${tool.cons[0]?.toLowerCase() || 'it requires some initial setup'}, once dialed in, the return on investment is undeniable. Highly recommended for professionals in ${tool.category}.`,
      verified: true,
      likes: 29
    },
    {
      id: `${tool.id}-rev-3`,
      author: 'David Chen',
      role: 'VP of Technology',
      company: 'AcroScale Ventures',
      rating: 5,
      date: '2 months ago',
      title: `Saved our team hundreds of hours this quarter`,
      content: `The benchmark rating of ${tool.rating.toFixed(1)}/5 is well-deserved. Outstanding support and frequent updates. ${tool.shortTagline}`,
      verified: true,
      likes: 18
    }
  ];
}
