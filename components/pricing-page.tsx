import Link from "next/link";
import { plans } from "@/lib/plans";
import { SiteHeader } from "@/components/site-header";

const checkoutStart = "/register?callbackUrl=%2Fcreate";

const competitors = [
  { product: "LWM Sites", ideal: "Pequenos negócios brasileiros que precisam vender online.", pricing: "Preço em reais, sem créditos por uso.", learning: "Editor visual direto, com WhatsApp e modelos de negócio." },
  { product: "Lovable", ideal: "Quem também quer construir aplicativos por conversa.", pricing: "Uso baseado em créditos e recursos de IA.", learning: "Mais flexível, mas exige decidir prompts, créditos e estrutura do app." },
  { product: "Webflow", ideal: "Designers e equipes que precisam de controle avançado.", pricing: "Planos por site, normalmente cobrados em dólar.", learning: "Muito poderoso, porém com curva de aprendizado maior." },
  { product: "Wix e Squarespace", ideal: "Sites institucionais genéricos e portfólios.", pricing: "Planos por site; domínio próprio depende de plano pago.", learning: "Fáceis de iniciar, mas menos focados no fluxo brasileiro de WhatsApp." },
];

export function PricingPage() {
  const paidPlans = [plans.launch, plans.essential, plans.professional];
  return <>
    <SiteHeader />
    <main className="plans-page">
      <section className="plans-hero"><p className="eyebrow">PLANOS LWM SITES</p><h1>Preço simples para colocar negócios locais na internet.</h1><p>Sem créditos, sem cobrança em dólar e sem forçar recursos de IA que seu cliente não precisa usar.</p><Link className="button button-primary" href={checkoutStart}>Testar por 7 dias grátis</Link><small>Sem cartão no teste. Você pode cancelar antes de contratar.</small></section>
      <section className="pricing-grid" aria-label="Planos mensais">{paidPlans.map((plan) => <article className={`pricing-card ${plan.highlighted ? "is-highlighted" : ""}`} key={plan.key}>{plan.highlighted && <span className="pricing-badge">MAIS INDICADO</span>}<h2>{plan.name}</h2><p>{plan.description}</p><p className="price"><strong>R$ {plan.monthlyPrice}</strong><span>/mês</span></p>{plan.key === "launch" && <small className="pricing-note">Valor de lançamento válido por 12 meses.</small>}<ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><Link className={`button ${plan.highlighted ? "button-primary" : "button-ghost"}`} href={checkoutStart}>Começar teste grátis</Link></article>)}</section>
      <section className="pricing-explainer" aria-labelledby="pricing-explainer-title"><p className="eyebrow">COMO FUNCIONA</p><h2 id="pricing-explainer-title">Você testa o produto de verdade antes de pagar.</h2><div><article><b>1</b><h3>Crie a conta</h3><p>O teste libera um projeto e todos os recursos essenciais do editor por sete dias.</p></article><article><b>2</b><h3>Monte e publique</h3><p>Edite textos, cores, imagens, SEO e revise em desktop, tablet e celular.</p></article><article><b>3</b><h3>Ative o plano</h3><p>Após o pagamento, a assinatura é ativada pelo provedor de cobrança e mantém o site publicado.</p></article></div></section>
      <section className="comparison" aria-labelledby="comparison-title"><p className="eyebrow">POSICIONAMENTO</p><h2 id="comparison-title">Onde a LWM Sites compete — e onde não compete.</h2><p className="comparison-intro">A LWM não tenta substituir plataformas de aplicações complexas. Ela existe para quem quer um site bonito, vendável e fácil de manter.</p><div className="comparison-table-wrap"><table><thead><tr><th>Produto</th><th>Melhor para</th><th>Modelo de cobrança</th><th>Experiência</th></tr></thead><tbody>{competitors.map((competitor) => <tr key={competitor.product}><th scope="row">{competitor.product}</th><td>{competitor.ideal}</td><td>{competitor.pricing}</td><td>{competitor.learning}</td></tr>)}</tbody></table></div><p className="comparison-note">Comparação de posicionamento. Preços e condições de produtos concorrentes podem mudar.</p></section>
      <section className="pricing-faq" aria-labelledby="faq-title"><p className="eyebrow">DÚVIDAS FREQUENTES</p><h2 id="faq-title">Antes de contratar</h2><details><summary>O domínio está incluído?</summary><p>Não. O domínio é registrado em seu nome e cobrado separadamente pelo registrador. A LWM faz a conexão quando esse recurso estiver ativado no plano contratado.</p></details><details><summary>Posso cancelar?</summary><p>Sim. Sem fidelidade. O acesso permanece até o fim do período já pago; depois, novos ajustes e a publicação ficam suspensos.</p></details><details><summary>Por que não há IA no preço?</summary><p>O foco é um editor visual previsível. Assim, o custo não aumenta conforme prompts ou créditos de IA são consumidos.</p></details></section>
      <section className="pricing-closing"><p className="eyebrow">COMECE PELO PRIMEIRO SITE</p><h2>Seu cliente não precisa de um app complicado. Precisa ser encontrado e chamado no WhatsApp.</h2><Link className="button button-primary" href={checkoutStart}>Criar meu site grátis</Link></section>
    </main>
    <footer>LWM SITES — SITES SEM CÓDIGO</footer>
  </>;
}
