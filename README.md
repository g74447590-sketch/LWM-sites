# LWM Sites — sites profissionais sem código

LWM Sites permite criar, editar e publicar sites para negócios locais a partir de modelos profissionais. Não usa nem exige API de IA: cada site nasce com conteúdo estruturado, seguro e totalmente editável.

## O que entrega

- Landing responsiva em Português, English e Español.
- Cadastro, login, logout, sessão e proteção de rotas com Auth.js.
- Recuperação de senha por token único e expirável.
- Projetos isolados por usuário no Supabase: criar, abrir, editar, renomear, duplicar, excluir e publicar.
- Quatro modelos iniciais: barbearia, beleza, restaurante/café e serviços profissionais.
- Editor visual para textos, itens, preços, cores e link do botão (incluindo WhatsApp).
- Preview responsivo em desktop, tablet e celular.
- Publicação em `/sites/<slug>`, health check, headers de segurança, Docker e CI.

## Configuração obrigatória

1. Copie `.env.example` para `.env.local`.
2. Crie um projeto no Supabase e execute [`supabase/schema.sql`](supabase/schema.sql) no SQL Editor.
3. Preencha as variáveis abaixo:

```env
NEXTAUTH_URL=https://seu-app.vercel.app
NEXTAUTH_SECRET=segredo-aleatorio-longo
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SECRET_KEY=sb_secret_chave-somente-de-servidor
```

Para recuperação de senha, também configure `RESEND_API_KEY` e `EMAIL_FROM` com um remetente validado. Nenhuma chave de IA é necessária.

## Desenvolvimento e validação

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
pnpm start
```

## Limites desta versão

Os modelos são ponto de partida e o editor altera conteúdo, cores, preços e links. Upload de imagens, domínio próprio por cliente, pagamentos, colaboração em equipe e mais modelos são extensões futuras. Um domínio personalizado não é obrigatório: os sites publicados já funcionam com a URL da Vercel.
