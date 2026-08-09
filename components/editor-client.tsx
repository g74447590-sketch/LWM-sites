"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { SitePreview } from "@/components/site-preview";
import type { ButtonStyle, ContentStyle, GeneratedSite, HeroStyle, Project, SectionLayout, SiteFont } from "@/types";

type Device = "desktop" | "tablet" | "mobile";
type EditorPanel = "content" | "blocks" | "design";
type TextField = "businessName" | "tagline" | "heroTitle" | "heroBody" | "ctaLabel" | "ctaHref" | "primaryColor" | "accentColor" | "seoTitle" | "seoDescription";
type DesignField = "fontFamily" | "heroStyle" | "contentStyle" | "buttonStyle";
type SiteSection = GeneratedSite["sections"][number];

const colorPresets = [
  { name: "Violeta", primary: "#4B2A7C", accent: "#E957B5" },
  { name: "Oceano", primary: "#12395B", accent: "#2BA9BF" },
  { name: "Floresta", primary: "#1F4A3C", accent: "#D7A643" },
  { name: "Terracota", primary: "#73382E", accent: "#E48754" },
] as const;

const blockCatalog: Array<{ layout: SectionLayout; name: string; description: string; title: string; body: string; items: SiteSection["items"] }> = [
  { layout: "cards", name: "Cartões", description: "Serviços, produtos ou benefícios em cartões.", title: "Nossos serviços", body: "Conheça as opções preparadas para você.", items: [{ title: "Serviço principal", description: "Explique o principal benefício para o cliente." }, { title: "Atendimento próximo", description: "Mostre como sua equipe faz a diferença." }, { title: "Resultado claro", description: "Destaque o que o cliente recebe." }] },
  { layout: "list", name: "Lista", description: "Passos, diferenciais ou itens em leitura rápida.", title: "Como funciona", body: "Um processo simples em poucos passos.", items: [{ title: "1. Fale com a gente", description: "Conte o que você precisa." }, { title: "2. Escolha a melhor opção", description: "Receba uma orientação objetiva." }, { title: "3. Aproveite", description: "Tenha a solução pronta para você." }] },
  { layout: "banner", name: "Destaque", description: "Uma chamada visual para oferta, agenda ou evento.", title: "Um convite especial", body: "Use este bloco para deixar uma oferta ou mensagem impossível de ignorar.", items: [{ title: "Atendimento com hora marcada", description: "Escolha o melhor horário para você." }, { title: "Condições especiais", description: "Fale com a equipe e saiba mais." }] },
  { layout: "faq", name: "Perguntas", description: "Dúvidas comuns em formato de abrir e fechar.", title: "Perguntas frequentes", body: "Tudo o que você precisa saber antes de entrar em contato.", items: [{ title: "Como faço para agendar?", description: "Use o botão de contato e escolha o melhor horário." }, { title: "Quais formas de pagamento?", description: "Informe aqui as opções aceitas pelo seu negócio." }, { title: "Onde vocês atendem?", description: "Informe endereço, cidade ou formato de atendimento." }] },
];

function createSectionId(site: GeneratedSite) {
  const base = `section-${Date.now().toString(36)}`;
  return site.sections.some((section) => section.id === base) ? `${base}-${site.sections.length + 1}` : base;
}

function newSection(site: GeneratedSite, layout: SectionLayout): SiteSection {
  const block = blockCatalog.find((item) => item.layout === layout) ?? blockCatalog[0];
  return { id: createSectionId(site), title: block.title, body: block.body, layout, items: block.items.map((item) => ({ ...item })) };
}

