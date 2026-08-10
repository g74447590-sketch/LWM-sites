"use client";

import { FormEvent, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { inferTemplateFromRequest, pendingSiteRequestStorageKey, readPendingSiteRequest } from "@/lib/pending-site-request";
import { siteTemplates } from "@/lib/site-templates";
import type { Locale, SiteTemplateId } from "@/types";

const formCopy: Record<Locale, {
  eyebrow: string; businessName: string; businessPlaceholder: string; chooseTemplate: string;
  whatsapp: string; optional: string; whatsappPlaceholder: string; about: string;
  templates: Record<SiteTemplateId, { name: string; description: string }>;
  restoredRequest: string; publishEyebrow: string; publishTitle: string; publishDescription: string;
  publishCanTest: string; publishCanTestBody: string; publishNeedsSetup: string; publishNeedsSetupBody: string;
  publishNotIncluded: string; publishNotIncludedBody: string;
}> = {
  "pt-BR": {
    eyebrow: "NOVO SITE", businessName: "Nome do negócio", businessPlaceholder: "Ex.: Barbearia do João", chooseTemplate: "Escolha um modelo", whatsapp: "WhatsApp", optional: "(opcional)", whatsappPlaceholder: "Ex.: 55 11 99999-9999", about: "Sobre o negócio",
    templates: { barbershop: { name: "Barbearia", description: "Serviços, valores e agendamento pelo WhatsApp." }, beauty: { name: "Beleza & estética", description: "Tratamentos, resultados e reservas online." }, restaurant: { name: "Restaurante & café", description: "Cardápio, horário e pedidos pelo WhatsApp." }, services: { name: "Serviços profissionais", description: "Proposta de valor, serviços e contato rápido." } },
    restoredRequest: "Seu pedido foi recuperado. Revise os dados e escolha o modelo antes de criar o site.", publishEyebrow: "ANTES DE PUBLICAR", publishTitle: "O que você já consegue fazer", publishDescription: "Esta lista mostra o estado real do produto, sem prometer uma publicação que ainda não aconteceu.", publishCanTest: "Você pode testar agora", publishCanTestBody: "Criar o projeto, editar os blocos e conferir o preview em computador, tablet e celular.", publishNeedsSetup: "Para publicar online", publishNeedsSetupBody: "Confirme o banco Supabase, execute o schema, configure as variáveis da Vercel e faça uma publicação bem-sucedida. Um domínio próprio é opcional.", publishNotIncluded: "Não está incluído automaticamente", publishNotIncludedBody: "Geração por IA paga, cobrança e envio para App Store exigem integrações e contas próprias.",
  },
  en: {
    eyebrow: "NEW WEBSITE", businessName: "Business name", businessPlaceholder: "E.g. João's Barbershop", chooseTemplate: "Choose a template", whatsapp: "WhatsApp", optional: "(optional)", whatsappPlaceholder: "E.g. 55 11 99999-9999", about: "About the business",
    templates: { barbershop: { name: "Barbershop", description: "Services, prices and WhatsApp bookings." }, beauty: { name: "Beauty & wellness", description: "Treatments, results and online bookings." }, restaurant: { name: "Restaurant & café", description: "Menu, opening hours and WhatsApp orders." }, services: { name: "Professional services", description: "Value proposition, services and fast contact." } },
    restoredRequest: "Your request was restored. Review the details and choose a template before creating the website.", publishEyebrow: "BEFORE PUBLISHING", publishTitle: "What you can already do", publishDescription: "This list shows the real product status without claiming a publication that has not happened.", publishCanTest: "You can test now", publishCanTestBody: "Create the project, edit blocks and review the preview on desktop, tablet and mobile.", publishNeedsSetup: "To publish online", publishNeedsSetupBody: "Confirm the Supabase database, run the schema, configure Vercel variables and complete a successful deployment. A custom domain is optional.", publishNotIncluded: "Not included automatically", publishNotIncludedBody: "Paid AI generation, billing and App Store submission require separate integrations and accounts.",
  },
  es: {
    eyebrow: "NUEVO SITIO", businessName: "Nombre del negocio", businessPlaceholder: "Ej.: Barbería de João", chooseTemplate: "Elige una plantilla", whatsapp: "WhatsApp", optional: "(opcional)", whatsappPlaceholder: "Ej.: 55 11 99999-9999", about: "Sobre el negocio",
    templates: { barbershop: { name: "Barbería", description: "Servicios, precios y reservas por WhatsApp." }, beauty: { name: "Belleza y estética", description: "Tratamientos, resultados y reservas online." }, restaurant: { name: "Restaurante y café", description: "Menú, horario y pedidos por WhatsApp." }, services: { name: "Servicios profesionales", description: "Propuesta de valor, servicios y contacto rápido." } },
    restoredRequest: "Tu solicitud fue recuperada. Revisa los datos y elige una plantilla antes de crear el sitio.", publishEyebrow: "ANTES DE PUBLICAR", publishTitle: "Lo que ya puedes hacer", publishDescription: "Esta lista muestra el estado real del producto sin prometer una publicación que no ocurrió.", publishCanTest: "Puedes probar ahora", publishCanTestBody: "Crear el proyecto, editar bloques y revisar la vista en escritorio, tableta y móvil.", publishNeedsSetup: "Para publicar en línea", publishNeedsSetupBody: "Confirma la base de datos Supabase, ejecuta el schema, configura las variables de Vercel y realiza una publicación exitosa. Un dominio propio es opcional.", publishNotIncluded: "No se incluye automáticamente", publishNotIncludedBody: "La generación de IA de pago, cobros y el envío a App Store requieren integraciones y cuentas independientes.",
  },
};

function subscribeToPendingRequest() {
  return () => {};
}

function getPendingRequestFromBrowser() {
  try {
    return readPendingSiteRequest(window.sessionStorage);
  } catch {
    return null;
  }
}

export function CreateProjectForm() {
  const router = useRouter();
  const { t, locale } = useLocale();
  const copy = formCopy[locale];
  const [typedDescription, setTypedDescription] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<SiteTemplateId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const pendingRequest = useSyncExternalStore(subscribeToPendingRequest, getPendingRequestFromBrowser, () => null);
  const description = typedDescription ?? pendingRequest ?? "";
  const templateId = selectedTemplateId ?? (pendingRequest ? inferTemplateFromRequest(pendingRequest) : "services");

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, businessName, whatsapp, templateId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível criar o projeto.");
      try { window.sessionStorage.removeItem(pendingSiteRequestStorageKey); } catch { /* Keep navigation working if storage is unavailable. */ }
      router.push(`/editor/${payload.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar o projeto.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="create-card">
    <p className="eyebrow">{copy.eyebrow}</p>
    <h1>{t.create.title}</h1>
    <p>{t.create.subtitle}</p>
    {pendingRequest && <p className="restored-request" role="status">{copy.restoredRequest}</p>}
    <form className="site-setup-form" onSubmit={createProject}>
      <label>{copy.businessName}<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} minLength={2} maxLength={100} placeholder={copy.businessPlaceholder} required /></label>
      <fieldset>
        <legend>{copy.chooseTemplate}</legend>
        <div className="template-grid">
          {siteTemplates.map((template) => <label className={`template-card ${templateId === template.id ? "selected" : ""}`} key={template.id}>
            <input className="sr-only" type="radio" name="template" value={template.id} checked={templateId === template.id} onChange={() => setSelectedTemplateId(template.id)} />
            <span className="template-icon">{template.icon}</span><b>{copy.templates[template.id].name}</b><small>{copy.templates[template.id].description}</small>
          </label>)}
        </div>
      </fieldset>
      <label>{copy.whatsapp} <small>{copy.optional}</small><input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} inputMode="tel" maxLength={30} placeholder={copy.whatsappPlaceholder} /></label>
      <label>{copy.about}<textarea value={description} onChange={(event) => setTypedDescription(event.target.value)} minLength={12} maxLength={2000} placeholder={t.create.placeholder} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button disabled={busy} className="button button-primary" type="submit">{busy ? t.create.loading : t.create.button}</button>
    </form>
    <aside className="publish-readiness" aria-labelledby="publish-readiness-title">
      <p className="eyebrow">{copy.publishEyebrow}</p>
      <h2 id="publish-readiness-title">{copy.publishTitle}</h2>
      <p>{copy.publishDescription}</p>
      <div className="publish-readiness-grid">
        <article><b>{copy.publishCanTest}</b><span>{copy.publishCanTestBody}</span></article>
        <article><b>{copy.publishNeedsSetup}</b><span>{copy.publishNeedsSetupBody}</span></article>
        <article><b>{copy.publishNotIncluded}</b><span>{copy.publishNotIncludedBody}</span></article>
      </div>
    </aside>
  </section>;
}
