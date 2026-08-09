"use client";

import type { CSSProperties } from "react";
import type { GeneratedSite } from "@/types";

export function SitePreview({ site }: { site: GeneratedSite }) {
  return <article className="generated-site" style={{ "--site-primary": site.primaryColor, "--site-accent": site.accentColor } as CSSProperties}>
    <header><b>{site.businessName}</b><span>Início &nbsp; Sobre &nbsp; Contato</span></header>
    <section className="generated-hero"><p>{site.tagline}</p><h1>{site.heroTitle}</h1><p>{site.heroBody}</p><a className="site-cta" href={site.ctaHref || "#contato"}>{site.ctaLabel}</a></section>
    {site.sections.map((section) => <section className="generated-section" key={section.id}><h2>{section.title}</h2><p>{section.body}</p><div className="generated-items">{section.items.map((item) => <article key={`${section.id}-${item.title}`}><h3>{item.title}</h3><p>{item.description}</p>{item.price && <b>{item.price}</b>}</article>)}</div></section>)}
    <footer id="contato">© {new Date().getFullYear()} {site.businessName}</footer>
  </article>;
}
