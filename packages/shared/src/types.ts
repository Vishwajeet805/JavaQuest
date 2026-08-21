export type ApiError = {
  error: {
    code: string;
    message: string;
    details: unknown;
  };
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type HealthResponse = {
  status: "ok" | "degraded";
  service: "javaquets-api";
  database: "connected" | "disconnected";
};
