import type { SitePurpose, SiteTemplateId } from "@/types";

export const pendingSiteRequestStorageKey = "lwm-pending-site-request";
export const pendingSitePurposeStorageKey = "lwm-pending-site-purpose";
export const minimumSiteRequestLength = 12;

export function inferTemplateFromRequest(request: string, purpose?: SitePurpose | null): SiteTemplateId {
  const normalized = request
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/(portfolio|portifolio|portafolio|creator|criador|influencer|ilustracao|ilustrador|artista|curriculo)/.test(normalized)) return "creator";
  if (/(loja|store|tienda|produto|produtos|vender|vendas|catalogo|catalogue)/.test(normalized)) return "store";
  if (/(barbear|barber|cabelo|corte de cabelo|peluquer)/.test(normalized)) return "barbershop";
  if (/(beleza|estetica|salao|salon|unhas|maquiagem|beauty|spa)/.test(normalized)) return "beauty";
  if (/(restaurante|restaurant|cafe|cafeteria|lanchonete|comida|cardapio|menu|food)/.test(normalized)) return "restaurant";
  return purpose === "personal" ? "creator" : "services";
}

export function readPendingSiteRequest(storage: Storage): string | null {
  const request = storage.getItem(pendingSiteRequestStorageKey)?.trim();
  return request && request.length >= minimumSiteRequestLength ? request : null;
}

export function readPendingSitePurpose(storage: Storage): SitePurpose | null {
  const purpose = storage.getItem(pendingSitePurposeStorageKey);
  return purpose === "personal" || purpose === "business" ? purpose : null;
}
