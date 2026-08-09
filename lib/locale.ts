import type { Locale } from "@/types";

export function detectLocale(value?: string | null): Locale {
  const language = value?.toLowerCase() ?? "";
  if (language.startsWith("pt")) return "pt-BR";
  if (language.startsWith("es")) return "es";
  return "en";
}

export function detectPromptLocale(prompt: string): Locale {
  const normalized = prompt.toLocaleLowerCase();
  if (/\b(quero|crie|site|uma|p[áa]gina|barbearia|academia|pizzaria|neg[óo]cio)\b/.test(normalized)) return "pt-BR";
  if (/\b(crea|sitio|una|barber[ií]a|tienda|quiero|p[aá]gina|negocio)\b/.test(normalized)) return "es";
  return "en";
}
