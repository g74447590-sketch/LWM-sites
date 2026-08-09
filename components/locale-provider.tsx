"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { detectLocale } from "@/lib/locale";
import { messages, type Messages } from "@/translations";
import type { Locale } from "@/types";

type LocaleContextValue = { locale: Locale; setLocale: (locale: Locale) => void; t: Messages };
const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");
  useEffect(() => {
    const stored = window.localStorage.getItem("lwm-locale") as Locale | null;
    queueMicrotask(() => setLocaleState(stored && ["pt-BR", "en", "es"].includes(stored) ? stored : detectLocale(navigator.language)));
  }, []);
  const value = useMemo(() => ({
    locale,
    setLocale: (next: Locale) => { window.localStorage.setItem("lwm-locale", next); setLocaleState(next); },
    t: messages[locale],
  }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale deve ser usado dentro de LocaleProvider");
  return context;
}
