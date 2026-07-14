import { Article } from "@/api/newsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<Article[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("@my_favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      throw new Error("Failed to load favorites from storage.");
    }
  };

  const saveFavorites = async (newFavorites: Article[]) => {
    try {
      await AsyncStorage.setItem("@my_favorites", JSON.stringify(newFavorites));
    } catch (error) {
      throw new Error("Failed to save favorites to storage.");
    }
  };

  const toggleFavorite = (newsItem: Article) => {
    const exist = favorites.some((item) => item.url === newsItem.url);
    let updatedFavorites: Article[];
    if (exist) {
      updatedFavorites = favorites.filter((item) => item.url !== newsItem.url);
    } else {
      updatedFavorites = [...favorites, newsItem];
    }
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.url === id);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error(
      "useFavorites mutlaka FavoritesProvider içinde kullanılmalıdır.",
    );
  }
  return context;
};
