export const planKeys = ["trial", "launch", "essential", "professional"] as const;

export type PlanKey = (typeof planKeys)[number];

export type PlanDefinition = {
  key: PlanKey;
  name: string;
  monthlyPrice: number;
  maxProjects: number;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const plans: Record<PlanKey, PlanDefinition> = {
  trial: { key: "trial", name: "Teste gratuito", monthlyPrice: 0, maxProjects: 1, description: "Sete dias para criar, editar e publicar o primeiro site.", features: ["1 site", "Editor visual completo", "Preview para celular"] },
  launch: { key: "launch", name: "Lançamento", monthlyPrice: 19, maxProjects: 1, description: "Entrada acessível para quem precisa colocar um negócio no ar.", features: ["1 projeto e site publicado", "Hospedagem LWM", "Subdomínio LWM", "Central de ajuda"] },
  essential: { key: "essential", name: "Essencial", monthlyPrice: 29, maxProjects: 1, description: "O plano principal para um negócio que quer vender pela internet.", features: ["1 projeto e site publicado", "Editor visual e imagens", "SEO básico e WhatsApp", "Atendimento prioritário"], highlighted: true },
  professional: { key: "professional", name: "Profissional", monthlyPrice: 59, maxProjects: 5, description: "Para quem cuida de vários negócios ou atende clientes.", features: ["Até 5 projetos e sites publicados", "Editor visual e imagens", "SEO básico e WhatsApp", "Atendimento prioritário"] },
};

export type Subscription = { planKey: PlanKey; expiresAt: string | null };

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && (planKeys as readonly string[]).includes(value);
}

export function getPlan(planKey: PlanKey): PlanDefinition { return plans[planKey]; }

export function isSubscriptionActive(subscription: Subscription, now = new Date()): boolean {
  if (!subscription.expiresAt) return false;
  const expiration = new Date(subscription.expiresAt);
  return !Number.isNaN(expiration.getTime()) && expiration.getTime() > now.getTime();
}

export function subscriptionAccess(subscription: Subscription, now = new Date()) {
  const active = isSubscriptionActive(subscription, now);
  return { active, plan: getPlan(subscription.planKey), maxProjects: active ? getPlan(subscription.planKey).maxProjects : 0 };
}
