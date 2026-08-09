"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/site-header";

function ResetCard({ children }: { children: React.ReactNode }) {
  return <main className="auth-page"><div className="auth-card"><Logo /><p className="eyebrow">ACCOUNT SECURITY</p>{children}</div></main>;
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/auth/password-reset/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível solicitar a recuperação.");
      setMessage(payload.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível solicitar a recuperação.");
    } finally {
      setBusy(false);
    }
  }
  return <ResetCard><h1>Recupere sua senha</h1><p>Enviaremos um link seguro para o seu email.</p><form className="stack-form" onSubmit={submit}><label>Email<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<button className="button button-primary" disabled={busy}>{busy ? "Enviando..." : "Enviar link"}</button></form><p className="auth-switch"><Link href="/login">Voltar ao login</Link></p></ResetCard>;
}

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(token ? null : "Link de recuperação inválido.");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: form.get("password"), confirmPassword: form.get("confirmPassword") }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível redefinir a senha.");
      router.push("/login?reset=1");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível redefinir a senha.");
    } finally {
      setBusy(false);
    }
  }
  return <ResetCard><h1>Crie uma nova senha</h1><p>Use 12 ou mais caracteres, com maiúscula, minúscula, número e símbolo.</p><form className="stack-form" onSubmit={submit}><label>Nova senha<input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={!token} /></label><label>Confirme a nova senha<input name="confirmPassword" type="password" autoComplete="new-password" required minLength={12} maxLength={128} disabled={!token} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={!token || busy}>{busy ? "Atualizando..." : "Atualizar senha"}</button></form></ResetCard>;
}
