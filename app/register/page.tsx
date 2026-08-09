import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() { return <Suspense fallback={<main className="auth-page" />}><AuthForm mode="register" /></Suspense>; }
