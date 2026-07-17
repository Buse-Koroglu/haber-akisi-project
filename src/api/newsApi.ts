import { Article, topHeadlinesParams } from "../../type";
import { NewsApiError } from "./errors";
import { TopHeadlinesSchema } from "./schemas";

if (!process.env.EXPO_PUBLIC_NEWS_API_BASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_NEWS_API_BASE_URL environment variable is not defined",
  );
}

const BASE_URL = process.env.EXPO_PUBLIC_NEWS_API_BASE_URL;

export async function getTopHeadlines({
  q: keyword,
  country = "us",
  category,
  page = 1,
  pageSize = 10,
}: topHeadlinesParams = {}): Promise<{
  articles: Article[];
  totalResults: number;
}> {
  const params = new URLSearchParams({
    country,
    page: page.toString(),
    pageSize: pageSize.toString(),
  });
  if (category) params.set("category", category);
  if (keyword) params.set("q", keyword);

  const response = await fetch(
    `${BASE_URL}/top-headlines?${params.toString()}`,
  );

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message ?? message;
    } catch {}
    throw new NewsApiError(message, response.status);
  }

  const data = await response.json();

  const parsed = TopHeadlinesSchema.safeParse(data);
  if (!parsed.success) {
    throw new NewsApiError("Unexpected API response format.", 500);
  }

  return {
    articles: parsed.data.articles,
    totalResults: parsed.data.totalResults,
  };
}
