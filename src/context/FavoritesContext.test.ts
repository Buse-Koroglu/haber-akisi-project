import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { Article } from "../../type";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const createArticle = (overrides: Partial<Article> = {}): Article => ({
  source: { id: null, name: "Source" },
  author: null,
  title: "Mock Title",
  description: null,
  url: "https://mock.com/1",
  urlToImage: null,
  publishedAt: "2024-01-01T00:00:00Z",
  content: null,
  ...overrides,
});

describe("FavoritesContext", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("at the beginning, favorites is an empty array", async () => {
    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    expect(result.current.favorites).toEqual([]);
  });

  it("toggles a article as favorite +", async () => {
    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    const article = createArticle();

    await act(async () => {
      result.current.toggleFavorite(article);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].url).toBe(article.url);
  });

  it("toggles a article as favorite -", async () => {
    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    const article = createArticle();

    await act(async () => {
      result.current.toggleFavorite(article);
    });
    expect(result.current.favorites).toHaveLength(1);

    await act(async () => {
      result.current.toggleFavorite(article);
    });
    expect(result.current.favorites).toHaveLength(0);
  });

  it("isFavorite returns true for favorited articles and false for non-favorited articles", async () => {
    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    const article = createArticle({ url: "https://mock.com/fav" });

    await act(async () => {
      result.current.toggleFavorite(article);
    });

    expect(result.current.isFavorite("https://mock.com/fav")).toBe(true);
    expect(result.current.isFavorite("https://mock.com/other")).toBe(false);
  });

  it("saves favorites to AsyncStorage", async () => {
    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    const article = createArticle();

    await act(async () => {
      result.current.toggleFavorite(article);
    });

    const stored = await AsyncStorage.getItem("@my_favorites");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored as string)).toHaveLength(1);
  });

  it("when the app mounts, it loads existing favorites from AsyncStorage", async () => {
    const article = createArticle({ url: "https://mock.com/preloaded" });
    await AsyncStorage.setItem("@my_favorites", JSON.stringify([article]));

    const { result } = await renderHook(() => useFavorites(), {
      wrapper: FavoritesProvider,
    });

    await waitFor(() => {
      expect(result.current.favorites).toHaveLength(1);
    });

    expect(result.current.favorites[0].url).toBe("https://mock.com/preloaded");
  });

  it("throws an error when used outside of FavoritesProvider", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await expect(renderHook(() => useFavorites())).rejects.toThrow(
      "useFavorites mutlaka FavoritesProvider içinde kullanılmalıdır.",
    );

    consoleError.mockRestore();
  });
});
