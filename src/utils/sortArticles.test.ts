import { Article } from "../../type";
import { sortArticles } from "./sortArticles";

const createArticle = (overrides: Partial<Article>): Article => ({
  source: { id: null, name: "Source" },
  author: null,
  title: "Mock Başlık",
  description: null,
  url: "https://mock.com/1",
  urlToImage: null,
  publishedAt: "2024-01-01T00:00:00Z",
  content: null,
  ...overrides,
});

describe("sortArticles", () => {
  const articles: Article[] = [
    createArticle({
      url: "https://mock.com/first",
      publishedAt: "2024-01-02T00:00:00Z",
      source: { id: null, name: "Second New Source" },
    }),
    createArticle({
      url: "https://mock.com/second",
      publishedAt: "2024-01-03T00:00:00Z",
      source: { id: null, name: "First New Source" },
    }),
    createArticle({
      url: "https://mock.com/third",
      publishedAt: "2024-01-01T00:00:00Z",
      source: { id: null, name: "Third New Source" },
    }),
  ];

  it("newest: most recent news first", () => {
    const result = sortArticles(articles, "newest");
    expect(result.map((a) => a.url)).toEqual([
      "https://mock.com/second",
      "https://mock.com/first",
      "https://mock.com/third",
    ]);
  });

  it("oldest: least recent news first", () => {
    const result = sortArticles(articles, "oldest");
    expect(result.map((a) => a.url)).toEqual([
      "https://mock.com/third",
      "https://mock.com/first",
      "https://mock.com/second",
    ]);
  });

  it("source: source names in alphabetical order", () => {
    const result = sortArticles(articles, "source");
    expect(result.map((a) => a.source.name)).toEqual([
      "First New Source",
      "Second New Source",
      "Third New Source",
    ]);
  });

  it("does not mutate the original array", () => {
    const original = [...articles];
    sortArticles(articles, "newest");
    expect(articles).toEqual(original);
  });

  it("returns an empty array when given an empty array", () => {
    expect(sortArticles([], "newest")).toEqual([]);
  });

  it("works without throwing an error when source.name is missing", () => {
    const brokenArticles = [
      createArticle({ url: "1", source: { id: null, name: "" } }),
      createArticle({ url: "2", source: { id: null, name: "Z" } }),
    ];
    expect(() => sortArticles(brokenArticles, "source")).not.toThrow();
  });
});
