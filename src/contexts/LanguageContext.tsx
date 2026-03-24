"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "ar";

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  defaultLang = "en",
}: {
  children: React.ReactNode;
  defaultLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  useEffect(() => {
    const saved = window.localStorage.getItem("app-lang") as Lang | null;
    if (saved === "en" || saved === "ar") {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("app-lang", lang);
  }, [lang]);

  const setLang = (value: Lang) => {
    setLangState(value);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === "en" ? "ar" : "en"));
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      isRTL: lang === "ar",
      t: (en: string, ar: string) => (lang === "ar" ? ar : en),
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}