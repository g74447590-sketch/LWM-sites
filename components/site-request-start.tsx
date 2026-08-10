"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { minimumSiteRequestLength, pendingSiteRequestStorageKey } from "@/lib/pending-site-request";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/types";

const startCopy: Record<Locale, {
  eyebrow: string; title: string; description: string; label: string; placeholder: string;
  helper: string; suggestionsLabel: string; suggestions: Array<{ label: string; request: string }>;
  submit: string; privacy: string; error: string;
}> = {
  "pt-BR": {
    eyebrow: "COMECE PELA SUA IDEIA",
    title: "Qual site você quer criar hoje?",
    description: "Conte sua ideia com suas palavras. Vamos guardar o pedido para você continuar depois do cadastro.",
    label: "Descreva o site que você imagina",
    placeholder: "Ex.: Quero um site para minha barbearia, com serviços, horários e botão de WhatsApp.",
    helper: "Escreva pelo menos 12 caracteres.",
    suggestionsLabel: "Começar por um exemplo",
    suggestions: [
      { label: "Loja", request: "Quero uma loja para mostrar produtos, preços e formas de contato." },
      { label: "Portfólio", request: "Quero um portfólio para apresentar meus trabalhos e contatos." },
      { label: "Barbearia", request: "Quero um site para minha barbearia, com serviços, horários e botão de WhatsApp." },
      { label: "Restaurante", request: "Quero um site para meu restaurante, com cardápio, horários e pedidos pelo WhatsApp." },
      { label: "Evento", request: "Quero uma página para divulgar um evento, data, local e como participar." },
    ],
    submit: "Começar grátis",
    privacy: "Seu pedido fica apenas neste navegador até você criar o projeto. Não usamos IA paga nesta etapa.",
    error: "Não foi possível guardar seu pedido neste navegador. Tente novamente.",
  },
  en: {
    eyebrow: "START WITH YOUR IDEA",
    title: "What website do you want to create today?",
    description: "Describe your idea in your own words. We will keep it so you can continue after creating an account.",
    label: "Describe the website you have in mind",
    placeholder: "E.g. I want a website for my barbershop with services, opening hours and a WhatsApp button.",
    helper: "Write at least 12 characters.",
    suggestionsLabel: "Start from an example",
    suggestions: [
      { label: "Store", request: "I want a store to show products, prices and ways to get in touch." },
      { label: "Portfolio", request: "I want a portfolio to show my work and contact details." },
      { label: "Barbershop", request: "I want a website for my barbershop with services, opening hours and a WhatsApp button." },
      { label: "Restaurant", request: "I want a website for my restaurant with a menu, opening hours and WhatsApp orders." },
      { label: "Event", request: "I want a page to share an event, its date, location and how to take part." },
    ],
    submit: "Start for free",
    privacy: "Your request stays only in this browser until you create the project. We do not use paid AI at this step.",
    error: "We could not save your request in this browser. Please try again.",
  },
  es: {
    eyebrow: "EMPIEZA CON TU IDEA",
    title: "¿Qué sitio quieres crear hoy?",
    description: "Cuenta tu idea con tus propias palabras. La guardaremos para que continúes después de crear tu cuenta.",
    label: "Describe el sitio que imaginas",
    placeholder: "Ej.: Quiero un sitio para mi barbería, con servicios, horarios y botón de WhatsApp.",
    helper: "Escribe al menos 12 caracteres.",
    suggestionsLabel: "Empieza con un ejemplo",
    suggestions: [
      { label: "Tienda", request: "Quiero una tienda para mostrar productos, precios y formas de contacto." },
      { label: "Portafolio", request: "Quiero un portafolio para presentar mis trabajos y contactos." },
      { label: "Barbería", request: "Quiero un sitio para mi barbería, con servicios, horarios y botón de WhatsApp." },
      { label: "Restaurante", request: "Quiero un sitio para mi restaurante, con menú, horarios y pedidos por WhatsApp." },
      { label: "Evento", request: "Quiero una página para divulgar un evento, fecha, lugar y cómo participar." },
    ],
    submit: "Empezar gratis",
    privacy: "Tu solicitud queda solo en este navegador hasta que crees el proyecto. No usamos IA de pago en este paso.",
    error: "No fue posible guardar tu solicitud en este navegador. Inténtalo de nuevo.",
  },
};

export function SiteRequestStart() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = startCopy[locale];
  const [request, setRequest] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedRequest = request.trim();
    if (normalizedRequest.length < minimumSiteRequestLength) return;
    try {
      window.sessionStorage.setItem(pendingSiteRequestStorageKey, normalizedRequest);
      router.push(`/register?callbackUrl=${encodeURIComponent("/create/project")}`);
    } catch {
      setError(copy.error);
    }
  }

  return <section className="onboarding-card">
    <p className="eyebrow">{copy.eyebrow}</p>
    <h1>{copy.title}</h1>
    <p className="onboarding-description">{copy.description}</p>
    <form className="onboarding-form" onSubmit={submit}>
      <label htmlFor="site-request">{copy.label}</label>
      <textarea id="site-request" value={request} onChange={(event) => { setRequest(event.target.value); setError(null); }} minLength={minimumSiteRequestLength} maxLength={2000} placeholder={copy.placeholder} aria-describedby="site-request-helper" required autoFocus />
      <p id="site-request-helper" className="field-helper">{copy.helper}</p>
      <fieldset className="prompt-suggestions">
        <legend>{copy.suggestionsLabel}</legend>
        <div>{copy.suggestions.map((suggestion) => <button key={suggestion.label} type="button" onClick={() => { setRequest(suggestion.request); setError(null); }}>{suggestion.label}</button>)}</div>
      </fieldset>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit" disabled={request.trim().length < minimumSiteRequestLength}>{copy.submit}</button>
    </form>
    <p className="onboarding-privacy">{copy.privacy}</p>
  </section>;
}
