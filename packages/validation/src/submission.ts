import { z } from "zod";

export const codeSubmissionSchema = z.object({
  sourceCode: z.string().min(1, "sourceCode is required").max(50_000, "sourceCode is too large"),
});
