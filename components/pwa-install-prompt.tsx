"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isAppleMobileDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isStandaloneMode() {
  return window.matchMedia("(display-mode: standalone)").matches
    || Boolean((navigator as NavigatorWithStandalone).standalone);
}

export function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [showAppleInstructions, setShowAppleInstructions] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);

    const appleInstructionTimer = isAppleMobileDevice() && !isStandaloneMode() && sessionStorage.getItem("lwm-sites-ios-install-dismissed") !== "true"
      ? window.setTimeout(() => setShowAppleInstructions(true), 0)
      : undefined;

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      if (appleInstructionTimer) window.clearTimeout(appleInstructionTimer);
    };
  }, []);

  function dismissAppleInstructions() {
    sessionStorage.setItem("lwm-sites-ios-install-dismissed", "true");
    setShowAppleInstructions(false);
  }

  if (showAppleInstructions) {
    return <aside className="pwa-install" role="status" aria-label="Como instalar o LWM Sites no iPhone">
      <div><b>Use como aplicativo</b><span>No iPhone ou iPad, toque em Compartilhar e depois em “Adicionar à Tela de Início”.</span></div>
      <button className="pwa-dismiss" type="button" onClick={dismissAppleInstructions} aria-label="Fechar instruções de instalação">Agora não</button>
    </aside>;
  }

  if (!prompt) return null;
  const installPrompt = prompt;

  async function install() {
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setPrompt(null);
  }

  return <aside className="pwa-install" aria-label="Instalar aplicativo">
    <div><b>Instale o LWM Sites</b><span>Use como aplicativo na tela inicial do celular.</span></div>
    <button type="button" onClick={install}>Instalar</button>
  </aside>;
}
