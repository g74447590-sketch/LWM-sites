import { getServerSession } from "next-auth";
import { DashboardClient } from "@/components/dashboard-client";
import { authOptions } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { listProjects } from "@/lib/projects";
import { requireUserId } from "@/lib/session";

export default async function DashboardPage() {
  let projects;
  let userName: string | null | undefined;
  let message: string | null = null;
  try { const [userId, session] = await Promise.all([requireUserId(), getServerSession(authOptions)]); projects = await listProjects(userId); userName = session?.user.name; }
  catch (error) { message = error instanceof AppError ? error.message : "Não foi possível carregar o dashboard."; }
  if (message || !projects) return <main className="centered-page"><section className="status-card"><p className="eyebrow">CONFIGURAÇÃO PENDENTE</p><h1>Dashboard indisponível</h1><p>{message}</p></section></main>;
  return <DashboardClient initialProjects={projects} userName={userName} />;
}
