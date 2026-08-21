import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/features/auth/auth-context";

export const metadata: Metadata = {
  title: "JavaQuets",
  description: "Learn Java through quests, courses, and exercises.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
