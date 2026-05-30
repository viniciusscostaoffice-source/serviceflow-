-- Billing: profiles (extensão de usuários) + invoices (cobranças Pix)

-- ============================================================
-- PROFILES: controle de trial e acesso por usuário
-- ============================================================
create table if not exists public.profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         text not null unique,   -- auth.users.id (ou mock fixo enquanto auth não está pronto)
  email           text,
  trial_ends_at   timestamptz not null default (now() + interval '20 seconds'),
  access_expires_at timestamptz,          -- null = nunca pagou ainda
  subscription_status text not null default 'trial'
    check (subscription_status in ('trial', 'active', 'payment_pending', 'blocked')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- INVOICES: cobranças Pix geradas no Mercado Pago
-- ============================================================
create table if not exists public.invoices (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 text not null references public.profiles(user_id) on delete cascade,
  amount                  integer not null,             -- valor em centavos (ex: 5900 = R$59)
  plan_name               text not null default 'basico',
  status                  text not null default 'pending'
    check (status in ('pending', 'paid', 'expired', 'cancelled')),
  abacate_payment_id      text,
  pix_qr_code_base64      text,
  pix_copy_paste          text,
  ticket_url              text,
  expires_at              timestamptz,                  -- quando o QR Code Pix expira
  paid_at                 timestamptz,
  created_at              timestamptz not null default now()
);

create index if not exists invoices_user_id_idx on public.invoices(user_id);
create index if not exists invoices_abacate_payment_id_idx on public.invoices(abacate_payment_id);

-- ============================================================
-- RLS: apenas o próprio usuário acessa seus dados
-- ============================================================
alter table public.profiles enable row level security;
alter table public.invoices enable row level security;

-- Policies abertas para service_role (Edge Functions usam service_role)
create policy "service_role_profiles" on public.profiles
  for all using (true) with check (true);

create policy "service_role_invoices" on public.invoices
  for all using (true) with check (true);

-- ============================================================
-- SEED: profile demo para testes (user_id fixo = mock)
-- ============================================================
insert into public.profiles (user_id, email, trial_ends_at, subscription_status)
values (
  'demo-user-001',
  'demo@serviceflow.com.br',
  now() + interval '7 days',
  'trial'
)
on conflict (user_id) do nothing;
