import type { Metadata } from "next";
import { PricingPage } from "@/components/pricing-page";

export const metadata: Metadata = {
  title: "Beta gratuita | LWM Sites",
  description: "Conheça a beta gratuita da LWM Sites para criar e publicar sites de pequenos negócios.",
};

export default function PlansPage() {
  return <PricingPage />;
}
