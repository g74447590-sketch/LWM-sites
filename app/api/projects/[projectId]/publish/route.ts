import { NextResponse } from "next/server";
import { z } from "zod";
import { isAppError } from "@/lib/errors";
import { publishProject, unpublishProject } from "@/lib/projects";
import { requireUserId } from "@/lib/session";
import { publishProjectSchema } from "@/lib/validation";

type Context = { params: Promise<{ projectId: string }> };

export async function POST(request: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    publishProjectSchema.parse(await request.json());
    return NextResponse.json(await publishProject(await requireUserId(), projectId));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message ?? "Confirme a publicação." }, { status: 400 });
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
