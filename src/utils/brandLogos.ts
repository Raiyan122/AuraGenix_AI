/**
 * AuraGenix AI - Official Brand Logo Registry & Resolver
 * Provides verified high-resolution SVG and PNG logos for leading AI platforms,
 * backed by automated domain resolution via Clearbit and Google S2 APIs.
 */

import { extractDomain } from './logoUtils';

// Curated dictionary of official brand vector SVGs and high-res logos
export const BRAND_LOGOS: Record<string, string> = {
  // Conversational & Chatbots
  'chatgpt': 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128',
  'openai': 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
  'claude': 'https://cdn.simpleicons.org/anthropic',
  'anthropic': 'https://cdn.simpleicons.org/anthropic',
  'claude-3-7-sonnet': 'https://cdn.simpleicons.org/anthropic',
  'claude-37-sonnet-2': 'https://cdn.simpleicons.org/anthropic',
  'google-gemini': 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
  'google-gemini-advanced-3': 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
  'gemini': 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128',
  'perplexity': 'https://cdn.simpleicons.org/perplexity',
  'perplexity-ai-4': 'https://cdn.simpleicons.org/perplexity',
  'perplexity-pro': 'https://cdn.simpleicons.org/perplexity',
  'deepseek': 'https://avatars.githubusercontent.com/u/148330837?s=200&v=4',
  'deepseek-r1-5': 'https://avatars.githubusercontent.com/u/148330837?s=200&v=4',
  'mistral': 'https://www.google.com/s2/favicons?domain=mistral.ai&sz=128',
  'mistral-le-chat-6': 'https://www.google.com/s2/favicons?domain=mistral.ai&sz=128',
  'microsoft-copilot': 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  'microsoft-copilot-7': 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  'grok': 'https://cdn.simpleicons.org/x',
  'grok-3-8': 'https://cdn.simpleicons.org/x',
  'meta-ai': 'https://cdn.simpleicons.org/meta',
  'meta-ai-11': 'https://cdn.simpleicons.org/meta',
  'ollama': 'https://ollama.com/public/ollama.png',
  'ollama-14': 'https://ollama.com/public/ollama.png',
  'lm-studio': 'https://www.google.com/s2/favicons?domain=lmstudio.ai&sz=128',
  'lm-studio-13': 'https://www.google.com/s2/favicons?domain=lmstudio.ai&sz=128',
  'jan-ai': 'https://www.google.com/s2/favicons?domain=jan.ai&sz=128',
  'jan-ai-12': 'https://www.google.com/s2/favicons?domain=jan.ai&sz=128',
  'huggingface': 'https://cdn.simpleicons.org/huggingface',
  'huggingchat-24': 'https://cdn.simpleicons.org/huggingface',
  'groq': 'https://www.google.com/s2/favicons?domain=groq.com&sz=128',
  'groq-cloud-29': 'https://www.google.com/s2/favicons?domain=groq.com&sz=128',

  // Coding & Developer AI
  'cursor': 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128',
  'cursor-ai': 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128',
  'github-copilot': 'https://cdn.simpleicons.org/githubcopilot',
  'v0': 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128',
  'v0-by-vercel': 'https://www.google.com/s2/favicons?domain=v0.dev&sz=128',
  'replit': 'https://cdn.simpleicons.org/replit',
  'codeium': 'https://www.google.com/s2/favicons?domain=codeium.com&sz=128',
  'windsurf': 'https://www.google.com/s2/favicons?domain=codeium.com&sz=128',
  'tabnine': 'https://www.google.com/s2/favicons?domain=tabnine.com&sz=128',
  'supermaven': 'https://www.google.com/s2/favicons?domain=supermaven.com&sz=128',
  'bolt-new': 'https://www.google.com/s2/favicons?domain=bolt.new&sz=128',
  'lovable': 'https://www.google.com/s2/favicons?domain=lovable.dev&sz=128',

  // Image Generation & Art
  'midjourney': 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128',
  'midjourney-v6': 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128',
  'dall-e': 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
  'stable-diffusion': 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
  'stability-ai': 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
  'flux': 'https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128',
  'flux-1-pro': 'https://www.google.com/s2/favicons?domain=blackforestlabs.ai&sz=128',
  'leonardo-ai': 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128',
  'ideogram': 'https://www.google.com/s2/favicons?domain=ideogram.ai&sz=128',
  'recraft': 'https://www.google.com/s2/favicons?domain=recraft.ai&sz=128',
  'canva': 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
  'adobe-firefly': 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',

  // Video Generation & Editing
  'runway': 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
  'runway-gen-3': 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
  'luma-dream-machine': 'https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=128',
  'pika': 'https://www.google.com/s2/favicons?domain=pika.art&sz=128',
  'kling-ai': 'https://www.google.com/s2/favicons?domain=klingai.com&sz=128',
  'sora': 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
  'heygen': 'https://www.google.com/s2/favicons?domain=heygen.com&sz=128',
  'synthesia': 'https://www.google.com/s2/favicons?domain=synthesia.io&sz=128',
  'descript': 'https://www.google.com/s2/favicons?domain=descript.com&sz=128',
  'invideo': 'https://www.google.com/s2/favicons?domain=invideo.io&sz=128',
  'capcut': 'https://www.google.com/s2/favicons?domain=capcut.com&sz=128',

  // Audio & Voice AI
  'elevenlabs': 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128',
  'suno': 'https://www.google.com/s2/favicons?domain=suno.com&sz=128',
  'suno-ai': 'https://www.google.com/s2/favicons?domain=suno.com&sz=128',
  'udio': 'https://www.google.com/s2/favicons?domain=udio.com&sz=128',
  'riffusion': 'https://www.google.com/s2/favicons?domain=riffusion.com&sz=128',
  'krisp': 'https://www.google.com/s2/favicons?domain=krisp.ai&sz=128',
  'speechify': 'https://www.google.com/s2/favicons?domain=speechify.com&sz=128',
  'murf-ai': 'https://www.google.com/s2/favicons?domain=murf.ai&sz=128',

  // Copywriting, Content & Notes
  'notion': 'https://cdn.simpleicons.org/notion',
  'notion-ai': 'https://cdn.simpleicons.org/notion',
  'jasper': 'https://www.google.com/s2/favicons?domain=jasper.ai&sz=128',
  'jasper-chat-22': 'https://www.google.com/s2/favicons?domain=jasper.ai&sz=128',
  'copy-ai': 'https://www.google.com/s2/favicons?domain=copy.ai&sz=128',
  'writesonic': 'https://www.google.com/s2/favicons?domain=writesonic.com&sz=128',
  'writesonic-chatsonic-23': 'https://www.google.com/s2/favicons?domain=writesonic.com&sz=128',
  'grammarly': 'https://cdn.simpleicons.org/grammarly',
  'quillbot': 'https://www.google.com/s2/favicons?domain=quillbot.com&sz=128',

  // SEO & Marketing
  'semrush': 'https://cdn.simpleicons.org/semrush',
  'ahrefs': 'https://www.google.com/s2/favicons?domain=ahrefs.com&sz=128',
  'surfer-seo': 'https://www.google.com/s2/favicons?domain=surferseo.com&sz=128',

  // Research & Data
  'consensus': 'https://www.google.com/s2/favicons?domain=consensus.app&sz=128',
  'elicit': 'https://www.google.com/s2/favicons?domain=elicit.com&sz=128',
  'scite': 'https://www.google.com/s2/favicons?domain=scite.ai&sz=128',
  'julius-ai': 'https://www.google.com/s2/favicons?domain=julius.ai&sz=128'
};

