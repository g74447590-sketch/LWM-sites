import { NextResponse } from "next/server";
import { getPasswordResetEmailConfig } from "@/lib/env";
import { isAppError } from "@/lib/errors";
import { sendPasswordResetEmail } from "@/services/email";
import { createPasswordResetToken, findUserByEmail } from "@/lib/users";
import { enforceRequestRateLimit } from "@/lib/rate-limit";
import { passwordResetRequestSchema } from "@/lib/validation";

const successMessage = "Se houver uma conta com esse email, você receberá um link de recuperação.";

export async function POST(request: Request) {
  try {
    getPasswordResetEmailConfig();
    const { email } = passwordResetRequestSchema.parse(await request.json());
    await enforceRequestRateLimit(request, "password-reset", 3, 15 * 60);
    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ message: successMessage });
    const token = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, token);
    return NextResponse.json({ message: successMessage });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível solicitar a recuperação." }, { status: 400 });
  }
}
