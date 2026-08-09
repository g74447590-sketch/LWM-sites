import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";
import { publishProject, unpublishProject } from "@/lib/projects";
import { requireUserId } from "@/lib/session";

type Context = { params: Promise<{ projectId: string }> };

export async function POST(_: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    return NextResponse.json(await publishProject(await requireUserId(), projectId));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível publicar o projeto." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    return NextResponse.json(await unpublishProject(await requireUserId(), projectId));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível despublicar o projeto." }, { status: 500 });
  }
}
