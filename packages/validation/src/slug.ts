import { z } from "zod";

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug");

export const slugParamsSchema = z.object({
  slug: slugSchema,
});
