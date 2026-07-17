import { AppHeader } from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F2B705",
        tabBarInactiveTintColor: isDark ? "#A0A09A" : "#1F1F1F",
        tabBarStyle: {
          backgroundColor: isDark ? "#1E1E1E" : "#FFFFFF",
          borderTopColor: isDark ? "#3A3A36" : "#D8D2C0",
        },
        headerShown: true,
        header: () => (
          <AppHeader />
        ) /* AppHeader, her tab'da gösterilecek custom hook */,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Haberler",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoriler",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: "Detay",
          href: null,
        }}
      />
    </Tabs>
  );
}
