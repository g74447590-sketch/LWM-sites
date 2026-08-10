"use client";

/* eslint-disable @next/next/no-img-element -- Customer media hosts are dynamic; a wildcard Image optimizer rule would be less safe. */

import type { CSSProperties } from "react";
import type { GeneratedSite, Locale } from "@/types";

const siteNavigation: Record<Locale, { nav: string; home: string; contact: string }> = {
  "pt-BR": { nav: "Navegação do site", home: "Início", contact: "Contato" },
  en: { nav: "Site navigation", home: "Home", contact: "Contact" },
  es: { nav: "Navegación del sitio", home: "Inicio", contact: "Contacto" },
};

export function SitePreview({ site }: { site: GeneratedSite }) {
  const navigation = siteNavigation[site.language] ?? siteNavigation["pt-BR"];
  const opensExternalSite = /^https?:\/\//i.test(site.ctaHref ?? "");
  const visibleSections = site.sections.filter((section) => !section.hidden);

  return <article className="generated-site" data-font={site.fontFamily ?? "serif"} data-hero-style={site.heroStyle ?? "gradient"} data-content-style={site.contentStyle ?? "cards"} data-button-style={site.buttonStyle ?? "rounded"} style={{ "--site-primary": site.primaryColor, "--site-accent": site.accentColor } as CSSProperties}>
    <header><b>{site.businessName}</b><nav aria-label={navigation.nav}><a href="#inicio">{navigation.home}</a>{visibleSections.slice(0, 3).map((section) => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}<a href="#contato">{navigation.contact}</a></nav></header>
    <section className="generated-hero" id="inicio"><p>{site.tagline}</p><h1>{site.heroTitle}</h1><p>{site.heroBody}</p><a className="site-cta" href={site.ctaHref || "#contato"} {...(opensExternalSite ? { target: "_blank", rel: "noreferrer" } : {})}>{site.ctaLabel}</a></section>
    {visibleSections.map((section) => <section className="generated-section" id={section.id} data-layout={section.layout ?? "cards"} key={section.id}><h2>{section.title}</h2><p>{section.body}</p>{section.imageUrl && <img className="generated-section-media" src={section.imageUrl} alt="" />}{section.layout === "faq" ? <div className="generated-faq">{section.items.map((item) => <details key={`${section.id}-${item.title}`}><summary>{item.title}</summary><p>{item.description}</p></details>)}</div> : <div className="generated-items">{section.items.map((item) => <article key={`${section.id}-${item.title}`}><h3>{item.title}</h3><p>{item.description}</p>{item.price && <b>{item.price}</b>}</article>)}</div>}</section>)}
    <footer id="contato">© {new Date().getFullYear()} {site.businessName}</footer>
  </article>;
}
