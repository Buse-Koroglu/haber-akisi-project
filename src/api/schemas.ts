import { z } from "zod";

const ArticleSchema = z.object({
  source: z.object({
    id: z.string().nullable(),
    name: z.string(),
  }),
  author: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  publishedAt: z.string(),
  content: z.string().nullable(),
});

export const TopHeadlinesSchema = z.object({
  articles: z.array(ArticleSchema),
  totalResults: z.number(),
});

export type Article = z.infer<typeof ArticleSchema>;
