import "server-only";

import { AppError } from "@/lib/errors";
import { getServerSupabase } from "@/lib/supabase";

export const publishTokenCost = 1;
export const welcomePublishTokens = 2;

export type PublishCreditStatus = {
  enabled: boolean;
  publishTokenCost: number;
  balance: number | null;
};

export function isTokenBillingEnabled() {
  return process.env.LWM_TOKEN_BILLING_ENABLED === "true";
}

function billingError(message: string) {
  return new AppError(`Não foi possível consultar os tokens: ${message}`, 503, "TOKEN_CONFIGURATION_ERROR");
}

export async function getPublishCreditStatus(userId: string): Promise<PublishCreditStatus> {
  if (!isTokenBillingEnabled()) return { enabled: false, publishTokenCost, balance: null };

  const supabase = getServerSupabase();
  const { error: createError } = await supabase
    .from("user_credits")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  if (createError) throw billingError(createError.message);

  const { data, error } = await supabase
    .from("user_credits")
    .select("publish_tokens")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) throw billingError(error?.message ?? "saldo não encontrado");
  const balance = Number((data as { publish_tokens: unknown }).publish_tokens);
  if (!Number.isInteger(balance) || balance < 0) throw billingError("saldo inválido");
  return { enabled: true, publishTokenCost, balance };
}
