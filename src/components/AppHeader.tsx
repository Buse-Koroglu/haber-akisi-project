import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SortModal } from "./SortModal";
import { useRouter } from "expo-router";

export const AppHeader = () => {
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const router = useRouter();

  const handleSortPress = () => {
    setIsSortModalVisible(true);
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
          <TouchableOpacity onPress={handleSortPress}>
            <Ionicons name="options-outline" size={24} color="#1F1F1F" />
          </TouchableOpacity>
        </View>
      </View>

      <SortModal
        visible={isSortModalVisible}
        onClose={() => setIsSortModalVisible(false)}
      />
    </SafeAreaView>
  );
};
