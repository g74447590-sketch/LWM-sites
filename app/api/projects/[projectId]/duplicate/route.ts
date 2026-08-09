import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";
import { duplicateProject } from "@/lib/projects";
import { requireUserId } from "@/lib/session";

type Context = { params: Promise<{ projectId: string }> };

export async function POST(_: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    return NextResponse.json(await duplicateProject(await requireUserId(), projectId), { status: 201 });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível duplicar o projeto." }, { status: 500 });
  }
}
