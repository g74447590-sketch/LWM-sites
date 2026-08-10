import { describe, expect, it } from "vitest";
import { inferTemplateFromRequest, minimumSiteRequestLength, pendingSiteRequestStorageKey, readPendingSiteRequest } from "@/lib/pending-site-request";

describe("pedido inicial do site", () => {
  it("sugere um modelo coerente sem chamar IA externa", () => {
    expect(inferTemplateFromRequest("Quero um site para minha barbearia com horários")).toBe("barbershop");
    expect(inferTemplateFromRequest("A website for a beauty spa")).toBe("beauty");
    expect(inferTemplateFromRequest("Necesito un restaurante con menú")).toBe("restaurant");
    expect(inferTemplateFromRequest("Quero mostrar meus serviços de fotografia")).toBe("services");
  });

  it("recupera somente pedidos válidos do navegador", () => {
    const values = new Map<string, string>();
    const storage: Pick<Storage, "getItem"> = { getItem: (key) => values.get(key) ?? null };
    values.set(pendingSiteRequestStorageKey, "x".repeat(minimumSiteRequestLength));
    expect(readPendingSiteRequest(storage as Storage)).toHaveLength(minimumSiteRequestLength);
    values.set(pendingSiteRequestStorageKey, "curto");
    expect(readPendingSiteRequest(storage as Storage)).toBeNull();
  });
});
