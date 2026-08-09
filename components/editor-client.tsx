"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { SitePreview } from "@/components/site-preview";
import type { ButtonStyle, ContentStyle, GeneratedSite, HeroStyle, Project, SiteFont } from "@/types";

type Device = "desktop" | "tablet" | "mobile";
type EditorPanel = "content" | "design";
type TextField = "businessName" | "tagline" | "heroTitle" | "heroBody" | "ctaLabel" | "ctaHref" | "primaryColor" | "accentColor";
type DesignField = "fontFamily" | "heroStyle" | "contentStyle" | "buttonStyle";

const colorPresets = [
  { name: "Violeta", primary: "#4B2A7C", accent: "#E957B5" },
  { name: "Oceano", primary: "#12395B", accent: "#2BA9BF" },
  { name: "Floresta", primary: "#1F4A3C", accent: "#D7A643" },
  { name: "Terracota", primary: "#73382E", accent: "#E48754" },
] as const;

function createSectionId(site: GeneratedSite) {
  const base = `section-${Date.now().toString(36)}`;
  return site.sections.some((section) => section.id === base) ? `${base}-${site.sections.length + 1}` : base;
}

export function EditorClient({ project }: { project: Project }) {
  const { t } = useLocale();
  const [site, setSite] = useState<GeneratedSite | null>(project.generatedSite);
  const [device, setDevice] = useState<Device>("desktop");
  const [panel, setPanel] = useState<EditorPanel>("content");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  function markChanged() {
    setSaved(false);
    setError(null);
  }

  function updateSite(field: TextField, value: string) {
    setSite((current) => current ? { ...current, [field]: value } : current);
    markChanged();
  }

  function updateDesign(field: DesignField, value: SiteFont | HeroStyle | ContentStyle | ButtonStyle) {
    setSite((current) => current ? { ...current, [field]: value } as GeneratedSite : current);
    markChanged();
  }

  function updateSection(sectionIndex: number, field: "title" | "body", value: string) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, [field]: value } : section) } : current);
    markChanged();
  }

  function updateItem(sectionIndex: number, itemIndex: number, field: "title" | "description" | "price", value: string) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.map((item, itemPosition) => itemPosition === itemIndex ? { ...item, [field]: value } : item) } : section) } : current);
    markChanged();
  }

  function addItem(sectionIndex: number) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex && section.items.length < 6 ? { ...section, items: [...section.items, { title: "Novo item", description: "Descreva este item." }] } : section) } : current);
    markChanged();
  }

  function moveItem(sectionIndex: number, itemIndex: number, direction: -1 | 1) {
    setSite((current) => {
      if (!current) return current;
      return { ...current, sections: current.sections.map((section, index) => {
        if (index !== sectionIndex) return section;
        const destination = itemIndex + direction;
        if (destination < 0 || destination >= section.items.length) return section;
        const items = [...section.items];
        [items[itemIndex], items[destination]] = [items[destination], items[itemIndex]];
        return { ...section, items };
      }) };
    });
    markChanged();
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    setSite((current) => current ? { ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.filter((_, position) => position !== itemIndex) } : section) } : current);
    markChanged();
  }

  function moveSection(sectionIndex: number, direction: -1 | 1) {
    setSite((current) => {
      if (!current) return current;
      const destination = sectionIndex + direction;
      if (destination < 0 || destination >= current.sections.length) return current;
      const sections = [...current.sections];
      [sections[sectionIndex], sections[destination]] = [sections[destination], sections[sectionIndex]];
      return { ...current, sections };
    });
    markChanged();
  }

  function addSection() {
    setSite((current) => current && current.sections.length < 8 ? { ...current, sections: [...current.sections, { id: createSectionId(current), title: "Nova seção", body: "Apresente este novo bloco do seu site.", items: [{ title: "Novo item", description: "Descreva este item." }] }] } : current);
    markChanged();
  }

  function duplicateSection(sectionIndex: number) {
    setSite((current) => {
      if (!current || current.sections.length >= 8) return current;
      const original = current.sections[sectionIndex];
      const copy = { ...original, id: createSectionId(current), title: `${original.title} (cópia)`, items: original.items.map((item) => ({ ...item })) };
      const sections = [...current.sections];
      sections.splice(sectionIndex + 1, 0, copy);
      return { ...current, sections };
    });
    markChanged();
  }

  function removeSection(sectionIndex: number) {
    setSite((current) => current && current.sections.length > 1 ? { ...current, sections: current.sections.filter((_, index) => index !== sectionIndex) } : current);
    markChanged();
  }

  function applyColors(primary: string, accent: string) {
    setSite((current) => current ? { ...current, primaryColor: primary, accentColor: accent } : current);
    markChanged();
  }

  async function saveSite() {
    if (!site || busy) return;
    setBusy(true);
    setError(null);
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

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void saveSite();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  return <main className="editor-layout">
    <aside className="editor-chat">
      <div><p className="eyebrow">ESTÚDIO DE SITES</p><h1>{project.name}</h1><p className="muted">Monte seu site por blocos e veja cada mudança na hora.</p><a className="editor-preview-link" href="#site-preview">Ir para o preview</a></div>
      {site ? <>
        <div className="editor-tabs" role="tablist" aria-label="Ferramentas do editor">
          <button type="button" role="tab" aria-selected={panel === "content"} className={panel === "content" ? "active" : ""} onClick={() => setPanel("content")}>Conteúdo</button>
          <button type="button" role="tab" aria-selected={panel === "design"} className={panel === "design" ? "active" : ""} onClick={() => setPanel("design")}>Design</button>
        </div>
        {panel === "content" ? <div className="editor-fields" id="editor-fields">
          <section className="editor-group"><h2>Marca e capa</h2>
            <label>Nome<input value={site.businessName} maxLength={80} onChange={(event) => updateSite("businessName", event.target.value)} /></label>
            <label>Frase de apoio<input value={site.tagline} maxLength={120} onChange={(event) => updateSite("tagline", event.target.value)} /></label>
            <label>Título principal<textarea value={site.heroTitle} maxLength={120} onChange={(event) => updateSite("heroTitle", event.target.value)} /></label>
            <label>Texto principal<textarea value={site.heroBody} maxLength={320} onChange={(event) => updateSite("heroBody", event.target.value)} /></label>
          </section>
          <section className="editor-group"><h2>Botão principal</h2>
            <label>Texto do botão<input value={site.ctaLabel} maxLength={40} onChange={(event) => updateSite("ctaLabel", event.target.value)} /></label>
            <label>Link do botão<input value={site.ctaHref || "#contato"} maxLength={500} onChange={(event) => updateSite("ctaHref", event.target.value)} placeholder="https://wa.me/5511999999999" /></label>
          </section>
          <section className="editor-group"><div className="editor-group-heading"><h2>Blocos do site</h2><span>{site.sections.length}/8</span></div>
            {site.sections.map((section, sectionIndex) => <fieldset className="section-editor" key={section.id}>
              <legend>Seção {sectionIndex + 1}</legend>
              <div className="block-actions" aria-label={`Ações da seção ${sectionIndex + 1}`}>
                <button type="button" title="Subir seção" aria-label="Subir seção" disabled={sectionIndex === 0} onClick={() => moveSection(sectionIndex, -1)}>↑</button>
                <button type="button" title="Descer seção" aria-label="Descer seção" disabled={sectionIndex === site.sections.length - 1} onClick={() => moveSection(sectionIndex, 1)}>↓</button>
                <button type="button" title="Duplicar seção" aria-label="Duplicar seção" disabled={site.sections.length >= 8} onClick={() => duplicateSection(sectionIndex)}>⧉</button>
                <button type="button" title="Excluir seção" aria-label="Excluir seção" className="danger" disabled={site.sections.length <= 1} onClick={() => removeSection(sectionIndex)}>×</button>
              </div>
              <label>Título<input value={section.title} maxLength={80} onChange={(event) => updateSection(sectionIndex, "title", event.target.value)} /></label>
              <label>Descrição<textarea value={section.body} maxLength={240} onChange={(event) => updateSection(sectionIndex, "body", event.target.value)} /></label>
              {section.items.map((item, itemIndex) => <div className="item-editor" key={`${section.id}-${itemIndex}`}>
                <div className="item-editor-heading"><b>Cartão {itemIndex + 1}</b><div className="block-actions compact" aria-label={`Ações do cartão ${itemIndex + 1}`}>
                  <button type="button" title="Subir cartão" aria-label="Subir cartão" disabled={itemIndex === 0} onClick={() => moveItem(sectionIndex, itemIndex, -1)}>↑</button>
                  <button type="button" title="Descer cartão" aria-label="Descer cartão" disabled={itemIndex === section.items.length - 1} onClick={() => moveItem(sectionIndex, itemIndex, 1)}>↓</button>
                  <button type="button" title="Excluir cartão" aria-label="Excluir cartão" className="danger" onClick={() => removeItem(sectionIndex, itemIndex)}>×</button>
                </div></div>
                <label>Item<input value={item.title} maxLength={80} onChange={(event) => updateItem(sectionIndex, itemIndex, "title", event.target.value)} /></label>
                <label>Descrição<input value={item.description} maxLength={200} onChange={(event) => updateItem(sectionIndex, itemIndex, "description", event.target.value)} /></label>
                <label>Preço <small>(opcional)</small><input value={item.price || ""} maxLength={40} onChange={(event) => updateItem(sectionIndex, itemIndex, "price", event.target.value)} /></label>
              </div>)}
              <button type="button" className="text-button" disabled={section.items.length >= 6} onClick={() => addItem(sectionIndex)}>+ Adicionar cartão</button>
            </fieldset>)}
            <button type="button" className="add-block-button" disabled={site.sections.length >= 8} onClick={addSection}>+ Adicionar seção</button>
          </section>
        </div> : <div className="editor-fields design-panel">
          <section className="editor-group"><h2>Paleta da marca</h2><div className="color-fields"><label>Cor principal<input type="color" value={site.primaryColor} onChange={(event) => updateSite("primaryColor", event.target.value)} /></label><label>Cor de destaque<input type="color" value={site.accentColor} onChange={(event) => updateSite("accentColor", event.target.value)} /></label></div>
            <div className="color-presets" aria-label="Paletas prontas">{colorPresets.map((preset) => <button type="button" className="color-preset" key={preset.name} onClick={() => applyColors(preset.primary, preset.accent)}><i style={{ background: preset.primary }} /><i style={{ background: preset.accent }} /><span>{preset.name}</span></button>)}</div>
          </section>
          <section className="editor-group"><h2>Tipografia</h2><div className="style-options" role="group" aria-label="Tipografia">{([ ["sans", "Moderna"], ["serif", "Editorial"], ["display", "Impacto"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.fontFamily === value || (!site.fontFamily && value === "serif") ? "active" : ""} onClick={() => updateDesign("fontFamily", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Estilo da capa</h2><div className="style-options" role="group" aria-label="Estilo da capa">{([ ["gradient", "Gradiente"], ["solid", "Sólida"], ["split", "Destaque"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.heroStyle === value || (!site.heroStyle && value === "gradient") ? "active" : ""} onClick={() => updateDesign("heroStyle", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Cartões</h2><div className="style-options" role="group" aria-label="Estilo dos cartões">{([ ["cards", "Cartões"], ["minimal", "Minimalista"], ["outlined", "Contorno"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.contentStyle === value || (!site.contentStyle && value === "cards") ? "active" : ""} onClick={() => updateDesign("contentStyle", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Botão</h2><div className="style-options" role="group" aria-label="Formato do botão">{([ ["rounded", "Arredondado"], ["square", "Reto"], ["pill", "Pílula"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.buttonStyle === value || (!site.buttonStyle && value === "rounded") ? "active" : ""} onClick={() => updateDesign("buttonStyle", value)}>{label}</button>)}</div></section>
        </div>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {saved && <p className="form-success" role="status">Alterações salvas.</p>}
        <button className="button button-primary" disabled={busy} onClick={() => void saveSite()}>{busy ? "Salvando..." : "Salvar alterações"}</button>
        <p className="editor-shortcut">Atalho: Ctrl/Cmd + S para salvar.</p>
      </> : <div className="editor-empty"><p>Este projeto antigo não tem modelo. Crie um novo site usando um dos modelos disponíveis.</p></div>}
    </aside>
    <section className="editor-preview" id="site-preview" tabIndex={-1}>
      <div className="preview-toolbar"><div><b>{t.editor.preview}</b><small>{saved ? "Salvo no Supabase" : "Alterações ainda não salvas"}</small></div><div className="device-switch" role="group" aria-label="Tamanho do preview">{(["desktop", "tablet", "mobile"] as Device[]).map((item) => <button type="button" onClick={() => setDevice(item)} className={device === item ? "active" : ""} key={item}>{t.editor[item]}</button>)}</div></div>
      {site ? <div className={`preview-frame ${device}`}><SitePreview site={site} /></div> : <div className="preview-empty"><p>Crie um novo projeto para começar.</p></div>}
    </section>
  </main>;
}
