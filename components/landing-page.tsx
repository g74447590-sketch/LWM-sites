"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export function LandingPage() {
  const { t } = useLocale();
  return <>
    <SiteHeader />
    <main>
      <section className="hero" id="produto">
        <div className="hero-copy"><p className="eyebrow">{t.hero.eyebrow}</p><h1>{t.hero.title}</h1><p className="hero-body">{t.hero.body}</p><div className="hero-actions"><Link href="/create" className="button button-primary">{t.hero.primary}</Link><a href="#como-funciona" className="button button-ghost">{t.hero.secondary}</a></div></div>
        <div className="product-demo" aria-label="Demonstração de um site criado com LWM Sites"><div className="demo-top"><span></span><span></span><span></span><em>lwm-sites.preview</em></div><div className="demo-page"><div className="demo-nav">NOVA <small>Home &nbsp; Serviços &nbsp; Contato</small></div><div className="demo-hero"><p>ESTÚDIO CRIATIVO</p><h2>Ideias que ganham forma.</h2><button>Conheça nosso trabalho</button></div><div className="demo-cards"><i></i><i></i><i></i></div></div></div>
      </section>
      <section className="benefits" aria-label="Benefícios">{t.benefits.map((benefit) => <article key={benefit}><span>✦</span>{benefit}</article>)}</section>
      <section className="pricing-teaser" aria-labelledby="pricing-teaser-title"><div><p className="eyebrow">BETA GRATUITA</p><h2 id="pricing-teaser-title">Crie e publique sites sem cobrança durante a beta.</h2><p>Use o editor visual, imagens, WhatsApp, SEO e preview responsivo. Sem IA paga, cartão ou assinatura.</p></div><Link href="/planos" className="button button-ghost">Entender a beta</Link></section>
      <section className="how" id="como-funciona"><p className="eyebrow">LWM FLOW</p><h2>{t.howTitle}</h2><div className="steps">{t.steps.map((step, index) => <article key={step}><b>0{index + 1}</b><p>{step}</p></article>)}</div></section>
      <section className="closing"><p className="eyebrow">PRONTO PARA COMEÇAR?</p><h2>{t.hero.title}</h2><Link href="/create" className="button button-primary">{t.nav.start}</Link></section>
    </main>
    <footer>{t.footer}</footer>
  </>;
}
