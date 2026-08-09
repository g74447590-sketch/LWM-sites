import { AppError } from "@/lib/errors";
import { getPasswordResetEmailConfig } from "@/lib/env";

export async function sendPasswordResetEmail(recipient: string, token: string) {
  const config = getPasswordResetEmailConfig();
  const resetUrl = new URL("/reset-password", config.appUrl);
  resetUrl.searchParams.set("token", token);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: config.from,
      to: [recipient],
      subject: "Redefina sua senha da LWM AI",
      html: `<p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href="${resetUrl.toString()}">Redefinir senha</a></p><p>Este link expira em uma hora. Se você não solicitou a alteração, ignore este email.</p>`,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new AppError("Não foi possível enviar o email de recuperação.", 502, "EMAIL_UPSTREAM_ERROR");
}
