import "@/../global.css";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { SortProvider } from "@/context/SortContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
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
