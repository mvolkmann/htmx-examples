import { defineCollection, z } from "astro:content";

// The schema is defined using Zod.
const dogs = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    breed: z.string(),
    website: z.string(),
  }),
});

export const collections = { dogs };
