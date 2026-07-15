import { Article } from "@/api/newsApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

  const formattedDate = parsedArticle?.publishedAt
    ? new Date(parsedArticle.publishedAt).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="news-detail-header">
          <View className="news-detail-meta-row">
            {parsedArticle?.source?.name && (
              <View className="news-detail-source-badge">
                <Text className="news-detail-source-badge-text">
                  {parsedArticle.source.name}
                </Text>
              </View>
            )}
            {formattedDate && (
              <Text className="news-detail-date">{formattedDate}</Text>
            )}
          </View>
        </View>

        <Text className="news-detail-title">{parsedArticle?.title}</Text>

        <View className="news-detail-image-wrap">
          <Image
            source={
              parsedArticle?.urlToImage
                ? { uri: parsedArticle.urlToImage }
                : require("@/assets/images/fallback.png")
            }
            className="news-detail-image"
            resizeMode="cover"
          />
        </View>

        <Text className="news-detail-description">
          {parsedArticle?.description || "Açıklama bulunamadı."}
        </Text>

        {parsedArticle?.content && (
          <View className="news-detail-card">
            <Text className="news-detail-section-title">
              {" "}
              Haberin Detayları
            </Text>
            <Text className="news-detail-section-content">
              {parsedArticle.content.replace(/\s*\[\+\d+ chars\]$/, "")}
            </Text>
          </View>
        )}

        <View className="news-detail-actions">
          <TouchableOpacity
            onPress={handlePress}
            className="news-detail-source-button"
          >
            <Text className="news-detail-source-button-text">
              Haber Kaynağına Gidin
            </Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default newsDetails;
