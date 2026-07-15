import { Article } from "@/api/newsApi";
import { SortOption } from "@/context/SortContext";

export const sortArticles = (
  articles: Article[],
  sortOption: SortOption,
): Article[] => {
  const sorted = [...articles];

  switch (sortOption) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
      );
    case "source":
      return sorted.sort((a, b) =>
        (a.source?.name ?? "").localeCompare(b.source?.name ?? ""),
      );
    default:
      return sorted;
  }
};
