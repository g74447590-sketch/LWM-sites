import type { GeneratedSite, Locale, SiteTemplateId } from "@/types";

export type SiteTemplate = {
  id: SiteTemplateId;
  name: string;
  description: string;
  icon: string;
  colors: { primary: string; accent: string };
};

export const siteTemplates: SiteTemplate[] = [
  { id: "barbershop", name: "Barbearia", description: "Serviços, valores e agendamento pelo WhatsApp.", icon: "✂", colors: { primary: "#17130E", accent: "#B97835" } },
  { id: "beauty", name: "Beleza & estética", description: "Tratamentos, resultados e reservas online.", icon: "✦", colors: { primary: "#4A1E45", accent: "#E07BB8" } },
  { id: "restaurant", name: "Restaurante & café", description: "Cardápio, horário e pedidos pelo WhatsApp.", icon: "☕", colors: { primary: "#263B2A", accent: "#D99B4B" } },
  { id: "services", name: "Serviços profissionais", description: "Proposta de valor, serviços e contato rápido.", icon: "◆", colors: { primary: "#162A4A", accent: "#4E9CD6" } },
];

type Item = [string, string, string?];
type Section = [string, string, Item[]];
type TemplateContent = { tagline: string; title: string; body: string; sections: Section[] };

const content: Record<Locale, Record<SiteTemplateId, TemplateContent>> = {
  "pt-BR": {
    barbershop: { tagline: "CUIDADO E ESTILO", title: "Seu estilo merece atenção.", body: "Cortes, barba e atendimento no seu ritmo.", sections: [["Serviços", "Escolha o cuidado ideal para você.", [["Corte clássico", "Precisão, acabamento e estilo.", "R$ 55"], ["Barba completa", "Toalha quente e finalização.", "R$ 40"], ["Combo corte + barba", "O visual completo em uma visita.", "R$ 85"]]], ["Por que escolher", "Uma experiência simples, pontual e personalizada.", [["Profissionais experientes", "Atendimento com atenção aos detalhes."], ["Ambiente acolhedor", "Um tempo seu, sem pressa."], ["Agendamento fácil", "Marque pelo WhatsApp em poucos cliques."]]]], },
    beauty: { tagline: "BELEZA COM PROPÓSITO", title: "Realce o que faz você única.", body: "Cuidados personalizados para você se sentir ainda melhor.", sections: [["Tratamentos", "Escolha seu momento de cuidado.", [["Limpeza de pele", "Leveza, renovação e luminosidade.", "R$ 120"], ["Design de sobrancelhas", "Harmonia para o seu olhar.", "R$ 45"], ["Massagem relaxante", "Pausa para corpo e mente.", "R$ 150"]]], ["Seu momento", "Atendimento pensado para respeitar o seu tempo.", [["Avaliação individual", "Entendemos o que você precisa."], ["Produtos selecionados", "Cuidado em cada etapa."], ["Reserva prática", "Agende pelo WhatsApp."]]]], },
    restaurant: { tagline: "SABOR QUE ACOLHE", title: "Uma pausa gostosa no seu dia.", body: "Receitas preparadas com carinho, ingredientes frescos e boas conversas.", sections: [["Cardápio", "Favoritos da casa preparados na hora.", [["Café especial", "Grãos selecionados e extração cuidadosa.", "R$ 12"], ["Brunch da casa", "Pão artesanal, ovos e acompanhamentos.", "R$ 38"], ["Bolo do dia", "Receita fresca para acompanhar seu café.", "R$ 16"]]], ["Visite a casa", "Um espaço para encontrar, trabalhar e aproveitar.", [["Ingredientes frescos", "Sabor de verdade em cada receita."], ["Ambiente acolhedor", "Conforto para sua rotina."], ["Pedidos rápidos", "Peça ou reserve pelo WhatsApp."]]]], },
    services: { tagline: "SOLUÇÕES QUE MOVEM", title: "O parceiro certo para o seu próximo passo.", body: "Serviços profissionais com clareza, atenção e resultado.", sections: [["Como podemos ajudar", "Escolha o serviço ideal para sua necessidade.", [["Consultoria", "Diagnóstico claro e orientação prática."], ["Projeto personalizado", "Solução construída para o seu contexto."], ["Acompanhamento", "Suporte em cada etapa do trabalho."]]], ["Nosso compromisso", "Relação direta, processo transparente e entrega consistente.", [["Atendimento próximo", "Você fala com quem resolve."], ["Prazo combinado", "Planejamento e comunicação clara."], ["Orçamento objetivo", "Sem surpresa no caminho."]]]], },
  },
  en: {
    barbershop: { tagline: "CARE AND STYLE", title: "Your style deserves attention.", body: "Haircuts, beard care and service at your pace.", sections: [["Services", "Choose the care that suits you.", [["Classic haircut", "Precision, finish and style.", "$ 55"], ["Full beard", "Hot towel and finishing.", "$ 40"], ["Haircut + beard", "A complete look in one visit.", "$ 85"]]], ["Why choose us", "A personal, punctual and simple experience.", [["Experienced team", "Attention to every detail."], ["Welcoming space", "Your time, with no rush."], ["Easy booking", "Book on WhatsApp in a few taps."]]]], },
    beauty: { tagline: "BEAUTY WITH PURPOSE", title: "Bring out what makes you unique.", body: "Personalized care to help you feel even better.", sections: [["Treatments", "Choose your moment of care.", [["Facial cleansing", "Freshness, renewal and glow.", "$ 120"], ["Brow design", "Harmony for your look.", "$ 45"], ["Relaxing massage", "A pause for body and mind.", "$ 150"]]], ["Your moment", "Service designed around your time.", [["Individual consultation", "We learn what you need."], ["Selected products", "Care at every step."], ["Easy booking", "Book on WhatsApp."]]]], },
    restaurant: { tagline: "FLAVOR THAT WELCOMES", title: "A delicious break in your day.", body: "Recipes made with care, fresh ingredients and good conversation.", sections: [["Menu", "House favorites prepared to order.", [["Specialty coffee", "Selected beans and careful brewing.", "$ 12"], ["House brunch", "Artisan bread, eggs and sides.", "$ 38"], ["Cake of the day", "Freshly baked for your coffee.", "$ 16"]]], ["Visit us", "A space to meet, work and enjoy.", [["Fresh ingredients", "Real flavor in every recipe."], ["Welcoming space", "Comfort for your routine."], ["Quick orders", "Order or reserve on WhatsApp."]]]], },
    services: { tagline: "SOLUTIONS THAT MOVE", title: "The right partner for your next step.", body: "Professional services with clarity, care and results.", sections: [["How we help", "Choose the service that fits your needs.", [["Consulting", "Clear diagnosis and practical direction."], ["Custom project", "A solution built for your situation."], ["Ongoing support", "Support in every stage of the work."]]], ["Our commitment", "Direct relationship, transparent process and consistent delivery.", [["Close support", "You talk to the people who solve."], ["Agreed timelines", "Clear planning and communication."], ["Straightforward pricing", "No surprises along the way."]]]], },
  },
  es: {
    barbershop: { tagline: "CUIDADO Y ESTILO", title: "Tu estilo merece atención.", body: "Cortes, barba y atención a tu ritmo.", sections: [["Servicios", "Elige el cuidado ideal para ti.", [["Corte clásico", "Precisión, acabado y estilo.", "$ 55"], ["Barba completa", "Toalla caliente y acabado.", "$ 40"], ["Corte + barba", "El look completo en una visita.", "$ 85"]]], ["Por qué elegirnos", "Una experiencia personal, puntual y sencilla.", [["Equipo experimentado", "Atención a cada detalle."], ["Espacio acogedor", "Tu tiempo, sin prisa."], ["Reserva fácil", "Reserva por WhatsApp."]]]], },
    beauty: { tagline: "BELLEZA CON PROPÓSITO", title: "Resalta lo que te hace única.", body: "Cuidado personalizado para que te sientas aún mejor.", sections: [["Tratamientos", "Elige tu momento de cuidado.", [["Limpieza facial", "Frescura, renovación y luz.", "$ 120"], ["Diseño de cejas", "Armonía para tu mirada.", "$ 45"], ["Masaje relajante", "Una pausa para cuerpo y mente.", "$ 150"]]], ["Tu momento", "Atención pensada para tu tiempo.", [["Evaluación individual", "Entendemos lo que necesitas."], ["Productos seleccionados", "Cuidado en cada etapa."], ["Reserva práctica", "Reserva por WhatsApp."]]]], },
    restaurant: { tagline: "SABOR QUE ACOGE", title: "Una pausa deliciosa en tu día.", body: "Recetas hechas con cariño, ingredientes frescos y buenas conversaciones.", sections: [["Menú", "Favoritos de la casa preparados al momento.", [["Café especial", "Granos seleccionados y preparación cuidadosa.", "$ 12"], ["Brunch de la casa", "Pan artesanal, huevos y acompañamientos.", "$ 38"], ["Pastel del día", "Recién hecho para tu café.", "$ 16"]]], ["Visítanos", "Un espacio para encontrarte, trabajar y disfrutar.", [["Ingredientes frescos", "Sabor real en cada receta."], ["Espacio acogedor", "Comodidad para tu rutina."], ["Pedidos rápidos", "Pide o reserva por WhatsApp."]]]], },
    services: { tagline: "SOLUCIONES QUE AVANZAN", title: "El aliado correcto para tu próximo paso.", body: "Servicios profesionales con claridad, cuidado y resultados.", sections: [["Cómo ayudamos", "Elige el servicio ideal para tu necesidad.", [["Consultoría", "Diagnóstico claro y orientación práctica."], ["Proyecto personalizado", "Una solución para tu contexto."], ["Acompañamiento", "Apoyo en cada etapa del trabajo."]]], ["Nuestro compromiso", "Relación directa, proceso transparente y entrega consistente.", [["Atención cercana", "Hablas con quien resuelve."], ["Plazo acordado", "Planificación y comunicación clara."], ["Presupuesto objetivo", "Sin sorpresas en el camino."]]]], },
  },
};

