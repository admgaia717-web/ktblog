import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string(),
    eyecatch: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

export const collections = { posts };
