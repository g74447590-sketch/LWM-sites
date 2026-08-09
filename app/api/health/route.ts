import { NextResponse } from "next/server";

export function GET() {
  const databaseConfigured = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY));
  const authConfigured = Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL);
  return NextResponse.json({
    status: databaseConfigured && authConfigured ? "ready" : "degraded",
    services: { databaseConfigured, authConfigured, siteBuilderConfigured: true },
  }, { headers: { "Cache-Control": "no-store" } });
}
