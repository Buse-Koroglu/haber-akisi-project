import { Article } from "@/api/newsApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const newsDetails = () => {
  const { article } = useLocalSearchParams<{ article: string }>();
  const parsedArticle: Article | null = article ? JSON.parse(article) : null;
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/webview",
      params: { article: JSON.stringify(parsedArticle) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="text-2xl font-bold px-4 py-3">
        {parsedArticle?.title}
      </Text>

      <Text className="text-sm px-4 py-1">{parsedArticle?.source?.name}</Text>
      <Text className="text-sm px-4 py-2 text-gray-500">
        Tarih: {parsedArticle?.publishedAt}
      </Text>

      <View>
        <Image
          source={
            parsedArticle?.urlToImage
              ? { uri: parsedArticle.urlToImage }
              : require("@/assets/images/fallback.png")
          }
          className="news-detail-image"
          resizeMode="cover"
        />

        <Text className="text-md px-4 py-3 text-gray-500">
          {parsedArticle?.description || "Açıklama bulunamadı."}
        </Text>

        {parsedArticle?.content && (
          <>
            <Text className="news-detail-section-title">Detaylar</Text>
            <Text className="news-detail-section-content">
              {parsedArticle.content.replace(/\s*\[\+\d+ chars\]$/, "")}
            </Text>
          </>
        )}

        <TouchableOpacity
          onPress={handlePress}
          className="news-card-source-button"
        >
          <Text className="text-white">Haber Kaynağına Gidin</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default newsDetails;
