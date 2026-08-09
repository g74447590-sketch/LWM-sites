# LWM Sites em computador e celular

O LWM Sites é uma PWA responsiva. A mesma URL publicada funciona em computador, tablet e celular; não há uma versão separada para baixar.

## Uso no celular

- **Android/Chrome:** quando disponível, use o botão **Instalar** apresentado pelo navegador.
- **iPhone/iPad/Safari:** toque em **Compartilhar** e depois em **Adicionar à Tela de Início**. O próprio app mostra esta instrução uma vez por sessão.
- A tela pode ser usada em retrato ou paisagem. O editor tem um atalho **Ir para o preview** para que o usuário não precise percorrer todos os campos para revisar o site.

## Uso no computador

- A navegação principal, o editor e o preview de desktop continuam disponíveis.
- O preview permite alternar entre desktop, tablet e celular antes de publicar.

## O que foi verificado localmente

- 390 px: sem rolagem horizontal; menu, login e campos de acesso acessíveis.
- 1440 px: navegação de computador exibida e sem rolagem horizontal.
- Manifesto PWA com `display: standalone` e sem orientação forçada.

Ela funciona como aplicativo web instalável, mas ainda depende da conexão com a hospedagem e com o Supabase para login, projetos e publicação. Para Apple App Store ou Google Play, ainda será necessário criar um app nativo (por exemplo, Capacitor), assinar os binários e usar contas de desenvolvedor das lojas. Não envie o código-fonte ou este repositório diretamente às lojas.
