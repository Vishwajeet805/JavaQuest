import { z } from "zod";
import { slugSchema } from "./slug.js";

export const questExerciseParamsSchema = z.object({
  questSlug: slugSchema,
  exerciseSlug: slugSchema,
});
