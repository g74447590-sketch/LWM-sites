import { AppError } from "@/lib/errors";

function required(name: "SUPABASE_URL"): string {
  const value = process.env[name];
  if (!value) throw new AppError("O banco de dados ainda não foi configurado. Consulte .env.example e README.md.", 503, "DATABASE_NOT_CONFIGURED");
  return value;
}

export function getSupabaseConfig() {
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secretKey) throw new AppError("O banco de dados ainda não foi configurado. Defina SUPABASE_SECRET_KEY.", 503, "DATABASE_NOT_CONFIGURED");
  return { url: required("SUPABASE_URL"), serviceRoleKey: secretKey };
}

export function getPasswordResetEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.NEXTAUTH_URL;
  if (!apiKey || !from || !appUrl) throw new AppError("A recuperação de senha ainda não foi configurada. Defina RESEND_API_KEY, EMAIL_FROM e NEXTAUTH_URL.", 503, "EMAIL_NOT_CONFIGURED");
  return { apiKey, from, appUrl: appUrl.replace(/\/$/, "") };
}
