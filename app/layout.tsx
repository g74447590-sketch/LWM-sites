import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { LocaleProvider } from "@/components/locale-provider";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  applicationName: "LWM Sites",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "LWM Sites" },
  icons: { icon: "/lwm-sites-icon.svg", apple: "/lwm-sites-icon.svg" },
  title: "LWM Sites — Sites profissionais sem código",
  description: "Crie, edite e publique sites profissionais sem programar.",
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><LocaleProvider>{children}<PwaInstallPrompt /></LocaleProvider></body></html>;
}
