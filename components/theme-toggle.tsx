"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useLocale } from "@/components/locale-provider";

type Theme = "dark" | "light";
const storageKey = "lwm-theme";
const changeEvent = "lwm-theme-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(changeEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(changeEvent, onStoreChange);
  };
}

function getThemeFromBrowser(): Theme {
  try {
    return window.localStorage.getItem(storageKey) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function ThemeToggle() {
  const { locale } = useLocale();
  const theme = useSyncExternalStore(subscribe, getThemeFromBrowser, () => "dark");
  const isDark = theme === "dark";
  const copy = locale === "es"
    ? { label: isDark ? "Activar modo claro" : "Activar modo oscuro", icon: isDark ? "☀" : "◐" }
    : locale === "en"
      ? { label: isDark ? "Switch to light mode" : "Switch to dark mode", icon: isDark ? "☀" : "◐" }
      : { label: isDark ? "Ativar modo claro" : "Ativar modo escuro", icon: isDark ? "☀" : "◐" };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = isDark ? "light" : "dark";
    try { window.localStorage.setItem(storageKey, nextTheme); } catch { /* Keep the temporary preference if storage is blocked. */ }
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event(changeEvent));
  }

  return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={copy.label} title={copy.label}>
    <span aria-hidden="true">{copy.icon}</span><span className="sr-only">{copy.label}</span>
  </button>;
}
