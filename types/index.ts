export const supportedLocales = ["pt-BR", "en", "es"] as const;

export type Locale = (typeof supportedLocales)[number];
export type ProjectStatus = "draft" | "generating" | "ready" | "error";
export const siteTemplateIds = ["barbershop", "beauty", "restaurant", "services"] as const;
export type SiteTemplateId = (typeof siteTemplateIds)[number];

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
  sections: Array<{
    id: string;
    title: string;
    body: string;
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
