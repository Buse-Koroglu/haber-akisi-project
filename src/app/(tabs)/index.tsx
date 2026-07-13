import { searchNews } from "@/api/newsApi";
import NewsCard from "@/components/NewsCard";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const {
    data: news = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["news", debouncedQuery],
    queryFn: () =>
      searchNews({
        keyword: debouncedQuery || "türkiye",
        language: "tr",
      }),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View>
        <TextInput
          className="news-search-input mx-4 my-3 "
          placeholder="Arama yapın..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          clearButtonMode="while-editing"
        />
        <Ionicons
          name="search"
          size={20}
          color="gray"
          className="news-search-icon"
        />
      </View>
      <Text className="text-primary text-xl font-semibold px-4 py-3">
        Haberler
      </Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1E5F8C" />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-primary text-base font-semibold text-center mb-1">
            Haberler yüklenemedi
          </Text>
          <Text className="text-muted text-sm text-center">
            {(error as Error)?.message ?? "Bir hata oluştu."}
          </Text>
        </View>
      ) : news.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-muted text-sm text-center">
            Sonuç bulunamadı.
          </Text>
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.url}
          renderItem={({ item }) => <NewsCard article={item} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </SafeAreaView>
  );
}
