import { describe, expect, it } from "vitest";
import { getPlan, isSubscriptionActive, subscriptionAccess } from "@/lib/plans";

describe("planos comerciais", () => {
  it("mantém os limites prometidos em cada plano", () => {
    expect(getPlan("launch")).toMatchObject({ monthlyPrice: 19, maxProjects: 1 });
    expect(getPlan("essential")).toMatchObject({ monthlyPrice: 29, maxProjects: 1 });
    expect(getPlan("professional")).toMatchObject({ monthlyPrice: 59, maxProjects: 5 });
  });

  it("libera o produto somente até a expiração da assinatura", () => {
    const now = new Date("2026-08-09T12:00:00.000Z");
    expect(isSubscriptionActive({ planKey: "trial", expiresAt: "2026-08-09T12:00:01.000Z" }, now)).toBe(true);
    expect(isSubscriptionActive({ planKey: "trial", expiresAt: "2026-08-09T12:00:00.000Z" }, now)).toBe(false);
    expect(subscriptionAccess({ planKey: "professional", expiresAt: "2026-08-01T00:00:00.000Z" }, now).maxProjects).toBe(0);
    expect(subscriptionAccess({ planKey: "professional", expiresAt: "2026-08-20T00:00:00.000Z" }, now).maxProjects).toBe(5);
  });
});
