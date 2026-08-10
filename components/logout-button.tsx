"use client";

import { signOut } from "next-auth/react";
import { useLocale } from "@/components/locale-provider";

export function LogoutButton() {
  const { locale } = useLocale();
  const label = locale === "en" ? "Log out" : locale === "es" ? "Cerrar sesión" : "Sair";
  return <button className="button button-ghost" onClick={() => void signOut({ callbackUrl: "/" })}>{label}</button>;
}
