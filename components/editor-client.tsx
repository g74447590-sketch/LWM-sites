"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { SitePreview } from "@/components/site-preview";
import type { GeneratedSite, Project } from "@/types";

type Device = "desktop" | "tablet" | "mobile";
type TextField = "businessName" | "tagline" | "heroTitle" | "heroBody" | "ctaLabel" | "ctaHref" | "primaryColor" | "accentColor";

export function EditorClient({ project }: { project: Project }) {
  const { t } = useLocale();
  const [site, setSite] = useState<GeneratedSite | null>(project.generatedSite);
  const [device, setDevice] = useState<Device>("desktop");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  function updateSite(field: TextField, value: string) {
    setSite((current) => current ? { ...current, [field]: value } : current);
    setSaved(false);
  }
  function updateSection(sectionIndex: number, field: "title" | "body", value: string) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, [field]: value } : section) } : current);
    setSaved(false);
  }
  function updateItem(sectionIndex: number, itemIndex: number, field: "title" | "description" | "price", value: string) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.map((item, itemPosition) => itemPosition === itemIndex ? { ...item, [field]: value } : item) } : section) } : current);
    setSaved(false);
  }
  function addItem(sectionIndex: number) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex && section.items.length < 6 ? { ...section, items: [...section.items, { title: "Novo item", description: "Descreva este item." }] } : section) } : current);
    setSaved(false);
  }
  async function saveSite() {
    if (!site) return;
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ site }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível salvar o site.");
      setSite(payload.generatedSite);
      setSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o site.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="editor-layout">
    <aside className="editor-chat">
      <div><p className="eyebrow">EDITOR DE SITE</p><h1>{project.name}</h1><p className="muted">Edite o conteúdo e veja a alteração no preview.</p></div>
      {site ? <div className="editor-fields">
        <label>Nome<input value={site.businessName} maxLength={80} onChange={(event) => updateSite("businessName", event.target.value)} /></label>
        <label>Frase de apoio<input value={site.tagline} maxLength={120} onChange={(event) => updateSite("tagline", event.target.value)} /></label>
        <label>Título principal<textarea value={site.heroTitle} maxLength={120} onChange={(event) => updateSite("heroTitle", event.target.value)} /></label>
        <label>Texto principal<textarea value={site.heroBody} maxLength={320} onChange={(event) => updateSite("heroBody", event.target.value)} /></label>
        <label>Texto do botão<input value={site.ctaLabel} maxLength={40} onChange={(event) => updateSite("ctaLabel", event.target.value)} /></label>
        <label>Link do botão<input value={site.ctaHref || "#contato"} maxLength={500} onChange={(event) => updateSite("ctaHref", event.target.value)} placeholder="https://wa.me/5511999999999" /></label>
        <div className="color-fields"><label>Cor principal<input type="color" value={site.primaryColor} onChange={(event) => updateSite("primaryColor", event.target.value)} /></label><label>Cor de destaque<input type="color" value={site.accentColor} onChange={(event) => updateSite("accentColor", event.target.value)} /></label></div>
        {site.sections.map((section, sectionIndex) => <fieldset className="section-editor" key={section.id}>
          <legend>Seção {sectionIndex + 1}</legend>
          <label>Título<input value={section.title} maxLength={80} onChange={(event) => updateSection(sectionIndex, "title", event.target.value)} /></label>
          <label>Descrição<textarea value={section.body} maxLength={240} onChange={(event) => updateSection(sectionIndex, "body", event.target.value)} /></label>
          {section.items.map((item, itemIndex) => <div className="item-editor" key={`${section.id}-${itemIndex}`}>
            <label>Item<input value={item.title} maxLength={80} onChange={(event) => updateItem(sectionIndex, itemIndex, "title", event.target.value)} /></label>
            <label>Descrição<input value={item.description} maxLength={200} onChange={(event) => updateItem(sectionIndex, itemIndex, "description", event.target.value)} /></label>
            <label>Preço <small>(opcional)</small><input value={item.price || ""} maxLength={40} onChange={(event) => updateItem(sectionIndex, itemIndex, "price", event.target.value)} /></label>
          </div>)}
          <button type="button" className="text-button" disabled={section.items.length >= 6} onClick={() => addItem(sectionIndex)}>+ Adicionar item</button>
        </fieldset>)}
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Alterações salvas.</p>}
        <button className="button button-primary" disabled={busy} onClick={() => void saveSite()}>{busy ? "Salvando..." : "Salvar alterações"}</button>
      </div> : <div className="editor-empty"><p>Este projeto antigo não tem modelo. Crie um novo site usando um dos modelos disponíveis.</p></div>}
    </aside>
    <section className="editor-preview">
      <div className="preview-toolbar"><div><b>{t.editor.preview}</b><small>{saved ? "Salvo no Supabase" : "Alterações ainda não salvas"}</small></div><div className="device-switch" role="group" aria-label="Tamanho do preview">{(["desktop", "tablet", "mobile"] as Device[]).map((item) => <button type="button" onClick={() => setDevice(item)} className={device === item ? "active" : ""} key={item}>{t.editor[item]}</button>)}</div></div>
      {site ? <div className={`preview-frame ${device}`}><SitePreview site={site} /></div> : <div className="preview-empty"><p>Crie um novo projeto para começar.</p></div>}
    </section>
  </main>;
}
