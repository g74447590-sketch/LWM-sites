# Publicação da LWM Sites

O projeto está preparado para Vercel ou qualquer host compatível com Docker/Node.js. A Vercel é o caminho mais simples.

## Publicar na Vercel

1. Importe o repositório em **Add New → Project**.
2. Configure `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `SUPABASE_URL` e `SUPABASE_SECRET_KEY` em **Settings → Environment Variables**.
3. Faça o deploy e confirme `/api/health`: o campo `status` deve ser `ready`.
4. Para recuperação de senha, adicione `RESEND_API_KEY` e `EMAIL_FROM` depois de validar o remetente.
5. Opcionalmente conecte um domínio em **Settings → Domains** e atualize `NEXTAUTH_URL`.

## Variáveis obrigatórias

- `NEXTAUTH_URL`: URL HTTPS final da aplicação.
- `NEXTAUTH_SECRET`: segredo longo e aleatório.
- `SUPABASE_URL` e `SUPABASE_SECRET_KEY`: projeto Supabase de produção.

Não há chave, conta ou crédito de IA para configurar.

## Docker

```bash
docker build -t lwm-sites .
docker run --env-file .env.local -p 3000:3000 lwm-sites
```

## Teste de aceite

Em produção, crie duas contas de teste. Em uma delas, crie um site de cada modelo, altere texto e cor no editor, salve, publique e abra `/sites/<slug>`. Confirme que o botão de WhatsApp abre o número informado e que uma conta não visualiza os projetos da outra.
