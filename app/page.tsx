import { SiteHeader } from "@/components/site-header";

export default function SettingsPage() { return <><SiteHeader app /><main className="centered-page"><section className="status-card"><p className="eyebrow">SETTINGS</p><h1>Configurações da conta</h1><p>Preferências de idioma já ficam salvas no navegador. Configurações de perfil, plano e recuperação de senha dependem da próxima integração de autenticação.</p></section></main></>; }
