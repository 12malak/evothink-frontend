"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/src/components/layout/Sidebar";
import Header from "@/src/components/layout/Header";
import { useLanguage } from "@/src/contexts/LanguageContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRTL } = useLanguage();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("evothink_user");
      if (raw) {
        setAuthed(true);
      } else {
        router.replace("/auth/login");
      }
    } catch {
      router.replace("/auth/login");
    } finally {
      setChecked(true);
    }
  }, [router]);

  // Don't flash content before the check completes
  if (!checked || !authed) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}