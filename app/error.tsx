"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="centered-page">
    <section className="status-card">
      <p className="eyebrow">OCORREU UM PROBLEMA</p>
      <h1>Não foi possível concluir esta ação.</h1>
      <p>Tente novamente. Se o problema persistir, volte para o início e verifique sua conexão.</p>
      <div className="status-actions"><button className="button button-primary" type="button" onClick={reset}>Tentar novamente</button><Link className="button button-ghost" href="/">Ir para o início</Link></div>
    </section>
  </main>;
}
