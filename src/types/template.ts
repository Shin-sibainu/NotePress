export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  status: 'ready' | 'coming_soon';
  featured?: boolean;
  tags: string[];
} 