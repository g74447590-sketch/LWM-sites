"use client";

import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/types";

const labels: Record<Locale, string> = { "pt-BR": "Português", en: "English", es: "Español" };

export function LanguagePicker() {
  const { locale, setLocale } = useLocale();
  return (
    <label className="language-picker">
      <span className="sr-only">Idioma</span>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Idioma">
        {(Object.keys(labels) as Locale[]).map((key) => <option key={key} value={key}>🌐 {labels[key]}</option>)}
      </select>
    </label>
  );
}
