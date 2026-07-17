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

export type { Article } from "./api/schemas";
