import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Previous Year Questions | EduBag",
  description: "Download and practice previous year question papers for JEE, NEET, and JKBOSE Board exams.",
};

export default function PYQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
