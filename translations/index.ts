import type { Locale } from "@/types";

const messages = {
  "pt-BR": {
    nav: { product: "Produto", how: "Como funciona", projects: "Meus projetos", login: "Entrar", start: "Criar meu site" },
    hero: { eyebrow: "SITES SEM CÓDIGO", title: "Seu site profissional. Do seu jeito.", body: "Escolha um modelo, personalize cada detalhe e publique sem precisar programar.", primary: "Criar meu site", secondary: "Ver como funciona" },
    benefits: ["Modelos prontos", "Sem programação", "Edição visual", "Visualização responsiva", "Botão de WhatsApp", "Projetos salvos"],
    howTitle: "Do modelo ao site publicado, sem complicação.",
    steps: ["Escolha um modelo para você ou para um negócio.", "Personalize textos, cores, imagens e contatos.", "Revise em computador, tablet e celular.", "Publique e compartilhe seu link."],
    footer: "LWM SITES — SITES SEM CÓDIGO",
    create: { title: "Crie seu site", subtitle: "Escolha uma base pronta e personalize para você ou para um negócio.", placeholder: "Conte em poucas palavras o que o site deve mostrar e para quem ele foi feito.", button: "Criar site", loading: "Criando site..." },
    editor: { preview: "Visualização", desktop: "Computador", tablet: "Tablet", mobile: "Celular" },
  },
  en: {
    nav: { product: "Product", how: "How it works", projects: "My projects", login: "Log in", start: "Create my site" },
    hero: { eyebrow: "NO-CODE WEBSITES", title: "Your professional site. Your way.", body: "Choose a template, tailor every detail and publish without writing code.", primary: "Create my site", secondary: "See how it works" },
    benefits: ["Ready-made templates", "No coding", "Visual editing", "Responsive preview", "WhatsApp button", "Saved projects"],
    howTitle: "From template to published site, without the hassle.",
    steps: ["Choose a template for your business.", "Customize copy, colors and contacts.", "Review on desktop, tablet and mobile.", "Publish and share your link."],
    footer: "LWM SITES — NO-CODE WEBSITES",
    create: { title: "Create your website", subtitle: "Choose a professional base and tailor it to your business.", placeholder: "Briefly describe what your business offers, who it serves and what makes it different.", button: "Create website", loading: "Creating website..." },
    editor: { preview: "Preview", desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" },
  },
  es: {
    nav: { product: "Producto", how: "Cómo funciona", projects: "Mis proyectos", login: "Entrar", start: "Crear mi sitio" },
    hero: { eyebrow: "SITIOS SIN CÓDIGO", title: "Tu sitio profesional. A tu manera.", body: "Elige un modelo, personaliza cada detalle y publica sin programar.", primary: "Crear mi sitio", secondary: "Ver cómo funciona" },
    benefits: ["Modelos listos", "Sin programación", "Edición visual", "Vista adaptable", "Botón de WhatsApp", "Proyectos guardados"],
    howTitle: "Del modelo al sitio publicado, sin complicaciones.",
    steps: ["Elige un modelo para tu negocio.", "Personaliza textos, colores y contactos.", "Revisa en escritorio, tableta y móvil.", "Publica y comparte tu enlace."],
    footer: "LWM SITES — SITIOS SIN CÓDIGO",
    create: { title: "Crea tu sitio", subtitle: "Elige una base profesional y personalízala para tu negocio.", placeholder: "Cuéntanos brevemente qué ofrece tu negocio, para quién y cuál es su diferencial.", button: "Crear sitio", loading: "Creando sitio..." },
    editor: { preview: "Vista previa", desktop: "Escritorio", tablet: "Tableta", mobile: "Móvil" },
  },
} as const;

export type Messages = (typeof messages)[Locale];
export { messages };