export function EditorClient({ project }: { project: Project }) {
  const { t } = useLocale();
  const [site, setSite] = useState<GeneratedSite | null>(project.generatedSite);
  const [device, setDevice] = useState<Device>("desktop");
  const [panel, setPanel] = useState<EditorPanel>("content");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const siteRef = useRef<GeneratedSite | null>(project.generatedSite);
  const historyRef = useRef<GeneratedSite[]>(project.generatedSite ? [project.generatedSite] : []);
  const historyIndexRef = useRef(0);
  const [historyPosition, setHistoryPosition] = useState({ index: 0, length: project.generatedSite ? 1 : 0 });

  function markChanged() {
    setSaved(false);
    setError(null);
  }

  function commitChange(change: (current: GeneratedSite) => GeneratedSite) {
    const current = siteRef.current;
    if (!current) return;
    const next = change(current);
    const nextHistory = [...historyRef.current.slice(0, historyIndexRef.current + 1), next].slice(-40);
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setHistoryPosition({ index: historyIndexRef.current, length: nextHistory.length });
    siteRef.current = next;
    setSite(next);
    markChanged();
  }

  function restoreHistory(direction: -1 | 1) {
    const nextIndex = historyIndexRef.current + direction;
    const next = historyRef.current[nextIndex];
    if (!next) return;
    historyIndexRef.current = nextIndex;
    setHistoryPosition({ index: nextIndex, length: historyRef.current.length });
    siteRef.current = next;
    setSite(next);
    markChanged();
  }

  function updateSite(field: TextField, value: string) {
    commitChange((current) => ({ ...current, [field]: value }));
  }

  function updateDesign(field: DesignField, value: SiteFont | HeroStyle | ContentStyle | ButtonStyle) {
    commitChange((current) => ({ ...current, [field]: value } as GeneratedSite));
  }

  function updateSection(sectionIndex: number, field: "title" | "body", value: string) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, [field]: value } : section) }));
  }

  function updateSectionLayout(sectionIndex: number, layout: SectionLayout) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, layout } : section) }));
  }

  function updateSectionImage(sectionIndex: number, imageUrl: string) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, imageUrl: imageUrl.trim() || undefined } : section) }));
  }

  function updateItem(sectionIndex: number, itemIndex: number, field: "title" | "description" | "price", value: string) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.map((item, itemPosition) => itemPosition === itemIndex ? { ...item, [field]: value } : item) } : section) }));
  }

  function addItem(sectionIndex: number) {
    if (!siteRef.current || siteRef.current.sections[sectionIndex]?.items.length >= 6) return;
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: [...section.items, { title: "Novo item", description: "Descreva este item." }] } : section) }));
  }

  function moveItem(sectionIndex: number, itemIndex: number, direction: -1 | 1) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => {
      if (index !== sectionIndex) return section;
      const destination = itemIndex + direction;
      if (destination < 0 || destination >= section.items.length) return section;
      const items = [...section.items];
      [items[itemIndex], items[destination]] = [items[destination], items[itemIndex]];
      return { ...section, items };
    }) }));
  }

  function removeItem(sectionIndex: number, itemIndex: number) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, items: section.items.filter((_, position) => position !== itemIndex) } : section) }));
  }

  function moveSection(sectionIndex: number, direction: -1 | 1) {
    commitChange((current) => {
      const destination = sectionIndex + direction;
      if (destination < 0 || destination >= current.sections.length) return current;
      const sections = [...current.sections];
      [sections[sectionIndex], sections[destination]] = [sections[destination], sections[sectionIndex]];
      return { ...current, sections };
    });
  }

  function addSection(layout: SectionLayout) {
    if (!siteRef.current || siteRef.current.sections.length >= 8) return;
    commitChange((current) => ({ ...current, sections: [...current.sections, newSection(current, layout)] }));
    setPanel("content");
  }

  function duplicateSection(sectionIndex: number) {
    if (!siteRef.current || siteRef.current.sections.length >= 8) return;
    commitChange((current) => {
      const original = current.sections[sectionIndex];
      const copy = { ...original, id: createSectionId(current), title: `${original.title} (cópia)`, items: original.items.map((item) => ({ ...item })) };
      const sections = [...current.sections];
      sections.splice(sectionIndex + 1, 0, copy);
      return { ...current, sections };
    });
  }

  function removeSection(sectionIndex: number) {
    if (!siteRef.current || siteRef.current.sections.length <= 1) return;
    commitChange((current) => ({ ...current, sections: current.sections.filter((_, index) => index !== sectionIndex) }));
  }

  function toggleSectionVisibility(sectionIndex: number) {
    commitChange((current) => ({ ...current, sections: current.sections.map((section, index) => index === sectionIndex ? { ...section, hidden: !section.hidden } : section) }));
  }

  function applyColors(primary: string, accent: string) {
    commitChange((current) => ({ ...current, primaryColor: primary, accentColor: accent }));
  }

  function openSection(sectionId: string) {
    setPanel("content");
    window.setTimeout(() => document.getElementById(`section-editor-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  async function uploadSectionImage(sectionIndex: number, file: File) {
    const current = siteRef.current;
    const section = current?.sections[sectionIndex];
    if (!current || !section) return;
    setUploadingSectionId(section.id);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch(`/api/projects/${project.id}/media`, { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok || typeof payload.url !== "string") throw new Error(payload.error || "Não foi possível enviar a imagem.");
      commitChange((latest) => ({ ...latest, sections: latest.sections.map((item, index) => index === sectionIndex ? { ...item, imageUrl: payload.url } : item) }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploadingSectionId(null);
    }
  }

  async function saveSite() {
    if (!site || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ site }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível salvar o site.");
      siteRef.current = payload.generatedSite;
      setSite(payload.generatedSite);
      setSaved(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível salvar o site.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    siteRef.current = site;
  }, [site]);

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

  const canUndo = historyPosition.index > 0;
  const canRedo = historyPosition.index < historyPosition.length - 1;

  return <main className="editor-layout">
    <aside className="editor-chat">
      <div><p className="eyebrow">ESTÚDIO DE SITES</p><h1>{project.name}</h1><p className="muted">Monte seu site por blocos e veja cada mudança na hora.</p><a className="editor-preview-link" href="#site-preview">Ir para o preview</a></div>
      {site ? <>
        <div className="editor-history" role="group" aria-label="Histórico de edição"><button type="button" disabled={!canUndo} onClick={() => restoreHistory(-1)}>Desfazer</button><button type="button" disabled={!canRedo} onClick={() => restoreHistory(1)}>Refazer</button></div>
        <div className="editor-tabs editor-tabs-three" role="tablist" aria-label="Ferramentas do editor">
          <button type="button" role="tab" aria-selected={panel === "content"} className={panel === "content" ? "active" : ""} onClick={() => setPanel("content")}>Conteúdo</button>
          <button type="button" role="tab" aria-selected={panel === "blocks"} className={panel === "blocks" ? "active" : ""} onClick={() => setPanel("blocks")}>Blocos</button>
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
            {site.sections.map((section, sectionIndex) => <fieldset className={`section-editor ${section.hidden ? "is-hidden" : ""}`} id={`section-editor-${section.id}`} key={section.id}>
              <legend>Seção {sectionIndex + 1} {section.hidden ? "(oculta)" : ""}</legend>
              <div className="block-actions" aria-label={`Ações da seção ${sectionIndex + 1}`}>
                <button type="button" title="Subir seção" aria-label="Subir seção" disabled={sectionIndex === 0} onClick={() => moveSection(sectionIndex, -1)}>↑</button>
                <button type="button" title="Descer seção" aria-label="Descer seção" disabled={sectionIndex === site.sections.length - 1} onClick={() => moveSection(sectionIndex, 1)}>↓</button>
                <button type="button" title={section.hidden ? "Mostrar seção" : "Ocultar seção"} aria-label={section.hidden ? "Mostrar seção" : "Ocultar seção"} aria-pressed={!section.hidden} onClick={() => toggleSectionVisibility(sectionIndex)}>{section.hidden ? "◉" : "⊘"}</button>
                <button type="button" title="Duplicar seção" aria-label="Duplicar seção" disabled={site.sections.length >= 8} onClick={() => duplicateSection(sectionIndex)}>⧉</button>
                <button type="button" title="Excluir seção" aria-label="Excluir seção" className="danger" disabled={site.sections.length <= 1} onClick={() => removeSection(sectionIndex)}>×</button>
              </div>
              <label>Tipo de bloco<select value={section.layout ?? "cards"} onChange={(event) => updateSectionLayout(sectionIndex, event.target.value as SectionLayout)}><option value="cards">Cartões</option><option value="list">Lista</option><option value="banner">Destaque</option><option value="faq">Perguntas frequentes</option></select></label>
              <label>Imagem do bloco <small>(opcional, URL HTTPS)</small><input type="url" value={section.imageUrl ?? ""} maxLength={1000} placeholder="https://..." onChange={(event) => updateSectionImage(sectionIndex, event.target.value)} /></label>
              <label className="image-upload">Enviar imagem <small>JPG, PNG, WEBP ou GIF · até 5 MB</small><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploadingSectionId === section.id} onChange={(event) => { const file = event.currentTarget.files?.[0]; event.currentTarget.value = ""; if (file) void uploadSectionImage(sectionIndex, file); }} />{uploadingSectionId === section.id && <span>Enviando imagem...</span>}</label>
              <label>Título<input value={section.title} maxLength={80} onChange={(event) => updateSection(sectionIndex, "title", event.target.value)} /></label>
              <label>Descrição<textarea value={section.body} maxLength={240} onChange={(event) => updateSection(sectionIndex, "body", event.target.value)} /></label>
              {section.items.map((item, itemIndex) => <div className="item-editor" key={`${section.id}-${itemIndex}`}>
                <div className="item-editor-heading"><b>{section.layout === "faq" ? "Pergunta" : "Cartão"} {itemIndex + 1}</b><div className="block-actions compact" aria-label={`Ações do cartão ${itemIndex + 1}`}>
                  <button type="button" title="Subir cartão" aria-label="Subir cartão" disabled={itemIndex === 0} onClick={() => moveItem(sectionIndex, itemIndex, -1)}>↑</button>
                  <button type="button" title="Descer cartão" aria-label="Descer cartão" disabled={itemIndex === section.items.length - 1} onClick={() => moveItem(sectionIndex, itemIndex, 1)}>↓</button>
                  <button type="button" title="Excluir cartão" aria-label="Excluir cartão" className="danger" onClick={() => removeItem(sectionIndex, itemIndex)}>×</button>
                </div></div>
                <label>{section.layout === "faq" ? "Pergunta" : "Item"}<input value={item.title} maxLength={80} onChange={(event) => updateItem(sectionIndex, itemIndex, "title", event.target.value)} /></label>
                <label>{section.layout === "faq" ? "Resposta" : "Descrição"}<input value={item.description} maxLength={200} onChange={(event) => updateItem(sectionIndex, itemIndex, "description", event.target.value)} /></label>
                {section.layout !== "faq" && <label>Preço <small>(opcional)</small><input value={item.price || ""} maxLength={40} onChange={(event) => updateItem(sectionIndex, itemIndex, "price", event.target.value)} /></label>}
              </div>)}
              <button type="button" className="text-button" disabled={section.items.length >= 6} onClick={() => addItem(sectionIndex)}>+ Adicionar {section.layout === "faq" ? "pergunta" : "cartão"}</button>
            </fieldset>)}
            <button type="button" className="add-block-button" disabled={site.sections.length >= 8} onClick={() => setPanel("blocks")}>+ Inserir novo bloco</button>
          </section>
        </div> : panel === "blocks" ? <div className="editor-fields">
          <section className="editor-group"><h2>Inserir bloco</h2><p className="editor-helper">Escolha a estrutura; você edita todos os textos depois.</p><div className="block-catalog">{blockCatalog.map((block) => <button type="button" className="block-catalog-card" key={block.layout} disabled={site.sections.length >= 8} onClick={() => addSection(block.layout)}><b>{block.name}</b><span>{block.description}</span><small>Adicionar ao site</small></button>)}</div></section>
          <section className="editor-group"><h2>Navegador de páginas</h2><div className="section-navigator">{site.sections.map((section, index) => <button type="button" key={section.id} onClick={() => openSection(section.id)}><span>{index + 1}</span><b>{section.title}</b><small>{section.hidden ? "Oculta" : section.layout ?? "Cartões"}</small></button>)}</div></section>
        </div> : <div className="editor-fields design-panel">
          <section className="editor-group"><h2>Paleta da marca</h2><div className="color-fields"><label>Cor principal<input type="color" value={site.primaryColor} onChange={(event) => updateSite("primaryColor", event.target.value)} /></label><label>Cor de destaque<input type="color" value={site.accentColor} onChange={(event) => updateSite("accentColor", event.target.value)} /></label></div>
            <div className="color-presets" aria-label="Paletas prontas">{colorPresets.map((preset) => <button type="button" className="color-preset" key={preset.name} onClick={() => applyColors(preset.primary, preset.accent)}><i style={{ background: preset.primary }} /><i style={{ background: preset.accent }} /><span>{preset.name}</span></button>)}</div>
          </section>
          <section className="editor-group"><h2>Tipografia</h2><div className="style-options" role="group" aria-label="Tipografia">{([ ["sans", "Moderna"], ["serif", "Editorial"], ["display", "Impacto"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.fontFamily === value || (!site.fontFamily && value === "serif") ? "active" : ""} onClick={() => updateDesign("fontFamily", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Estilo da capa</h2><div className="style-options" role="group" aria-label="Estilo da capa">{([ ["gradient", "Gradiente"], ["solid", "Sólida"], ["split", "Destaque"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.heroStyle === value || (!site.heroStyle && value === "gradient") ? "active" : ""} onClick={() => updateDesign("heroStyle", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Cartões</h2><div className="style-options" role="group" aria-label="Estilo dos cartões">{([ ["cards", "Cartões"], ["minimal", "Minimalista"], ["outlined", "Contorno"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.contentStyle === value || (!site.contentStyle && value === "cards") ? "active" : ""} onClick={() => updateDesign("contentStyle", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>Botão</h2><div className="style-options" role="group" aria-label="Formato do botão">{([ ["rounded", "Arredondado"], ["square", "Reto"], ["pill", "Pílula"] ] as const).map(([value, label]) => <button key={value} type="button" className={site.buttonStyle === value || (!site.buttonStyle && value === "rounded") ? "active" : ""} onClick={() => updateDesign("buttonStyle", value)}>{label}</button>)}</div></section>
          <section className="editor-group"><h2>SEO e compartilhamento</h2><p className="editor-helper">Título e descrição usados pelo Google e ao compartilhar o link.</p><label>Título SEO <small>(até 60 caracteres)</small><input value={site.seoTitle ?? ""} maxLength={60} placeholder={site.businessName} onChange={(event) => updateSite("seoTitle", event.target.value)} /></label><label>Descrição SEO <small>(até 160 caracteres)</small><textarea value={site.seoDescription ?? ""} maxLength={160} placeholder={site.heroBody} onChange={(event) => updateSite("seoDescription", event.target.value)} /></label></section>
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
