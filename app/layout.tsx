import type { Metadata } from "next";
import "@/app/globals.css";
import { LocaleProvider } from "@/components/locale-provider";

export const metadata: Metadata = {
  title: "LWM Sites — Sites profissionais sem código",
  description: "Crie, edite e publique sites profissionais sem programar.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
