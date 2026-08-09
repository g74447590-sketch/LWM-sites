import { EditorClient } from "@/components/editor-client";
import { AppError } from "@/lib/errors";
import { getProject } from "@/lib/projects";
import { requireUserId } from "@/lib/session";

export default async function EditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  let project;
  let message: string | null = null;
  try {
    project = await getProject(await requireUserId(), projectId);
  } catch (error) {
    message = error instanceof AppError ? error.message : "Não foi possível abrir o editor.";
  }
  if (message || !project) return <main className="centered-page"><section className="status-card"><h1>Editor indisponível</h1><p>{message}</p></section></main>;
  return <EditorClient project={project} />;
}
