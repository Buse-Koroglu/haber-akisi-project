import { AppHeader } from "@/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F2B705",
        tabBarInactiveTintColor: "#1F1F1F",
        headerShown: true,
        header: () => <AppHeader />,
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
          title: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
