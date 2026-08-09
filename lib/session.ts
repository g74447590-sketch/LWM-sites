import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppError } from "@/lib/errors";

export async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new AppError("Sua sessão expirou. Entre novamente.", 401, "UNAUTHENTICATED");
  return session.user.id;
}
