"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import type { Project } from "@/types";

export function DashboardClient({ initialProjects, userName }: { initialProjects: Project[]; userName?: string | null }) {
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
      if (!response.ok) throw new Error(payload?.error || "Não foi possível atualizar o projeto.");
      return payload as Project | null;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível atualizar o projeto.");
      return null;
    } finally {
      setBusyId(null);
    }
  }

  async function removeProject(id: string) {
    if (!window.confirm("Excluir este projeto? Esta ação não pode ser desfeita.")) return;
    setError(null);
    setBusyId(id);
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || "Não foi possível excluir o projeto.");
      }
      setProjects((current) => current.filter((project) => project.id !== id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível excluir o projeto.");
    } finally {
      setBusyId(null);
    }
  }

  async function renameProject(project: Project) {
    const name = window.prompt("Novo nome do projeto", project.name)?.trim();
    if (!name || name === project.name) return;
    const updated = await apiAction(project.id, "", "PATCH", { name });
    if (updated) replaceProject(updated);
  }

  async function duplicate(project: Project) {
    const copy = await apiAction(project.id, "/duplicate", "POST");
    if (copy) setProjects((current) => [copy, ...current]);
  }

  async function togglePublication(project: Project) {
    const updated = await apiAction(project.id, "/publish", project.publishedAt ? "DELETE" : "POST");
    if (updated) replaceProject(updated);
  }

  return <main className="dashboard">
    <header className="dashboard-header"><div><p className="eyebrow">WORKSPACE</p><h1>Olá{userName ? `, ${userName}` : ""}.</h1><p>Crie, revise e evolua seus sites em um só lugar.</p></div><div className="dashboard-actions"><Link className="button button-primary" href="/create">Criar novo site</Link><LogoutButton /></div></header>
    <section className="stats"><article><b>{projects.length}</b><span>Projetos</span></article><article><b>{projects.filter((project) => project.status === "ready").length}</b><span>Prontos para revisar</span></article><article><b>{projects.filter((project) => project.publishedAt).length}</b><span>Sites publicados</span></article></section>
    <section className="projects-section"><div className="section-heading"><h2>Meus projetos</h2><span>{projects.length} no total</span></div>{error && <p className="form-error" role="alert">{error}</p>}
      {projects.length ? <div className="project-grid">{projects.map((project) => <article className="project-card" key={project.id}>
        <span className={`status ${project.status}`}>{project.publishedAt ? "Publicado" : project.status === "ready" ? "Pronto" : project.status === "error" ? "Requer configuração" : "Rascunho"}</span>
        <h3>{project.name}</h3><p>{project.description}</p><small>Atualizado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(project.updatedAt))}</small>
        <div className="project-card-actions"><Link className="button button-ghost" href={`/editor/${project.id}`}>Editor</Link><button className="button button-ghost" disabled={busyId === project.id} onClick={() => void renameProject(project)}>Renomear</button><button className="button button-ghost" disabled={busyId === project.id} onClick={() => void duplicate(project)}>Duplicar</button></div>
        <div className="project-card-actions"><button className="button button-primary" disabled={busyId === project.id || (!project.generatedSite && !project.publishedAt)} onClick={() => void togglePublication(project)}>{project.publishedAt ? "Despublicar" : "Publicar"}</button>{project.slug && project.publishedAt && <Link className="button button-ghost" href={`/sites/${project.slug}`} target="_blank">Ver site</Link>}<button className="icon-button" disabled={busyId === project.id} aria-label={`Excluir ${project.name}`} onClick={() => void removeProject(project.id)}>×</button></div>
      </article>)}</div> : <div className="empty-state"><h3>Nenhum projeto ainda.</h3><p>Comece descrevendo o site que deseja criar.</p><Link className="button button-primary" href="/create">Criar novo site</Link></div>}
    </section>
  </main>;
}
