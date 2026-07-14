import "@/../global.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <Slot />
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
