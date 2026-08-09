"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/site-header";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    try {
      if (isRegister) {
        const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email, password, confirmPassword: form.get("confirmPassword") }) });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Não foi possível criar sua conta.");
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Email ou senha incorretos, ou a autenticação ainda não foi configurada.");
      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível continuar.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-page"><div className="auth-card"><Logo /><p className="eyebrow">BUILD WITHOUT CODE</p><h1>{isRegister ? "Crie sua conta" : "Bem-vindo de volta"}</h1><p>{isRegister ? "Comece a criar sites sem escrever código." : "Entre para continuar seus projetos."}</p>
    <form onSubmit={onSubmit} className="stack-form">
      {isRegister && <label>Nome<input required name="name" autoComplete="name" minLength={2} maxLength={80} /></label>}
      <label>Email<input required name="email" type="email" autoComplete="email" maxLength={254} /></label>
      <label>Senha<input required name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={12} maxLength={128} /></label>
      {isRegister && <label>Confirme sua senha<input required name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button disabled={busy} className="button button-primary" type="submit">{busy ? "Aguarde..." : isRegister ? "Criar conta" : "Entrar"}</button>
    </form>
    {!isRegister && <p className="auth-switch"><Link href="/forgot-password">Esqueci minha senha</Link></p>}
    <p className="auth-switch">{isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"} <Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Entrar" : "Criar conta"}</Link></p>
  </div></main>;
}
