import "@/../global.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SortProvider } from "@/context/SortContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { APP_THEME } from "@/constants/theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    AsyncStorage.getItem(APP_THEME).then((stored) => {
      if (stored === "light" || stored === "dark" || stored === "system") {
        setColorScheme(stored);
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <SortProvider>
          <Slot />
        </SortProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
