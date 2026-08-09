"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { siteTemplates } from "@/lib/site-templates";
import type { SiteTemplateId } from "@/types";

export function CreateProjectForm() {
  const router = useRouter();
  const { t } = useLocale();
  const [description, setDescription] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [templateId, setTemplateId] = useState<SiteTemplateId>("services");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function createProject(event: FormEvent) {
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
      router.push(`/editor/${payload.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar o projeto.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="create-card">
    <p className="eyebrow">NOVO SITE</p>
    <h1>{t.create.title}</h1>
    <p>{t.create.subtitle}</p>
    <form className="site-setup-form" onSubmit={createProject}>
      <label>Nome do negócio<input value={businessName} onChange={(event) => setBusinessName(event.target.value)} minLength={2} maxLength={100} placeholder="Ex.: Barbearia do João" required /></label>
      <fieldset>
        <legend>Escolha um modelo</legend>
        <div className="template-grid">
          {siteTemplates.map((template) => <label className={`template-card ${templateId === template.id ? "selected" : ""}`} key={template.id}>
            <input className="sr-only" type="radio" name="template" value={template.id} checked={templateId === template.id} onChange={() => setTemplateId(template.id)} />
            <span className="template-icon">{template.icon}</span><b>{template.name}</b><small>{template.description}</small>
          </label>)}
        </div>
      </fieldset>
      <label>WhatsApp <small>(opcional)</small><input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} inputMode="tel" maxLength={30} placeholder="Ex.: 55 11 99999-9999" /></label>
      <label>Sobre o negócio<textarea value={description} onChange={(event) => setDescription(event.target.value)} minLength={12} maxLength={2000} placeholder={t.create.placeholder} required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button disabled={busy} className="button button-primary" type="submit">{busy ? t.create.loading : t.create.button}</button>
    </form>
  </section>;
}
