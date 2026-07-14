import { Article } from "@/api/newsApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Bu haberi kontrol etmek için tıklayın:\n" + parsedArticle?.url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          Alert.alert("Başarılı", "İçerik başarıyla paylaşıldı!");
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error: any) {
      Alert.alert("Bir Hata Oluştu", error.message);
    }
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

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleShare}
            className="news-card-source-button"
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text className="text-white">Haberi Paylaşın</Text>
              <Ionicons name="share-outline" size={15} color="white" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            className="news-card-source-button"
          >
            <Text className="text-white">Haber Kaynağına Gidin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default newsDetails;
