import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";
import { deleteProject, getProject, saveGeneratedSite, updateProjectName } from "@/lib/projects";
import { requireUserId } from "@/lib/session";
import { saveSiteSchema, updateProjectSchema } from "@/lib/validation";

type Context = { params: Promise<{ projectId: string }> };

export async function GET(_: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    return NextResponse.json(await getProject(await requireUserId(), projectId));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível carregar o projeto." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    const payload = await request.json();
    if (payload.site) {
      const input = saveSiteSchema.parse(payload);
      return NextResponse.json(await saveGeneratedSite(await requireUserId(), projectId, input.site));
    }
    const input = updateProjectSchema.parse(payload);
    if (!input.name) return NextResponse.json({ error: "Nenhuma alteração enviada." }, { status: 400 });
    return NextResponse.json(await updateProjectName(await requireUserId(), projectId, input.name));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível atualizar o projeto." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    await deleteProject(await requireUserId(), projectId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível excluir o projeto." }, { status: 500 });
  }
}
