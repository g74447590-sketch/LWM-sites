import type { GeneratedSite, Project, ProjectMessage, ProjectStatus } from "@/types";
import { AppError } from "@/lib/errors";
import { subscriptionAccess } from "@/lib/plans";
import { parseGeneratedSite } from "@/lib/site-schema";
import { getServerSupabase } from "@/lib/supabase";
import { getUserSubscription } from "@/lib/users";

type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  generated_site: unknown;
  slug: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    status: row.status,
    generatedSite: row.generated_site ? parseGeneratedSite(row.generated_site) : null,
    slug: row.slug,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getActivePlanAccess(userId: string) {
  const access = subscriptionAccess(await getUserSubscription(userId));
  if (!access.active) throw new AppError("Seu teste ou plano terminou. Ative um plano para continuar editando e mantendo seu site publicado.", 402, "PLAN_EXPIRED");
  return access;
}

async function assertCanCreateProject(userId: string) {
  const [access, projectCount] = await Promise.all([getActivePlanAccess(userId), getServerSupabase().from("projects").select("id", { count: "exact", head: true }).eq("user_id", userId)]);
  if (projectCount.error) throw databaseError(projectCount.error.message);
  if ((projectCount.count ?? 0) >= access.maxProjects) throw new AppError(`O plano ${access.plan.name} permite até ${access.maxProjects} site${access.maxProjects === 1 ? "" : "s"}. Escolha outro plano para criar mais projetos.`, 409, "PLAN_PROJECT_LIMIT");
}

function databaseError(message: string): AppError {
  return new AppError(`Não foi possível acessar os projetos: ${message}`, 500, "DATABASE_ERROR");
}

export async function listProjects(userId: string): Promise<Project[]> {
  const { data, error } = await getServerSupabase()
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw databaseError(error.message);
  return (data as ProjectRow[]).map(mapProject);
}

export async function getProject(userId: string, projectId: string): Promise<Project> {
  const { data, error } = await getServerSupabase()
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) throw new AppError("Projeto não encontrado.", 404, "PROJECT_NOT_FOUND");
  return mapProject(data as ProjectRow);
}

export async function createProject(userId: string, name: string, description: string, generatedSite: GeneratedSite): Promise<Project> {
  await assertCanCreateProject(userId);
  const { data, error } = await getServerSupabase()
    .from("projects")
    .insert({ user_id: userId, name, description, status: "ready", generated_site: generatedSite })
    .select("*")
    .single();
  if (error) throw databaseError(error.message);
  return mapProject(data as ProjectRow);
}

export async function updateProjectName(userId: string, projectId: string, name: string): Promise<Project> {
  await getActivePlanAccess(userId);
  const { data, error } = await getServerSupabase()
    .from("projects")
    .update({ name })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) throw new AppError("Projeto não encontrado.", 404, "PROJECT_NOT_FOUND");
  return mapProject(data as ProjectRow);
}

export async function saveGeneratedSite(
  userId: string,
  projectId: string,
  generatedSite: GeneratedSite,
): Promise<Project> {
  await getActivePlanAccess(userId);
  const { data, error } = await getServerSupabase()
    .from("projects")
    .update({ generated_site: generatedSite, status: "ready" })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) throw new AppError("Projeto não encontrado.", 404, "PROJECT_NOT_FOUND");
  return mapProject(data as ProjectRow);
}

export async function markGenerationError(userId: string, projectId: string): Promise<void> {
  const { error } = await getServerSupabase()
    .from("projects")
    .update({ status: "error" })
    .eq("id", projectId)
    .eq("user_id", userId);
  if (error) throw databaseError(error.message);
}

export async function deleteProject(userId: string, projectId: string): Promise<void> {
  const { error } = await getServerSupabase()
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", userId);
  if (error) throw databaseError(error.message);
}

export async function duplicateProject(userId: string, projectId: string): Promise<Project> {
  await assertCanCreateProject(userId);
  const source = await getProject(userId, projectId);
  const copyName = `${source.name.slice(0, 89)} (cópia)`;
  const { data, error } = await getServerSupabase()
    .from("projects")
    .insert({
      user_id: userId,
      name: copyName,
      description: source.description,
      status: source.generatedSite ? "ready" : "draft",
      generated_site: source.generatedSite,
    })
    .select("*")
    .single();
  if (error) throw databaseError(error.message);
  return mapProject(data as ProjectRow);
}

function slugFrom(name: string, projectId: string) {
  const base = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54) || "site";
  return `${base}-${projectId.replace(/-/g, "").slice(0, 8)}`;
}

export async function publishProject(userId: string, projectId: string): Promise<Project> {
  await getActivePlanAccess(userId);
  const source = await getProject(userId, projectId);
  if (!source.generatedSite) throw new AppError("Gere um site antes de publicá-lo.", 409, "PROJECT_NOT_GENERATED");
  const { data, error } = await getServerSupabase()
    .from("projects")
    .update({ slug: source.slug ?? slugFrom(source.name, source.id), published_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) throw new AppError("Projeto não encontrado.", 404, "PROJECT_NOT_FOUND");
  return mapProject(data as ProjectRow);
}

export async function unpublishProject(userId: string, projectId: string): Promise<Project> {
  const { data, error } = await getServerSupabase()
    .from("projects")
    .update({ published_at: null })
    .eq("id", projectId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) throw new AppError("Projeto não encontrado.", 404, "PROJECT_NOT_FOUND");
  return mapProject(data as ProjectRow);
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  const { data, error } = await getServerSupabase()
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error) throw databaseError(error.message);
  if (!data) return null;
  const project = mapProject(data as ProjectRow);
  return subscriptionAccess(await getUserSubscription(project.userId)).active ? project : null;
}

type ProjectMessageRow = {
  id: string;
  project_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

function mapMessage(row: ProjectMessageRow): ProjectMessage {
  return { id: row.id, projectId: row.project_id, role: row.role, content: row.content, createdAt: row.created_at };
}

export async function listProjectMessages(userId: string, projectId: string): Promise<ProjectMessage[]> {
  await getProject(userId, projectId);
  const { data, error } = await getServerSupabase()
    .from("project_messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });
  if (error) throw databaseError(error.message);
  return (data as ProjectMessageRow[]).map(mapMessage);
}

export async function addProjectMessage(
  projectId: string,
  role: ProjectMessage["role"],
  content: string,
): Promise<ProjectMessage> {
  const { data, error } = await getServerSupabase()
    .from("project_messages")
    .insert({ project_id: projectId, role, content: content.slice(0, 2000) })
    .select("*")
    .single();
  if (error) throw databaseError(error.message);
  return mapMessage(data as ProjectMessageRow);
}
