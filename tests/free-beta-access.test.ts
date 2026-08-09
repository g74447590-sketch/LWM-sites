import { describe, expect, it } from "vitest";
import { FREE_BETA_MAX_PROJECTS, freeBetaAccess } from "@/lib/access";

describe("acesso da beta gratuita", () => {
  it("não depende de assinatura ou data de expiração", () => {
    expect(freeBetaAccess).toEqual({ label: "Beta gratuita", maxProjects: 5 });
    expect(FREE_BETA_MAX_PROJECTS).toBe(5);
  });
});
