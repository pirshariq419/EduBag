import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syllabus | EduBag",
  description: "Official syllabus for JEE, NEET, and JKBOSE Board exams. Download chapter-wise PDF syllabi.",
};

export default function SyllabusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
