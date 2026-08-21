export type SubmissionStatus = "PENDING" | "PASSED" | "FAILED" | "ERROR";

export type SubmissionTestResultDto = {
  position: number;
  hidden: boolean;
  passed: boolean;
  stdout: string | null;
};

export type SubmissionResultDto = {
  id: string;
  questSlug: string;
  exerciseSlug: string;
  status: SubmissionStatus;
  score: number;
  runtimeMs: number | null;
  errorText: string | null;
  tests: SubmissionTestResultDto[];
  createdAt: string;
};
