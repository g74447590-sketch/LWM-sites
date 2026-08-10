"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Logo } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/types";

const authCopy: Record<Locale, {
  registerTitle: string; loginTitle: string; registerDescription: string; loginDescription: string;
  name: string; email: string; password: string; confirmPassword: string; wait: string;
  register: string; login: string; forgotPassword: string; hasAccount: string; needsAccount: string;
  invalidCredentials: string; genericError: string; registerError: string;
}> = {
  "pt-BR": { registerTitle: "Crie sua conta", loginTitle: "Bem-vindo de volta", registerDescription: "Comece a criar sites sem escrever código.", loginDescription: "Entre para continuar seus projetos.", name: "Nome", email: "Email", password: "Senha", confirmPassword: "Confirme sua senha", wait: "Aguarde...", register: "Criar conta", login: "Entrar", forgotPassword: "Esqueci minha senha", hasAccount: "Já tem uma conta?", needsAccount: "Ainda não tem uma conta?", invalidCredentials: "Email ou senha incorretos, ou a autenticação ainda não foi configurada.", genericError: "Não foi possível continuar.", registerError: "Não foi possível criar sua conta." },
  en: { registerTitle: "Create your account", loginTitle: "Welcome back", registerDescription: "Start building sites without writing code.", loginDescription: "Log in to continue with your projects.", name: "Name", email: "Email", password: "Password", confirmPassword: "Confirm your password", wait: "Please wait...", register: "Create account", login: "Log in", forgotPassword: "Forgot your password?", hasAccount: "Already have an account?", needsAccount: "Don't have an account yet?", invalidCredentials: "Incorrect email or password, or authentication is not configured yet.", genericError: "We couldn't continue.", registerError: "We couldn't create your account." },
  es: { registerTitle: "Crea tu cuenta", loginTitle: "Bienvenido de nuevo", registerDescription: "Empieza a crear sitios sin escribir código.", loginDescription: "Inicia sesión para continuar con tus proyectos.", name: "Nombre", email: "Correo electrónico", password: "Contraseña", confirmPassword: "Confirma tu contraseña", wait: "Espera...", register: "Crear cuenta", login: "Entrar", forgotPassword: "¿Olvidaste tu contraseña?", hasAccount: "¿Ya tienes una cuenta?", needsAccount: "¿Aún no tienes una cuenta?", invalidCredentials: "Correo o contraseña incorrectos, o la autenticación aún no está configurada.", genericError: "No fue posible continuar.", registerError: "No fue posible crear tu cuenta." },
};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = authCopy[locale];
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isRegister = mode === "register";
  const requestedCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = requestedCallbackUrl?.startsWith("/") && !requestedCallbackUrl.startsWith("//") ? requestedCallbackUrl : "/dashboard";
  const alternateAuthUrl = `${isRegister ? "/login" : "/register"}?callbackUrl=${encodeURIComponent(callbackUrl)}`;

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
        if (!response.ok) throw new Error(payload.error || copy.registerError);
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error(copy.invalidCredentials);
      router.push(callbackUrl);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : copy.genericError);
    } finally {
      setBusy(false);
    }
  }

  return <main className="auth-page"><div className="auth-card"><Logo /><p className="eyebrow">BUILD WITHOUT CODE</p><h1>{isRegister ? copy.registerTitle : copy.loginTitle}</h1><p>{isRegister ? copy.registerDescription : copy.loginDescription}</p>
    <form onSubmit={onSubmit} className="stack-form">
      {isRegister && <label>{copy.name}<input required name="name" autoComplete="name" minLength={2} maxLength={80} /></label>}
      <label>{copy.email}<input required name="email" type="email" autoComplete="email" maxLength={254} /></label>
      <label>{copy.password}<input required name="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} minLength={12} maxLength={128} /></label>
      {isRegister && <label>{copy.confirmPassword}<input required name="confirmPassword" type="password" autoComplete="new-password" minLength={12} maxLength={128} /></label>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button disabled={busy} className="button button-primary" type="submit">{busy ? copy.wait : isRegister ? copy.register : copy.login}</button>
    </form>
    {!isRegister && <p className="auth-switch"><Link href="/forgot-password">{copy.forgotPassword}</Link></p>}
    <p className="auth-switch">{isRegister ? copy.hasAccount : copy.needsAccount} <Link href={alternateAuthUrl}>{isRegister ? copy.login : copy.register}</Link></p>
  </div></main>;
}
