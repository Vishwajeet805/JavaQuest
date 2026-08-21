import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  DATABASE_URL: z.string().min(1),

  API_PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
  SESSION_IDLE_HOURS: z.coerce.number().int().positive().default(168),
  MAX_SESSIONS_PER_USER: z.coerce.number().int().min(1).max(20).default(5),
  TRUST_PROXY: z.enum(["true", "false"]).default("false").transform((value) => value === "true"),
  REQUEST_BODY_LIMIT: z.string().regex(/^\d+(kb|mb)$/i).default("256kb"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  SUBMISSION_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(6),
  RUNNER_MAX_CONCURRENCY: z.coerce.number().int().min(1).max(32).default(2),
  RUNNER_MAX_QUEUE: z.coerce.number().int().min(0).max(100).default(8),
  RUNNER_MAX_OUTPUT_BYTES: z.coerce.number().int().min(1024).max(1048576).default(16384),
  METRICS_TOKEN: z.preprocess((value) => value === "" ? undefined : value, z.string().min(24).optional()),
  JAVA_RUNNER_IMAGE: z.string().min(1).default("javaquets-java-runner:local"),
  RUNNER_SERVICE_URL: z.preprocess((value) => value === "" ? undefined : value, z.string().url().optional()),
  RUNNER_SERVICE_TOKEN: z.preprocess((value) => value === "" ? undefined : value, z.string().min(32).optional()),
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === "production" && !value.METRICS_TOKEN) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["METRICS_TOKEN"], message: "Required in production" });
  if (value.NODE_ENV === "production" && value.WEB_ORIGIN.startsWith("http://")) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["WEB_ORIGIN"], message: "HTTPS is required in production" });
  if (value.NODE_ENV === "production" && !value.RUNNER_SERVICE_URL) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["RUNNER_SERVICE_URL"], message: "Dedicated runner service is required in production" });
  if (value.NODE_ENV === "production" && !value.RUNNER_SERVICE_TOKEN) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["RUNNER_SERVICE_TOKEN"], message: "Runner service token is required in production" });
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Invalid environment configuration", Object.keys(parsed.error.flatten().fieldErrors));
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = loadEnv();
