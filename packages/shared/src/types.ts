export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

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
