import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, TouchableOpacity, View, Image } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import Webview from "react-native-webview";
import { Article } from "../../type";

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
          <Image
            source={require("@/assets/images/back-button.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
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
