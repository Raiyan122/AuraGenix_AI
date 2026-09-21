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

export type PricingType = 'All' | 'Free' | 'Freemium' | 'Paid';

export interface AITool {
  id: string;
  name: string;
  category: Exclude<ToolCategory, 'All'>;
  shortDescription: string;
  fullReview: string;
  rating: number;
  reviewCount: number;
  pricing: 'Free' | 'Freemium' | 'Paid';
  pricingStarting: string;
  badge?: string;
  tags: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  websiteUrl: string;
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
