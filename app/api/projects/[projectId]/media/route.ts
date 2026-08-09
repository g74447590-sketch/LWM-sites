import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isAppError, AppError } from "@/lib/errors";
import { getProject } from "@/lib/projects";
import { enforceRequestRateLimit } from "@/lib/rate-limit";
import { requireUserId } from "@/lib/session";
import { getServerSupabase } from "@/lib/supabase";

type Context = { params: Promise<{ projectId: string }> };

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const maxImageBytes = 5 * 1024 * 1024;

export async function POST(request: Request, { params }: Context) {
  try {
    const { projectId } = await params;
    const userId = await requireUserId();
    await enforceRequestRateLimit(request, `media-upload:${userId}`, 20, 60 * 60);
    await getProject(userId, projectId);

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) throw new AppError("Selecione uma imagem para enviar.", 400, "INVALID_MEDIA");
    const extension = allowedTypes[file.type];
    if (!extension) throw new AppError("Use uma imagem JPG, PNG, WEBP ou GIF.", 400, "INVALID_MEDIA_TYPE");
    if (!file.size || file.size > maxImageBytes) throw new AppError("A imagem deve ter no máximo 5 MB.", 400, "MEDIA_TOO_LARGE");

    const path = `projects/${projectId}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await getServerSupabase().storage.from("site-media").upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (uploadError) throw new AppError(`Não foi possível enviar a imagem: ${uploadError.message}`, 503, "MEDIA_UPLOAD_FAILED");

    const { data } = getServerSupabase().storage.from("site-media").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível enviar a imagem." }, { status: 500 });
  }
}
