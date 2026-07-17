import { AppHeader } from "@/components/AppHeader";
import { colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMemo } from "react";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  /* screen options useMemo ve isDark dependecy ile verdiğim için şuan sadece tema değişiminde render edilecek. */
  const screenOptions = useMemo(
    () => ({
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: isDark
        ? colors.dark.inactive
        : colors.light.inactive,
      tabBarStyle: {
        backgroundColor: isDark
          ? colors.dark.background
          : colors.light.background,
        borderTopColor: isDark ? colors.dark.border : colors.light.border,
      },
      headerShown: true,
      header: () => <AppHeader />,
    }),
    [isDark],
  );

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Haberler",
          tabBarAccessibilityLabel: "Haberler Sekmesi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoriler",
          tabBarAccessibilityLabel: "Favoriler Sekmesi",
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
