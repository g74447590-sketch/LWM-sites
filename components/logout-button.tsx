"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return <button className="button button-ghost" onClick={() => void signOut({ callbackUrl: "/" })}>Sair</button>;
}
