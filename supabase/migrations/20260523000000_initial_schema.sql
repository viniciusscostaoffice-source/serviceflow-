-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Table: oficinas
create table public.oficinas (
    id uuid primary key default uuid_generate_v4(),
    nome text not null,
    cnpj text,
    cidade text not null,
    estado text not null,
    plano text not null check (plano in ('basico', 'oficina', 'pro')),
    status text not null check (status in ('ativo', 'trial', 'cancelado')),
    owner_id uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: usuarios_oficina
create table public.usuarios_oficina (
    id uuid primary key default uuid_generate_v4(),
    oficina_id uuid not null references public.oficinas(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    nome text not null,
    papel text not null check (papel in ('dono', 'gerente', 'financeiro')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: mecanicos
create table public.mecanicos (
    id uuid primary key default uuid_generate_v4(),
    oficina_id uuid not null references public.oficinas(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    nome text not null,
    cpf text not null,
    celular text not null,
    email text,
    status text not null check (status in ('convidado', 'ativo', 'inativo')),
    percentual_padrao numeric(5,2) not null default 0.00,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: regras_comissao
create table public.regras_comissao (
    id uuid primary key default uuid_generate_v4(),
    oficina_id uuid not null references public.oficinas(id) on delete cascade,
    tipo_servico text not null,
    percentual numeric(5,2) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: ordens_servico
create table public.ordens_servico (
    id uuid primary key default uuid_generate_v4(),
    oficina_id uuid not null references public.oficinas(id) on delete cascade,
    numero serial not null,
    mecanico_id uuid not null references public.mecanicos(id) on delete restrict,
    ajudante_id uuid references public.mecanicos(id) on delete restrict,
    percentual_ajudante numeric(5,2) default 0,
    cliente_nome text not null,
    veiculo text not null,
    placa text,
    descricao_servico text not null,
    valor_mao_de_obra numeric(10,2) not null default 0,
    valor_pecas numeric(10,2) not null default 0,
    valor_total numeric(10,2) generated always as (valor_mao_de_obra + valor_pecas) stored,
    comissao_calculada numeric(10,2) not null default 0,
    comissao_mecanico numeric(10,2) not null default 0,
    comissao_ajudante numeric(10,2) not null default 0,
    status text not null check (status in ('aberta', 'concluida', 'paga', 'cancelada', 'em_pendencia')),
    data_servico date not null,
    created_by uuid not null references public.usuarios_oficina(id) on delete restrict,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: edicoes_os
create table public.edicoes_os (
    id uuid primary key default uuid_generate_v4(),
    os_id uuid not null references public.ordens_servico(id) on delete cascade,
    editado_por uuid not null references public.usuarios_oficina(id),
    motivo text not null check (motivo in ('erro_cadastro', 'troca_mecanico', 'ajuste_manual', 'correcao_valor', 'outro')),
    motivo_detalhado text,
    campo_alterado text not null,
    valor_anterior text,
    valor_novo text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: pendencias
create table public.pendencias (
    id uuid primary key default uuid_generate_v4(),
    os_id uuid not null references public.ordens_servico(id) on delete cascade,
    mecanico_id uuid not null references public.mecanicos(id) on delete cascade,
    motivo text not null,
    status text not null check (status in ('aberta', 'resolvida', 'descartada')),
    resposta_gerente text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    resolved_at timestamp with time zone
);

-- Table: fechamentos_mensais
create table public.fechamentos_mensais (
    id uuid primary key default uuid_generate_v4(),
    oficina_id uuid not null references public.oficinas(id) on delete cascade,
    mecanico_id uuid not null references public.mecanicos(id) on delete restrict,
    mes integer not null check (mes between 1 and 12),
    ano integer not null,
    total_comissao numeric(10,2) not null,
    total_os integer not null,
    status text not null check (status in ('aberto', 'fechado', 'pago')),
    pago_em timestamp with time zone,
    comprovante_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(oficina_id, mecanico_id, mes, ano)
);

-- RLS setup (Row Level Security)
-- This enforces that users can only see their own data based on oficina_id

alter table public.oficinas enable row level security;
alter table public.usuarios_oficina enable row level security;
alter table public.mecanicos enable row level security;
alter table public.regras_comissao enable row level security;
alter table public.ordens_servico enable row level security;
alter table public.edicoes_os enable row level security;
alter table public.pendencias enable row level security;
alter table public.fechamentos_mensais enable row level security;

-- Create policy functions and policies based on auth.uid() being within usuarios_oficina
-- (We'll assume simplified RLS where check relies on a subquery to see if the user belongs to that oficina)
-- Actually, a common pattern is to just check if auth.uid() matches user_id in usuarios_oficina, and get oficina_id.

create function get_user_oficina_id() returns uuid as $$
declare
    v_oficina_id uuid;
begin
    select oficina_id into v_oficina_id 
    from public.usuarios_oficina 
    where user_id = auth.uid() 
    limit 1;
    return v_oficina_id;
end;
$$ language plpgsql security definer;

-- Apply simple policies using the function
create policy "Acesso a oficinas isolado" on public.oficinas for all using (id = get_user_oficina_id());
create policy "Acesso a usuarios isolado" on public.usuarios_oficina for all using (oficina_id = get_user_oficina_id());
create policy "Acesso a mecanicos isolado" on public.mecanicos for all using (oficina_id = get_user_oficina_id());
create policy "Acesso a regras isolado" on public.regras_comissao for all using (oficina_id = get_user_oficina_id());
create policy "Acesso a ordens_servico isolado" on public.ordens_servico for all using (oficina_id = get_user_oficina_id());
create policy "Acesso a edicoes_os isolado" on public.edicoes_os for all using (
    os_id in (select id from public.ordens_servico where oficina_id = get_user_oficina_id())
);
create policy "Acesso a pendencias isolado" on public.pendencias for all using (
    os_id in (select id from public.ordens_servico where oficina_id = get_user_oficina_id())
);
create policy "Acesso a fechamentos isolado" on public.fechamentos_mensais for all using (oficina_id = get_user_oficina_id());
