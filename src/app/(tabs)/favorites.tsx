import NewsCard from "@/components/NewsCard";
import { useFavorites } from "@/context/FavoritesContext";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const favorites = () => {
  const { favorites } = useFavorites();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-primary text-xl font-semibold px-4 py-3">
        Favoriler
      </Text>

      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">Henüz favori eklenmedi.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <NewsCard article={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
};

export default favorites;
