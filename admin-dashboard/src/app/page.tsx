"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("edubag_admin_token");
    if (token) router.replace("/dashboard");
    else router.replace("/login");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
