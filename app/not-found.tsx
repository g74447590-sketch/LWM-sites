import Link from "next/link";

export default function NotFound() {
  return <main className="centered-page">
    <section className="status-card">
      <p className="eyebrow">PÁGINA NÃO ENCONTRADA</p>
      <h1>Este endereço não existe ou não está publicado.</h1>
      <p>Confira o link ou volte para o LWM Sites para criar e publicar um projeto.</p>
      <Link className="button button-primary" href="/">Ir para o início</Link>
    </section>
  </main>;
}
