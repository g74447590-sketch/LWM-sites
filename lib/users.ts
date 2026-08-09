import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { AppError } from "@/lib/errors";
import { getServerSupabase } from "@/lib/supabase";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
};

type PasswordResetTokenRow = { id: string; user_id: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
function userError(message: string) {
  return new AppError(`Não foi possível acessar os usuários: ${message}`, 500, "DATABASE_ERROR");
}

export async function createUser(input: { name: string; email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const { data, error } = await getServerSupabase()
    .from("users")
    .insert({ name: input.name.trim(), email, password_hash: passwordHash })
    .select("id, name, email, password_hash, created_at, updated_at")
    .single();
  if (error?.code === "23505") {
    throw new AppError("Este email já está cadastrado.", 409, "EMAIL_ALREADY_EXISTS");
  }
  if (error) throw userError(error.message);
  return data as UserRow;
}

export async function verifyUser(email: string, password: string) {
  const { data, error } = await getServerSupabase()
    .from("users")
    .select("id, name, email, password_hash, created_at, updated_at")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  if (error) throw userError(error.message);
  if (!data || !(await bcrypt.compare(password, (data as UserRow).password_hash))) return null;
  const user = data as UserRow;
  return { id: user.id, name: user.name, email: user.email };
}

export async function findUserByEmail(email: string) {
  const { data, error } = await getServerSupabase()
    .from("users")
    .select("id, email")
    .eq("email", normalizeEmail(email))
    .maybeSingle();
  if (error) throw userError(error.message);
  return data as Pick<UserRow, "id" | "email"> | null;
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  const supabase = getServerSupabase();
  const { error: deleteError } = await supabase
    .from("password_reset_tokens")
    .delete()
    .eq("user_id", userId)
    .is("used_at", null);
  if (deleteError) throw userError(deleteError.message);
  const { error } = await supabase
    .from("password_reset_tokens")
    .insert({ user_id: userId, token_hash: tokenHash(token), expires_at: expiresAt });
  if (error) throw userError(error.message);
  return token;
}

export async function resetPasswordWithToken(token: string, password: string) {
  const supabase = getServerSupabase();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("password_reset_tokens")
    .update({ used_at: now })
    .eq("token_hash", tokenHash(token))
    .is("used_at", null)
    .gt("expires_at", now)
    .select("id, user_id")
    .maybeSingle();
  if (error) throw userError(error.message);
  if (!data) throw new AppError("Este link de recuperação é inválido ou expirou.", 400, "INVALID_RESET_TOKEN");
  const resetToken = data as PasswordResetTokenRow;
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({ password_hash: await bcrypt.hash(password, 12) })
    .eq("id", resetToken.user_id);
  if (userUpdateError) throw userError(userUpdateError.message);
}
