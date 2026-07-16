import NewsCard from "@/components/NewsCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useSort } from "@/context/SortContext";
import { sortArticles } from "@/utils/sortArticles";
import { FlatList, View } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

const favorites = () => {
  const { favorites } = useFavorites();
  const { sortOption } = useSort();
  const sortedFavorites = sortArticles(favorites, sortOption);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-primary text-xl font-semibold px-4 py-3">
        Favoriler
      </Text>

      {sortedFavorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Henüz favori eklenmedi.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedFavorites}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <NewsCard article={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default favorites;
