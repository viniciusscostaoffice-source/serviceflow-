# Torke Oficina - Painel do Gerente e Landing Page

Landing page e Painel Administrativo ("Web do Gerente") do micro-SaaS Torke Oficina, focado no controle de comissão de mecânicos. 
Projeto desenvolvido em React (Vite) + Tailwind CSS + Supabase + React Router.

## Funcionalidades

- **Design Industrial e "Raiz"**: Cores vibrantes (Laranja/Preto), fonte robusta (Anton).
- **Mobile First**: Layout responsivo (Gerente pode lançar OS no celular).
- **Backend Completo em Supabase**: Auth, Banco Relacional (Postgres) e Políticas (RLS).
- **Funcionalidades**: Lançamento de OSs, Edição com rastro (Auditoria), Relatórios de comissões, Resolução de Pendências, Fechamento de Mês.

## Pré-requisitos & Supabase

1. Crie uma conta e um projeto gratuito no [Supabase](https://supabase.com).
2. Vá em Configurações > API e copie a **URL** e a **anon public key**.
3. No painel do Supabase, acesse **SQL Editor**. Cole e rode o conteúdo de `supabase/migrations/20260523000000_initial_schema.sql`.
4. (Opcional) No **SQL Editor**, cole e rode o `supabase/seed.sql` para testar.

## Como configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, usando o `.env.example` como base:

```env
VITE_WEBHOOK_URL="https://seu-webhook-aqui.com/catch"
VITE_CHECKOUT_URL="https://checkout.asaas.com/...."
VITE_META_PIXEL_ID="SEU_PIXEL_ID"
VITE_GA_ID="G-SEU_GA_ID"
VITE_WHATSAPP_NUMBER="5511999999999"
VITE_SUPABASE_URL="Sua URL do Supabase"
VITE_SUPABASE_ANON_KEY="Sua Chave Anon do Supabase"
```

## Como rodar localmente

Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev
```

## Como fazer deploy no Vercel

Por estarmos usando Vite, o deploy é bem simples:

1. Suba o código para o GitHub.
2. Acesse sua conta na Vercel e clique em "Add New Project".
3. Conecte com o repositório do GitHub.
4. A Vercel detectará automaticamente a configuração do Vite (Build command: `npm run build`, Output directory: `dist`).
5. Em **Environment Variables**, não se esqueça de adicionar todas as suas variáveis de ambiente:
   - `VITE_WEBHOOK_URL`
   - `VITE_CHECKOUT_URL`
   - `VITE_META_PIXEL_ID`
   - `VITE_GA_ID`
   - `VITE_WHATSAPP_NUMBER`
6. Clique em Deploy.

## Como trocar link de checkout depois

Basta alterar a variável de ambiente `VITE_CHECKOUT_URL` diretamente no painel da Vercel (aba Settings > Environment Variables) e realizar o "Redeploy" do projeto para o novo link entrar no ar.
