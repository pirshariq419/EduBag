import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn | EduBag",
  description: "Explore chapter-wise study material, video resources, and curated courses for JEE, NEET and Board exams.",
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
