import type { CourseDetail, CourseSummary } from "@javaquets/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function getCourses(): Promise<CourseSummary[]> {
  const response = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Courses request failed: ${response.status}`);
  const data = (await response.json()) as { items: CourseSummary[] };
  return data.items;
}

export async function getCourse(slug: string): Promise<CourseDetail> {
  const response = await fetch(`${API_URL}/courses/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Course request failed: ${response.status}`);
  return response.json() as Promise<CourseDetail>;
}
