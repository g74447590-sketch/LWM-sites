import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export function PricingPage() {
  return <>
    <SiteHeader />
    <main className="plans-page">
      <section className="plans-hero">
        <p className="eyebrow">BETA GRATUITA</p>
        <h1>Crie e publique sites sem cobrança durante a beta.</h1>
        <p>A LWM Sites está aberta para testes reais com pequenos negócios. Não pedimos cartão, assinatura, créditos de IA ou pagamento por Pix.</p>
        <Link className="button button-primary" href="/register?callbackUrl=%2Fcreate">Criar meu site grátis</Link>
        <small>Até 5 projetos por conta para manter a beta estável.</small>
      </section>

      <section className="pricing-explainer" aria-labelledby="beta-how-title">
        <p className="eyebrow">COMO FUNCIONA</p>
        <h2 id="beta-how-title">Use o produto, mostre para negócios reais e ajude a melhorar.</h2>
        <div>
          <article><b>1</b><h3>Crie</h3><p>Escolha um modelo e monte o site com textos, imagens, cores e botão de WhatsApp.</p></article>
          <article><b>2</b><h3>Publique</h3><p>Revise em computador e celular, publique e compartilhe o endereço com quem precisa conhecer o negócio.</p></article>
          <article><b>3</b><h3>Conte o resultado</h3><p>A beta não cobra. O objetivo é descobrir quais recursos realmente ajudam os pequenos negócios.</p></article>
        </div>
      </section>

      <section className="pricing-faq" aria-labelledby="beta-faq-title">
        <h2 id="beta-faq-title">Perguntas rápidas</h2>
        <details><summary>Há pagamento ou assinatura?</summary><p>Não. A versão web está gratuita durante a beta e não possui checkout ativo.</p></details>
        <details><summary>Preciso de token de IA?</summary><p>Não. Os modelos e o editor visual funcionam sem uma API de IA paga.</p></details>
        <details><summary>E a App Store?</summary><p>Uma versão para App Store exigirá um aplicativo nativo e uma conta Apple Developer de um responsável. Isso é uma etapa futura e não muda a beta web.</p></details>
      </section>

      <section className="pricing-closing">
        <p className="eyebrow">PRONTO PARA TESTAR?</p>
        <h2>Transforme uma ideia em um site publicável.</h2>
        <Link className="button button-primary" href="/register?callbackUrl=%2Fcreate">Começar grátis</Link>
      </section>
    </main>
  </>;
}
