export const supportedLocales = ["pt-BR", "en", "es"] as const;

export type Locale = (typeof supportedLocales)[number];
export type ProjectStatus = "draft" | "generating" | "ready" | "error";
export const siteTemplateIds = ["barbershop", "beauty", "restaurant", "services"] as const;
export type SiteTemplateId = (typeof siteTemplateIds)[number];
export type SiteFont = "sans" | "serif" | "display";
export type HeroStyle = "gradient" | "solid" | "split";
export type ContentStyle = "cards" | "minimal" | "outlined";
export type ButtonStyle = "rounded" | "square" | "pill";
export type SectionLayout = "cards" | "list" | "banner" | "faq";

export type GeneratedSite = {
  language: Locale;
  businessName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroBody: string;
  ctaLabel: string;
  ctaHref?: string;
  templateId?: SiteTemplateId;
  fontFamily?: SiteFont;
  heroStyle?: HeroStyle;
  contentStyle?: ContentStyle;
  buttonStyle?: ButtonStyle;
  sections: Array<{
    id: string;
    title: string;
    body: string;
    layout?: SectionLayout;
    hidden?: boolean;
    imageUrl?: string;
    items: Array<{ title: string; description: string; price?: string }>;
  }>;
};

export type Project = {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  generatedSite: GeneratedSite | null;
  slug: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMessage = {
  id: string;
  projectId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
