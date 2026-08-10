"use client";

import Link from "next/link";
import { LanguagePicker } from "@/components/language-picker";
import { useLocale } from "@/components/locale-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export function Logo() {
  return <Link href="/" className="logo" aria-label="LWM Sites"><span>LWM</span><strong>SITES</strong></Link>;
}
export function SiteHeader({ app = false }: { app?: boolean }) {
  const { t, locale } = useLocale();
  const copy = locale === "en"
    ? { beta: "Free beta", navigation: "Main navigation", mobileNavigation: "Mobile navigation", openMenu: "Open menu" }
    : locale === "es"
      ? { beta: "Beta gratuita", navigation: "Navegación principal", mobileNavigation: "Navegación móvil", openMenu: "Abrir menú" }
      : { beta: "Beta grátis", navigation: "Navegação principal", mobileNavigation: "Navegação móvel", openMenu: "Abrir menu" };
  return (
    <header className="site-header">
      <Logo />
      <nav aria-label={copy.navigation}>
        {!app && <><a href="#produto">{t.nav.product}</a><a href="#como-funciona">{t.nav.how}</a><Link href="/planos">{copy.beta}</Link></>}
        {app && <Link href="/dashboard">{t.nav.projects}</Link>}
      </nav>
      <details className="mobile-menu">
        <summary aria-label={copy.openMenu}><span aria-hidden="true">☰</span><span className="sr-only">{copy.openMenu}</span></summary>
        <nav aria-label={copy.mobileNavigation}>
          {!app && <><a href="#produto">{t.nav.product}</a><a href="#como-funciona">{t.nav.how}</a><Link href="/planos">{copy.beta}</Link></>}
          {app && <Link href="/dashboard">{t.nav.projects}</Link>}
          <Link href="/create">{t.nav.start}</Link>
        </nav>
      </details>
      <div className="header-actions">
        <ThemeToggle />
        <LanguagePicker />
        <Link className="button button-ghost" href="/login">{t.nav.login}</Link>
        <Link className="button button-primary header-cta" href="/create">{t.nav.start}</Link>
      </div>
    </header>
  );
}
