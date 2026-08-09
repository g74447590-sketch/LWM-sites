"use client";

import Link from "next/link";
import { LanguagePicker } from "@/components/language-picker";
import { useLocale } from "@/components/locale-provider";

export function Logo() {
  return <Link href="/" className="logo" aria-label="LWM Sites"><span>LWM</span><strong>SITES</strong></Link>;
}

export function SiteHeader({ app = false }: { app?: boolean }) {
  const { t, locale } = useLocale();
  const plansLabel = locale === "en" ? "Plans" : locale === "es" ? "Planes" : "Planos";
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label="Navegação principal">
        {!app && <><a href="#produto">{t.nav.product}</a><a href="#como-funciona">{t.nav.how}</a><Link href="/planos">{plansLabel}</Link></>}
        {app && <Link href="/dashboard">{t.nav.projects}</Link>}
      </nav>
      <details className="mobile-menu">
        <summary aria-label="Abrir menu"><span aria-hidden="true">☰</span><span className="sr-only">Abrir menu</span></summary>
        <nav aria-label="Navegação móvel">
          {!app && <><a href="#produto">{t.nav.product}</a><a href="#como-funciona">{t.nav.how}</a><Link href="/planos">{plansLabel}</Link></>}
          {app && <Link href="/dashboard">{t.nav.projects}</Link>}
          <Link href="/create">{t.nav.start}</Link>
        </nav>
      </details>
      <div className="header-actions">
        <LanguagePicker />
        <Link className="button button-ghost" href="/login">{t.nav.login}</Link>
        <Link className="button button-primary header-cta" href="/create">{t.nav.start}</Link>
      </div>
    </header>
  );
}
