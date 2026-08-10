import { NextResponse } from "next/server";
import { getPublishCreditStatus } from "@/lib/credits";
import { isAppError } from "@/lib/errors";
import { requireUserId } from "@/lib/session";

export async function GET() {
  try {
    return NextResponse.json(await getPublishCreditStatus(await requireUserId()));
  } catch (error) {
    if (isAppError(error)) return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    return NextResponse.json({ error: "Não foi possível consultar os tokens." }, { status: 500 });
  }
}
