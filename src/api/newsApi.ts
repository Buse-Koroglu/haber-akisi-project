const BASE_URL = process.env.EXPO_PUBLIC_NEWS_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;

export interface topHeadlinesParams {
  country?: string;
  category?:
    | "business"
    | "entertainment"
    | "general"
    | "health"
    | "science"
    | "sports"
    | "technology";
  page?: number;
  pageSize?: number;
  q?: string;
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function getTopHeadlines({
  q: q,
  country = "tr",
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
    apiKey: API_KEY || "",
  });
  if (category) params.set("category", category);
  if (q) params.set("q", q);

  const response = await fetch(
    `${BASE_URL}/top-headlines?${params.toString()}`,
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.log("STATUS:", response.status);
    console.log("BODY:", errorBody);
    throw new Error(`Failed to fetch top headlines: ${errorBody}`);
  }

  const data = await response.json();
  return {
    articles: data.articles ?? [],
    totalResults: data.totalResults ?? 0,
  };
}
