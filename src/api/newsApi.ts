import { Article, topHeadlinesParams } from "../../type";

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
    const errorBody = await response.text();
    throw new Error(`Failed to fetch top headlines: ${errorBody}`);
  }

  const data = await response.json();
  return {
    articles: data.articles ?? [],
    totalResults: data.totalResults ?? 0,
  };
}
