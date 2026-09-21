export type ToolCategory =
  | 'All'
  | 'Chatbots & Assistants'
  | 'Coding & Dev'
  | 'Copywriting & Content'
  | 'Image Generation'
  | 'Video Generation'
  | 'Audio & Music'
  | 'Productivity & Notes'
  | 'SEO & Marketing'
  | 'Design & 3D'
  | 'Research & Data';

export type PricingType = 'All' | 'Free' | 'Freemium' | 'Paid' | 'Open Source';

export interface AITool {
  id: string;
  name: string;
  category: Exclude<ToolCategory, 'All'>;
  // Core fields requested
  shortTagline: string;
  detailedDescription: string;
  officialWebsiteUrl: string;
  logoUrl: string;
  pricingModel: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  rating: number;
  
  // Extended fields for rich review modal & compatibility
  shortDescription: string;
  fullReview: string;
  websiteUrl: string;
  pricing: 'Free' | 'Freemium' | 'Paid' | 'Open Source';
  pricingStarting: string;
  reviewCount: number;
  badge?: string;
  tags: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  verifiedYear: number;
}

export interface ReviewSubmission {
  toolName: string;
  website: string;
  category: string;
  pricing: string;
  description: string;
  email: string;
}
