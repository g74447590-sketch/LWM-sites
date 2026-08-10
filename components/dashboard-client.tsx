"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { useLocale } from "@/components/locale-provider";
import type { Locale, Project } from "@/types";

const dashboardCopy: Record<Locale, Record<string, string>> = {
  "pt-BR": { workspace: "MEU ESPAÇO", greeting: "Olá", subtitle: "Crie, revise e evolua seus sites em um só lugar.", create: "Criar novo site", projects: "Projetos", ready: "Prontos para revisar", published: "Sites publicados", myProjects: "Meus projetos", total: "no total", updated: "Atualizado em", editor: "Editor", rename: "Renomear", duplicate: "Duplicar", unpublish: "Despublicar", publish: "Publicar", view: "Ver site", delete: "Excluir", emptyTitle: "Nenhum projeto ainda.", emptyBody: "Comece descrevendo o site que deseja criar.", confirmDelete: "Excluir este projeto? Esta ação não pode ser desfeita.", confirmPublish: "Você confirma que tem direito de usar os textos, imagens, marcas e contatos deste site? A LWM não faz aprovação jurídica automática.", newName: "Novo nome do projeto", updateError: "Não foi possível atualizar o projeto.", deleteError: "Não foi possível excluir o projeto.", statusPublished: "Publicado", statusReady: "Pronto", statusGenerating: "Gerando…", statusError: "Requer configuração", statusDraft: "Rascunho" },
  en: { workspace: "MY SPACE", greeting: "Hello", subtitle: "Create, review and improve your sites in one place.", create: "Create new site", projects: "Projects", ready: "Ready to review", published: "Published sites", myProjects: "My projects", total: "total", updated: "Updated", editor: "Editor", rename: "Rename", duplicate: "Duplicate", unpublish: "Unpublish", publish: "Publish", view: "View site", delete: "Delete", emptyTitle: "No projects yet.", emptyBody: "Start by describing the site you want to create.", confirmDelete: "Delete this project? This action cannot be undone.", confirmPublish: "Do you confirm that you can use this website's text, images, brands and contact information? LWM does not provide automatic legal approval.", newName: "New project name", updateError: "We couldn't update the project.", deleteError: "We couldn't delete the project.", statusPublished: "Published", statusReady: "Ready", statusGenerating: "Creating…", statusError: "Needs setup", statusDraft: "Draft" },
  es: { workspace: "MI ESPACIO", greeting: "Hola", subtitle: "Crea, revisa y mejora tus sitios en un solo lugar.", create: "Crear nuevo sitio", projects: "Proyectos", ready: "Listos para revisar", published: "Sitios publicados", myProjects: "Mis proyectos", total: "en total", updated: "Actualizado", editor: "Editor", rename: "Renombrar", duplicate: "Duplicar", unpublish: "Despublicar", publish: "Publicar", view: "Ver sitio", delete: "Eliminar", emptyTitle: "Aún no hay proyectos.", emptyBody: "Empieza describiendo el sitio que quieres crear.", confirmDelete: "¿Eliminar este proyecto? Esta acción no se puede deshacer.", confirmPublish: "¿Confirmas que puedes usar los textos, imágenes, marcas y datos de contacto de este sitio? LWM no realiza una aprobación legal automática.", newName: "Nuevo nombre del proyecto", updateError: "No fue posible actualizar el proyecto.", deleteError: "No fue posible eliminar el proyecto.", statusPublished: "Publicado", statusReady: "Listo", statusGenerating: "Creando…", statusError: "Requiere configuración", statusDraft: "Borrador" },
};

