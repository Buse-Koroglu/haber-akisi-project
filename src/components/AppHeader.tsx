import { Article } from "@/api/newsApi";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SortModal } from "./SortModal";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";

export const AppHeader = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const isDetailsScreen = segments[segments.length - 1] === "details";
  const { article } = useLocalSearchParams<{ article: string }>();

  const handleSortPress = () => {
    setIsSortModalVisible(true);
  };

  const handleShare = async () => {
    const parsedArticle: Article | null = article ? JSON.parse(article) : null;
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
    <SafeAreaView edges={["top"]} className="bg-background">
      <View className="app-header">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          className="app-header-logo"
          style={{ fontFamily: Platform.OS === "ios" ? "Georgia" : "serif" }}
        >
          Odak<Text className="app-header-logo-dot">.</Text>
        </Text>
        <View className="app-header-icon-wrap">
          {isDetailsScreen ? (
            <TouchableOpacity onPress={handleShare}>
              <Image
                source={require("@/assets/images/share-removebg-preview.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSortPress}>
              <Ionicons name="options-outline" size={24} color="#1F1F1F" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
      />
    </SafeAreaView>
  );
};