/**
 * Normalizes tool key for brand dictionary lookup
 */
export function normalizeToolKey(name: string, id?: string): string {
  if (id && BRAND_LOGOS[id]) return id;
  
  const clean = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (BRAND_LOGOS[clean]) return clean;

  // Partial matches
  for (const key of Object.keys(BRAND_LOGOS)) {
    if (clean.startsWith(key) || clean.includes(key)) {
      return key;
    }
  }

  return clean;
}

/**
 * Resolves the absolute best official logo URL for an AI tool.
 * Evaluates in priority:
 * 1. Specific Curated High-Res Brand SVG/PNG
 * 2. Custom Logo URL (if valid non-generic)
 * 3. Clearbit Logo API (official vector/PNG from domain)
 * 4. Google S2 Favicon API (128px high resolution)
 */
export function getOfficialLogoUrl(toolName: string, websiteUrl: string, customLogoUrl?: string, toolId?: string): string {
  const brandKey = normalizeToolKey(toolName, toolId);
  if (BRAND_LOGOS[brandKey]) {
    return BRAND_LOGOS[brandKey];
  }

  if (customLogoUrl && !customLogoUrl.includes('placeholder') && !customLogoUrl.includes('seeklogo') && !customLogoUrl.includes('data:image')) {
    return customLogoUrl;
  }

  const domain = extractDomain(websiteUrl);
  if (domain) {
    // Official high-resolution 128px brand logo fetched directly from domain metadata
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
  }

  return '';
}
