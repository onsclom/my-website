import { z, defineCollection } from "astro:content";

const writingCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
  }),
});

export const collections = {
  writing: writingCollection,
};
