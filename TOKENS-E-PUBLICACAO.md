# Tokens e publicação da LWM Sites

## O que já funciona

- Criar um site é grátis.
- A LWM publica em um endereço próprio, como `https://lwm-ai.vercel.app/sites/nome-do-site`.
- A pessoa não precisa comprar domínio nem contratar hospedagem para começar.
- O editor aceita imagens JPG, PNG, WEBP e GIF de até 5 MB, enviadas para o bucket `site-media` do Supabase.

## Beta atual

Mantenha `LWM_TOKEN_BILLING_ENABLED=false` na Vercel. Nesse modo, a publicação não consome tokens e não existe cobrança.

## Quando for vender tokens

1. Execute a versão atual de `supabase/schema.sql` no SQL Editor do Supabase. Ela cria as tabelas de saldo e de histórico de tokens.
2. Escolha um meio de pagamento que possa ser usado legalmente por um responsável. Não coloque chaves ou segredos no navegador.
3. Faça o provedor de pagamento chamar um endpoint de servidor verificado após cada pagamento aprovado. Só esse endpoint deve adicionar tokens e registrar uma transação `payment`.
4. Teste pagamentos aprovados, recusados, repetidos e reembolso antes de ativar a cobrança.
5. Só depois defina `LWM_TOKEN_BILLING_ENABLED=true` na Vercel e publique uma nova versão.

Ao ativar, cada conta recebe 2 tokens de lançamento. A primeira publicação de cada projeto consome 1 token; atualizar um site que já está publicado não consome outro.

## Importante para público adolescente

Não coletamos data de nascimento para esse fluxo. Antes de publicar, a pessoa confirma que tem direito de usar os textos, imagens, marcas e contatos. Se for menor de idade, a tela orienta que publique com um responsável.

Essa confirmação e a validação técnica de links/imagens não são parecer jurídico. No Brasil, dados de crianças e adolescentes exigem proteção reforçada e o tratamento deve observar o melhor interesse; valide os Termos, a Privacidade e o fluxo de pagamento com um responsável e orientação profissional antes de lançar comercialmente.
