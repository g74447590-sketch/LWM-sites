import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";
import { createProject, listProjects } from "@/lib/projects";
import { requireUserId } from "@/lib/session";
import { siteProjectSchema } from "@/lib/validation";
import { createTemplateSite } from "@/lib/site-templates";
import { detectPromptLocale } from "@/lib/locale";

export async function GET() {
  try {
    return NextResponse.json(await listProjects(await requireUserId()));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível carregar os projetos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const input = siteProjectSchema.parse(await request.json());
    const generatedSite = createTemplateSite({
      templateId: input.templateId,
      businessName: input.businessName,
      whatsapp: input.whatsapp,
      locale: detectPromptLocale(input.description),
    });
    const project = await createProject(userId, input.businessName, input.description, generatedSite);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível criar o projeto." }, { status: 400 });
  }
}
