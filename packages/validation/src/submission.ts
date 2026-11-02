import { z } from "zod";

const pythonSourceFileSchema = z.object({
  path: z.string().min(1).max(120).regex(/^[a-zA-Z0-9_./-]+\.py$/),
  content: z.string().min(1).max(50_000),
}).strict();

export const codeSubmissionSchema = z.object({
  sourceCode: z.string().min(1, "sourceCode is required").max(50_000, "sourceCode is too large"),
  files: z.array(pythonSourceFileSchema).max(19).optional(),
}).strict().superRefine((value, context) => {
  if (!value.files?.length) return;
  const paths = new Set(["main.py"]);
  let totalCharacters = value.sourceCode.length;
  for (const file of value.files) {
    if (file.path === "main.py" || file.path.startsWith("/") || file.path.split("/").some((part) => part === "." || part === ".." || !part)) {
      context.addIssue({ code: "custom", path: ["files"], message: "Python file paths must be unique, relative .py paths without traversal segments" });
    }
    if (paths.has(file.path)) context.addIssue({ code: "custom", path: ["files"], message: "Python file paths must be unique" });
    paths.add(file.path);
    totalCharacters += file.content.length;
  }
  if (totalCharacters > 100_000) context.addIssue({ code: "custom", path: ["files"], message: "Python submission exceeds 100,000 characters" });
});
