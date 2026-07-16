import { getTopHeadlines } from "@/api/newsApi";
import NewsCard from "@/components/NewsCard";
import { Pagination } from "@/components/Pagination";
import { useSort } from "@/context/SortContext";
import { sortArticles } from "@/utils/sortArticles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppText as Text,
  AppTextInput as TextInput,
} from "@/components/ui/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";

const CATEGORIES = [
  { id: "all", label: "Tüm" },
  { id: "business", label: "Ekonomi" },
  { id: "technology", label: "Teknoloji" },
  { id: "sports", label: "Spor" },
  { id: "science", label: "Bilim" },
  { id: "health", label: "Sağlık" },
];

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);
  const PAGE_SIZE = 10;
  const queryClient = useQueryClient();

  const firstPageQueryKey = ["news", debouncedQuery, selectedCategory, 1];

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshResult = await getTopHeadlines({
        country: "us",
        category:
          selectedCategory === "all" ? undefined : (selectedCategory as any),
        page: 1,
        pageSize: PAGE_SIZE,
        q: debouncedQuery || undefined,
      });

      const cachedFirstPage =
        queryClient.getQueryData<typeof freshResult>(firstPageQueryKey);
      const knownUrls = new Set(
        (cachedFirstPage?.articles ?? []).map((a) => a.url),
      );
      const newArticles = freshResult.articles.filter(
        (a) => !knownUrls.has(a.url),
      );

      if (newArticles.length > 0 && cachedFirstPage) {
        queryClient.setQueryData(firstPageQueryKey, {
          ...cachedFirstPage,
          articles: [...newArticles, ...cachedFirstPage.articles],
          totalResults: freshResult.totalResults,
        });
      } else {
        queryClient.setQueryData(firstPageQueryKey, freshResult);
      }

      if (currentPage !== 1) {
        setCurrentPage(1);
      }
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["news", debouncedQuery, selectedCategory, currentPage],
    queryFn: async () => {
      const result = await getTopHeadlines({
        country: "us",
        category:
          selectedCategory === "all" ? undefined : (selectedCategory as any),
        page: currentPage,
        pageSize: PAGE_SIZE,
        q: debouncedQuery || undefined,
      });
      return result;
    },
  });

  const { sortOption } = useSort();

  const articles = sortArticles(data?.articles ?? [], sortOption);
  const totalResults = data?.totalResults ?? 0;

  useEffect(() => {
    if (totalResults > 0) {
      const calculatedPages = Math.ceil(totalResults / PAGE_SIZE);
      setTotalPages(calculatedPages > 10 ? 10 : calculatedPages);
    } else {
      setTotalPages(1);
    }
  }, [totalResults]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-4 my-3 relative justify-center">
        <TextInput
          className="news-search-input pl-10 pr-4 py-2.5"
          placeholder="Haberlerde arayın..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          clearButtonMode="while-editing"
        />
        <View className="absolute left-3">
          <Ionicons name="search" size={20} color="gray" />
        </View>
      </View>

      <View className="mb-2">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.id)}
                className={`mr-2 px-4 py-2 rounded-full ${
                  isSelected ? "bg-accent" : "bg-surface border border-border"
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`font-semibold text-xs ${
                    isSelected ? "text-white" : "text-primary"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <Text className="text-primary text-xl font-semibold px-4 py-2">
        {debouncedQuery
          ? `"${debouncedQuery}" Arama Sonuçları`
          : `${CATEGORIES.find((c) => c.id === selectedCategory)?.label} Haberleri`}
      </Text>

      {isLoading || isFetching ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1B1B1E" />
          {isFetching && (
            <Text className="text-muted text-xs mt-2">Yükleniyor...</Text>
          )}
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
      ) : articles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-muted text-sm text-center">
            Aramanızla eşleşen haber bulunamadı.
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={articles}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            renderItem={({ item }) => <NewsCard article={item} />}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={["#007AFF"]}
              />
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
