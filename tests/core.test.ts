import { describe, expect, it } from "vitest";
import { detectLocale, detectPromptLocale } from "@/lib/locale";
import { parseGeneratedSite } from "@/lib/site-schema";
import { createTemplateSite, siteTemplates } from "@/lib/site-templates";
import { passwordSchema, registerSchema, siteProjectSchema } from "@/lib/validation";

describe("internacionalização", () => {
  it("prioriza português, espanhol e inglês como fallback", () => {
    expect(detectLocale("pt-PT")).toBe("pt-BR");
    expect(detectLocale("es-MX")).toBe("es");
    expect(detectLocale("fr-FR")).toBe("en");
  });
  it("detecta a linguagem predominante da descrição", () => {
    expect(detectPromptLocale("Quero uma página para uma barbearia")).toBe("pt-BR");
    expect(detectPromptLocale("Crea un sitio para una tienda")).toBe("es");
    expect(detectPromptLocale("Create a website for a gym")).toBe("en");
  });
});

describe("modelos de sites", () => {
  it("cria uma especificação segura e completa para cada modelo", () => {
    for (const template of siteTemplates) {
      const site = createTemplateSite({ templateId: template.id, businessName: "Negócio Exemplo", whatsapp: "55 11 99999-9999", locale: "pt-BR" });
      expect(parseGeneratedSite(site)).toEqual(site);
      expect(site.ctaHref).toBe("https://wa.me/5511999999999");
      expect(site.sections.length).toBeGreaterThan(0);
    }
  });
  it("usa um link interno seguro quando não há WhatsApp", () => {
    const site = createTemplateSite({ templateId: "services", businessName: "Oficina Norte", locale: "pt-BR" });
    expect(site.ctaHref).toBe("#contato");
    expect(() => parseGeneratedSite({ ...site, ctaHref: "javascript:alert(1)" })).toThrow();
  });
});

describe("validação de entrada", () => {
  it("rejeita cadastros com senha curta ou confirmação diferente", () => {
    expect(registerSchema.safeParse({ name: "Ana", email: "ana@example.com", password: "curta", confirmPassword: "outra" }).success).toBe(false);
  });
  it("exige senhas fortes", () => {
    expect(passwordSchema.safeParse("senhafraca123").success).toBe(false);
    expect(passwordSchema.safeParse("SenhaSegura#2026").success).toBe(true);
  });
  it("exige modelo, nome e contexto mínimo para criar um site", () => {
    expect(siteProjectSchema.safeParse({ description: "curto", businessName: "A", templateId: "services" }).success).toBe(false);
    expect(siteProjectSchema.safeParse({ description: "Atendimento residencial para empresas e famílias.", businessName: "Serviços Norte", templateId: "services" }).success).toBe(true);
  });
});
