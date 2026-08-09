import { z } from "zod";
import { generatedSiteSchema } from "@/lib/site-schema";
import { siteTemplateIds } from "@/types";

export const passwordSchema = z.string().min(12, "A senha deve ter ao menos 12 caracteres.").max(128).regex(/[a-z]/, "A senha deve incluir letra minúscula.").regex(/[A-Z]/, "A senha deve incluir letra maiúscula.").regex(/[0-9]/, "A senha deve incluir número.").regex(/[^A-Za-z0-9]/, "A senha deve incluir símbolo.");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().email("Informe um email válido.").max(254),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { message: "As senhas não coincidem.", path: ["confirmPassword"] });

export const siteProjectSchema = z.object({
  description: z.string().trim().min(12, "Descreva o negócio com mais detalhes.").max(2000),
  businessName: z.string().trim().min(2, "Informe o nome do negócio.").max(100),
  templateId: z.enum(siteTemplateIds),
  whatsapp: z.string().trim().max(30).optional(),
});

export const updateProjectSchema = z.object({ name: z.string().trim().min(1).max(100).optional() });
export const saveSiteSchema = z.object({ site: generatedSiteSchema });
export const passwordResetRequestSchema = z.object({ email: z.string().trim().email("Informe um email válido.").max(254) });
export const passwordResetConfirmSchema = z.object({ token: z.string().length(64, "Link de recuperação inválido."), password: passwordSchema, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { message: "As senhas não coincidem.", path: ["confirmPassword"] });
