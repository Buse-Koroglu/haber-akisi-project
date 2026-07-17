export const config = { runtime: "edge" };

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);

  const params = new URLSearchParams(searchParams);
  params.set("apiKey", process.env.NEWS_API_KEY || "");

  const newsRes = await fetch(
    `https://newsapi.org/v2/top-headlines?${params.toString()}`,
  );

  const data = await newsRes.json();

  return new Response(JSON.stringify(data), {
    status: newsRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
