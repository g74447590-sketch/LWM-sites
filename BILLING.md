# Cobrança e planos da LWM Sites

O aplicativo já aplica os limites no servidor. Uma conta nova recebe o plano `trial` por 7 dias. Quando a data de expiração passa, a conta não pode criar, editar, enviar imagens nem manter um site público. Os limites são:

| Plano | Valor mensal | Limite de projetos e sites |
| --- | ---: | ---: |
| Lançamento | R$ 19 | 1 |
| Essencial | R$ 29 | 1 |
| Profissional | R$ 59 | 5 |

## Antes de vender

1. Execute `supabase/schema.sql` novamente no SQL Editor do Supabase.
2. Crie a conta comercial no provedor de pagamento escolhido. Para começar rápido, use links de pagamento recorrente do Mercado Pago ou Stripe.
3. Só anuncie "assine agora" depois de existir um checkout público e um webhook que confirme o pagamento. Até lá, os botões do app iniciam somente o teste gratuito.
4. Após cada pagamento confirmado, ative o plano pelo SQL Editor até o webhook estar integrado:

```sql
update public.users
set plan_key = 'essential',
    plan_expires_at = now() + interval '30 days'
where email = 'cliente@exemplo.com';
```

Use `launch` ou `professional` no lugar de `essential` conforme a venda. Nunca entregue uma assinatura apenas por comprovante: confirme o pagamento no painel do provedor antes de alterar a conta.

## Próxima integração obrigatória para escalar

O fluxo manual serve para os primeiros clientes. Para uma operação escalável, integre o checkout e webhook do provedor escolhido. O webhook deve validar a assinatura, atualizar `plan_key` e renovar `plan_expires_at` apenas para eventos confirmados. Não coloque chaves do provedor no navegador.
