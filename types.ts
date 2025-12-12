export interface Article {
  id: string;
  title: string;
  content: string; // This will now hold the full article text (e.g., review, main body)
  summary?: string; // Optional: for brief introductions (e.g., movie synopsis)
  author: string;
  date: string;
  category: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum Page {
  HOME = 'HOME',
  ARTICLES = 'ARTICLES',
  ABOUT = 'ABOUT',
  ARTICLE_DETAIL = 'ARTICLE_DETAIL'
}