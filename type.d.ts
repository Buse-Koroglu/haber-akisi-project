interface FavoriteContextType {
  favorites: NewsItem[];
  toggleFavorite: (newsItem: NewsItem) => void;
  isFavorite: (id: string) => boolean;
}
