import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LWM Sites — sites profissionais",
    short_name: "LWM Sites",
    description: "Crie, edite e publique sites profissionais pelo celular.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080b",
    theme_color: "#08080b",
    lang: "pt-BR",
    categories: ["business", "productivity"],
    icons: [{ src: "/lwm-sites-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
