import { getTopHeadlines } from "@/api/newsApi";
import { NewsApiError } from "@/api/errors";

const validArticle = {
  source: { id: "bbc-news", name: "BBC News" },
  author: "Nevsin Mengu",
  title: "Mock Title",
  description: "Mock Description",
  url: "https://mock.com/article",
  urlToImage: "https://mock.com/image.jpg",
  publishedAt: "2024-01-01T10:00:00Z",
  content: "Mock Content",
};

describe("getTopHeadlines", () => {
  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns the correct articles and totalResults on successful response", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        articles: [validArticle],
        totalResults: 1,
      }),
    });

    const result = await getTopHeadlines({ q: "test" });

    expect(result.totalResults).toBe(1);
    expect(result.articles).toHaveLength(1);
    expect(result.articles[0].title).toBe("Mock Title");
  });

  it("includes the correct query parameters in the URL", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [], totalResults: 0 }),
    });

    await getTopHeadlines({
      q: "ekonomi",
      category: "business",
      page: 2,
      pageSize: 20,
    });

    const calledUrl = (globalThis.fetch as jest.Mock).mock
      .calls[0][0] as string;

    expect(calledUrl).toContain("q=ekonomi");
    expect(calledUrl).toContain("category=business");
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("pageSize=20");
  });

  it("when category is not provided, it is not included in the URL", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [], totalResults: 0 }),
    });

    await getTopHeadlines({});

    const calledUrl = (globalThis.fetch as jest.Mock).mock
      .calls[0][0] as string;
    expect(calledUrl).not.toContain("category=");
  });

  it("response is unsuccessful with a custom error message", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ message: "rate limit exceeded", status: 429 }),
    });

    await expect(getTopHeadlines({})).rejects.toThrow(
      new NewsApiError("rate limit exceeded", 429),
    );
  });

  it("response is unsuccessful and the error body cannot be parsed, use the HTTP status message", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error("invalid json");
      },
    });

    await expect(getTopHeadlines({})).rejects.toThrow("HTTP 500");
  });

  it("fails when the API returns an unexpected response format", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpected: "shape" }),
    });

    await expect(getTopHeadlines({})).rejects.toThrow(
      "Unexpected API response format.",
    );
  });
});
