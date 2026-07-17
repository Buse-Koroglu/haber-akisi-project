import NewsCard from "@/components/NewsCard";
import { useFavorites } from "@/context/FavoritesContext";
import { useSort } from "@/context/SortContext";
import { sortArticles } from "@/utils/sortArticles";
import { FlatList, View } from "react-native";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "@/components/ui/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "@/components/Pagination";

const favorites = () => {
  const { favorites } = useFavorites();
  const { sortOption } = useSort();
  const sortedFavorites = sortArticles(favorites, sortOption);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const flatListRef = useRef<FlatList>(null);
  const PAGE_SIZE = 10;

  const totalResults = favorites.length;

  useEffect(() => {
    if (totalResults > 0) {
      const calculatedPages = Math.ceil(totalResults / PAGE_SIZE);
      setTotalPages(calculatedPages > 10 ? 10 : calculatedPages);
    } else {
      setTotalPages(1);
    }
  }, [totalResults]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  const filteredFavorites = debouncedQuery
    ? sortedFavorites.filter((item) =>
        item.title?.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
    : sortedFavorites;

  const paginatedFavorites = filteredFavorites.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-4 my-3 relative justify-center">
        <TextInput
          className="news-search-input pl-10 pr-4 py-2.5"
          placeholder="Favorilerde arayın..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          maxLength={50}
          clearButtonMode="while-editing"
        />
        <View className="absolute left-3">
          <Ionicons name="search" size={20} color="gray" />
        </View>
      </View>
      <Text className="text-primary text-xl font-semibold px-4 py-3">
        Favoriler
      </Text>

      {filteredFavorites.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500 text-lg">
            {debouncedQuery
              ? "Aramanızla eşleşen favori bulunamadı."
              : "Henüz favori eklenmedi."}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={paginatedFavorites}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <NewsCard article={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </SafeAreaView>
  );
};

export default favorites;
