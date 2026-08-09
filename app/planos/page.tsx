import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = { title: "Planos | LWM Sites", description: "Planos acessíveis para criar, publicar e manter sites de pequenos negócios." };

export default function PlansPage() { return <PricingPage />; }
