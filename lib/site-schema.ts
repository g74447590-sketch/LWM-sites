import { z } from "zod";
import { siteTemplateIds, type GeneratedSite } from "@/types";

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a cor hexadecimal #RRGGBB.");
const safeHref = z.string().trim().max(500).refine((value) => value === "#contato" || /^(https?:\/\/|mailto:|tel:)/i.test(value), "Use um link seguro.");

export const generatedSiteSchema = z.object({
  language: z.enum(["pt-BR", "en", "es"]),
  businessName: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(120),
  primaryColor: hexColor,
  accentColor: hexColor,
  heroTitle: z.string().trim().min(1).max(120),
  heroBody: z.string().trim().min(1).max(320),
  ctaLabel: z.string().trim().min(1).max(40),
  ctaHref: safeHref.optional(),
  templateId: z.enum(siteTemplateIds).optional(),
  fontFamily: z.enum(["sans", "serif", "display"]).optional(),
  heroStyle: z.enum(["gradient", "solid", "split"]).optional(),
  contentStyle: z.enum(["cards", "minimal", "outlined"]).optional(),
  buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
  sections: z
    .array(
      z.object({
        id: z.string().regex(/^[a-z0-9-]+$/).max(40),
        title: z.string().trim().min(1).max(80),
        body: z.string().trim().min(1).max(240),
        items: z.array(
          z.object({
            title: z.string().trim().min(1).max(80),
            description: z.string().trim().min(1).max(200),
            price: z.string().trim().max(40).optional(),
          }),
        ).max(6),
      }),
    )
    .min(1)
    .max(8),
});

export function parseGeneratedSite(value: unknown): GeneratedSite {
  return generatedSiteSchema.parse(value);
}