function contactHref(whatsapp?: string) {
  const digits = whatsapp?.replace(/\D/g, "") ?? "";
  return digits.length >= 10 && digits.length <= 15 ? `https://wa.me/${digits}` : "#contato";
}

export function createTemplateSite(input: { templateId: SiteTemplateId; businessName: string; whatsapp?: string; locale: Locale }): GeneratedSite {
  const template = siteTemplates.find((item) => item.id === input.templateId);
  if (!template) throw new Error("Modelo de site inválido.");
  const copy = content[input.locale][input.templateId];
  const ctaLabel = input.whatsapp?.replace(/\D/g, "").length ? input.locale === "en" ? "Message on WhatsApp" : input.locale === "es" ? "Hablar por WhatsApp" : "Falar no WhatsApp" : input.locale === "en" ? "Get in touch" : input.locale === "es" ? "Contáctanos" : "Entre em contato";
  return { language: input.locale, businessName: input.businessName.trim(), tagline: copy.tagline, primaryColor: template.colors.primary, accentColor: template.colors.accent, heroTitle: copy.title, heroBody: copy.body, ctaLabel, ctaHref: contactHref(input.whatsapp), templateId: input.templateId, fontFamily: "serif", heroStyle: "gradient", contentStyle: "cards", buttonStyle: "rounded", sections: copy.sections.map(([title, body, items], index) => ({ id: `${input.templateId}-${index + 1}`, title, body, items: items.map(([itemTitle, description, price]) => ({ title: itemTitle, description, ...(price ? { price } : {}) })) })) };
}