export function DashboardClient({ initialProjects, userName }: { initialProjects: Project[]; userName?: string | null }) {
  const { locale } = useLocale();
  const copy = dashboardCopy[locale];
  const [projects, setProjects] = useState(initialProjects);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function replaceProject(updated: Project) {
    setProjects((current) => current.map((project) => project.id === updated.id ? updated : project));
  }

  async function apiAction(id: string, path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
    setError(null);
    setBusyId(id);
    try {
      const response = await fetch(`/api/projects/${id}${path}`, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
      const payload = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(payload?.error || copy.updateError);
      return payload as Project | null;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.updateError);
      return null;
    } finally {
      setBusyId(null);
    }
  }

  async function removeProject(id: string) {
    if (!window.confirm(copy.confirmDelete)) return;
    setError(null);
    setBusyId(id);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || copy.deleteError);
      }
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.deleteError);
    } finally {
      setBusyId(null);
    }
  }

  async function renameProject(project: Project) {
    const name = window.prompt(copy.newName, project.name)?.trim();
    if (!name || name === project.name) return;
    const updated = await apiAction(project.id, "", "PATCH", { name });
    if (updated) replaceProject(updated);
  }

  async function duplicate(project: Project) {
    const copy = await apiAction(project.id, "/duplicate", "POST");
    if (copy) setProjects((current) => [copy, ...current]);
  }

  async function togglePublication(project: Project) {
    if (!project.publishedAt && !window.confirm(copy.confirmPublish)) return;
    const updated = await apiAction(project.id, "/publish", project.publishedAt ? "DELETE" : "POST", project.publishedAt ? undefined : { acknowledge: true });
    if (updated) replaceProject(updated);
  }

  return <main className="dashboard">
    <header className="dashboard-header"><div><p className="eyebrow">{copy.workspace}</p><h1>{copy.greeting}{userName ? `, ${userName}` : ""}.</h1><p>{copy.subtitle}</p></div><div className="dashboard-actions"><Link className="button button-primary" href="/create">{copy.create}</Link><LogoutButton /></div></header>
    <section className="stats"><article><b>{projects.length}</b><span>{copy.projects}</span></article><article><b>{projects.filter((project) => project.status === "ready").length}</b><span>{copy.ready}</span></article><article><b>{projects.filter((project) => project.publishedAt).length}</b><span>{copy.published}</span></article></section>
    <section className="projects-section"><div className="section-heading"><h2>{copy.myProjects}</h2><span>{projects.length} {copy.total}</span></div>{error && <p className="form-error" role="alert">{error}</p>}
      {projects.length ? <div className="project-grid">{projects.map((project) => <article className="project-card" key={project.id}>
        <span className={`status ${project.publishedAt ? "ready" : project.status}`}>{project.publishedAt ? copy.statusPublished : project.status === "ready" ? copy.statusReady : project.status === "generating" ? copy.statusGenerating : project.status === "error" ? copy.statusError : copy.statusDraft}</span>
        <h3>{project.name}</h3><p>{project.description}</p><small>{copy.updated} {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(project.updatedAt))}</small>
        <div className="project-card-actions"><Link className="button button-ghost" href={`/editor/${project.id}`}>{copy.editor}</Link><button className="button button-ghost" disabled={busyId === project.id} onClick={() => void renameProject(project)}>{copy.rename}</button><button className="button button-ghost" disabled={busyId === project.id} onClick={() => void duplicate(project)}>{copy.duplicate}</button></div>
        <div className="project-card-actions"><button className="button button-primary" disabled={busyId === project.id || (!project.generatedSite && !project.publishedAt)} onClick={() => void togglePublication(project)}>{project.publishedAt ? copy.unpublish : copy.publish}</button>{project.slug && project.publishedAt && <Link className="button button-ghost" href={`/sites/${project.slug}`} target="_blank" rel="noreferrer">{copy.view}</Link>}<button className="icon-button" disabled={busyId === project.id} aria-label={`${copy.delete} ${project.name}`} onClick={() => void removeProject(project.id)}>×</button></div>
      </article>)}</div> : <div className="empty-state"><h3>{copy.emptyTitle}</h3><p>{copy.emptyBody}</p><Link className="button button-primary" href="/create">{copy.create}</Link></div>}
    </section>
  </main>;
}
