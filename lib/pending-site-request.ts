import type { SiteTemplateId } from "@/types";

export const pendingSiteRequestStorageKey = "lwm-pending-site-request";
export const minimumSiteRequestLength = 12;

export function inferTemplateFromRequest(request: string): SiteTemplateId {
  const normalized = request
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (/(barbear|barber|cabelo|corte de cabelo|peluquer)/.test(normalized)) return "barbershop";
  if (/(beleza|estetica|salao|salon|unhas|maquiagem|beauty|spa)/.test(normalized)) return "beauty";
  if (/(restaurante|restaurant|cafe|cafeteria|lanchonete|comida|cardapio|menu|food)/.test(normalized)) return "restaurant";
  return "services";
}

export function readPendingSiteRequest(storage: Storage): string | null {
  const request = storage.getItem(pendingSiteRequestStorageKey)?.trim();
  return request && request.length >= minimumSiteRequestLength ? request : null;
}
