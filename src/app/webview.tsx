import { Article } from "@/api/newsApi";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Webview from "react-native-webview";

const webview = () => {
  const { article } = useLocalSearchParams<{ article: string }>();
  const parsedArticle: Article | null = article ? JSON.parse(article) : null;
  const router = useRouter();

  if (!parsedArticle?.url) return null;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="webview-header">
        <TouchableOpacity
          className="webview-back-button"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Geri Dön</Text>
        </TouchableOpacity>
      </View>
      <Webview
        source={{ uri: parsedArticle.url }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        renderLoading={() => (
          <View className="webview-loading-indicator">
            <ActivityIndicator size="large" color="#007AFF" />
            <Text className="webview-loading-text">
              Kaynak Sayfa Yükleniyor...
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default webview;
