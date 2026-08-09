import { AppError } from "@/lib/errors";
import { getServerSupabase } from "@/lib/supabase";

function clientIdentifier(headers: Headers | Record<string, unknown>) {
  const forwarded = headers instanceof Headers ? headers.get("x-forwarded-for") : String(headers["x-forwarded-for"] ?? "");
  const realIp = headers instanceof Headers ? headers.get("x-real-ip") : String(headers["x-real-ip"] ?? "");
  return (forwarded?.split(",")[0] || realIp || "unknown").trim();
}

export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const { data, error } = await getServerSupabase().rpc("consume_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw new AppError("Não foi possível validar o limite de tentativas.", 503, "RATE_LIMIT_UNAVAILABLE");
  if (!data) throw new AppError("Muitas tentativas. Aguarde alguns minutos e tente novamente.", 429, "RATE_LIMITED");
}

export async function enforceRequestRateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  await enforceRateLimit(`${scope}:${clientIdentifier(request.headers)}`, limit, windowSeconds);
}

export async function enforceAuthRateLimit(headers: Record<string, unknown> | undefined, email: string) {
  await enforceRateLimit(`login:${clientIdentifier(headers ?? {})}:${email.trim().toLowerCase()}`, 5, 15 * 60);
}
