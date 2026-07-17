import { TopHeadlinesSchema } from "@/api/schemas";

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

describe("TopHeadlinesSchema", () => {
  it("correctly parses a valid response", () => {
    const result = TopHeadlinesSchema.safeParse({
      articles: [validArticle],
      totalResults: 1,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.articles).toHaveLength(1);
      expect(result.data.totalResults).toBe(1);
    }
  });

  it("accepts nullable fields when they are null", () => {
    const result = TopHeadlinesSchema.safeParse({
      articles: [
        {
          ...validArticle,
          author: null,
          description: null,
          urlToImage: null,
          content: null,
        },
      ],
      totalResults: 1,
    });

    expect(result.success).toBe(true);
  });

  it("accepts an empty articles array", () => {
    const result = TopHeadlinesSchema.safeParse({
      articles: [],
      totalResults: 0,
    });

    expect(result.success).toBe(true);
  });

  it("fails when a required field is missing", () => {
    const { title, ...articleWithoutTitle } = validArticle;

    const result = TopHeadlinesSchema.safeParse({
      articles: [articleWithoutTitle],
      totalResults: 1,
    });

    expect(result.success).toBe(false);
  });

  it("fails when totalResults is of the wrong type", () => {
    const result = TopHeadlinesSchema.safeParse({
      articles: [validArticle],
      totalResults: "1",
    });

    expect(result.success).toBe(false);
  });

  it("fails when a non-nullable field is null (title)", () => {
    const result = TopHeadlinesSchema.safeParse({
      articles: [{ ...validArticle, title: null }],
      totalResults: 1,
    });

    expect(result.success).toBe(false);
  });
});
