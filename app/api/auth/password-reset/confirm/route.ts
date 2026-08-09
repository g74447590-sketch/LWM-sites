import { NextResponse } from "next/server";
import { isAppError } from "@/lib/errors";
import { resetPasswordWithToken } from "@/lib/users";
import { passwordResetConfirmSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const input = passwordResetConfirmSchema.parse(await request.json());
    await resetPasswordWithToken(input.token, input.password);
    return NextResponse.json({ message: "Senha atualizada. Entre com sua nova senha." });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível redefinir sua senha." }, { status: 400 });
  }
}
