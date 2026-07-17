import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, TouchableOpacity, View, Image, Share } from "react-native";
import { AppText as Text } from "@/components/ui/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { SortModal } from "./SortModal";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_THEME } from "@/constants/theme";
import { Article } from "../../type";
import { is } from "date-fns/locale";

export const AppHeader = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const isDetailsScreen = segments[segments.length - 1] === "details";
  const { article } = useLocalSearchParams<{ article: string }>();
  const { colorScheme, setColorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#F2F2F0" : "#1F1F1F";
  const isDark = colorScheme === "dark";

  const handleThemeToggle = () => {
    const nextScheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(nextScheme);
    AsyncStorage.setItem(APP_THEME, nextScheme);
  };

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
    <SafeAreaView
      edges={["top"]}
      className="bg-background dark:bg-darkBackground"
    >
      <View className="app-header">
        <TouchableOpacity onPress={() => router.push("/")}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="app-header-logo">
          Odak<Text className="app-header-logo-dot">.</Text>
        </Text>
        <View className="app-header-icon-wrap flex-row items-center gap-4">
          <TouchableOpacity onPress={handleThemeToggle}>
            <Ionicons
              name={colorScheme === "dark" ? "sunny-outline" : "moon-outline"}
              size={22}
              color={iconColor}
            />
          </TouchableOpacity>

          {isDetailsScreen ? (
            <TouchableOpacity onPress={handleShare}>
              {isDark ? (
                <Image
                  source={require("@/assets/images/light_share.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require("@/assets/images/dark_share.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSortPress}>
              <Ionicons name="options-outline" size={24} color={iconColor} />
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
