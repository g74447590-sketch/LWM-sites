import { NextResponse } from "next/server";
import { z } from "zod";
import { isAppError } from "@/lib/errors";
import { createUser } from "@/lib/users";
import { enforceRequestRateLimit } from "@/lib/rate-limit";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    await enforceRequestRateLimit(request, "register", 5, 15 * 60);
    const user = await createUser(body);
    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 });
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Revise os dados informados.", code: "INVALID_REGISTRATION" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "Não foi possível criar sua conta." }, { status: 400 });
  }
}
