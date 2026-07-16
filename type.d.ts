export interface FavoriteContextType {
  favorites: NewsItem[];
  toggleFavorite: (newsItem: NewsItem) => void;
  isFavorite: (id: string) => boolean;
}

export interface topHeadlinesParams {
  country?: string;
  category?:
    | "business"
    | "entertainment"
    | "general"
    | "health"
    | "science"
    | "sports"
    | "technology";
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}
