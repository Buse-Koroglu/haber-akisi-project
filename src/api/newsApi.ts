const BASE_URL = process.env.EXPO_PUBLIC_NEWS_API_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY;

export interface newsSearchParams {
  keyword: string;
  page?: number;
  language?: string;
  sortBy?: "relevance" | "date" | "publishedAt";
}

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

export async function searchNews({
  keyword,
  language = "tr",
  page = 1,
  sortBy = "publishedAt",
}: newsSearchParams): Promise<Article[]> {
  const params = new URLSearchParams({
    q: keyword,
    language,
    page: page.toString(),
    pageSize: "10",
    sortBy,
    apiKey: API_KEY || "",
  });

  const response = await fetch(`${BASE_URL}/everything?${params.toString()}`);

  if (!response.ok) {
    const errorBody = await response.text();
    console.log("STATUS:", response.status);
    console.log("BODY:", errorBody);
    throw new Error(`Failed to fetch news articles: ${errorBody}`);
  }

  const data = await response.json();
  // console.log("RAW API RESPONSE:", JSON.stringify(data, null, 2));
  return data.articles ?? [];
}

export async function getTopHeadlines({
  country = "tr",
  category,
  page = 1,
}: topHeadlinesParams = {}): Promise<Article[]> {
  const params = new URLSearchParams({
    country,
    page: page.toString(),
    pageSize: "50",
    apiKey: API_KEY || "",
  });
  if (category) params.set("category", category);

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
  return data.articles ?? [];
}
