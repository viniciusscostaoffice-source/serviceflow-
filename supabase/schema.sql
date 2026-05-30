-- ============================================================
-- Torke Oficina — Schema completo
-- Execute no Supabase: SQL Editor → New Query → Run
-- ============================================================

-- Extensões
create extension if not exists "uuid-ossp";

-- ============================================================
-- MECÂNICOS
-- ============================================================
create table if not exists mecanicos (
  id            bigint primary key generated always as identity,
  nome          text not null,
  fone          text not null,
  cpf           text,
  comissao_padrao numeric(5,2) not null default 15,
  status        text not null default 'Ativo' check (status in ('Ativo','Inativo','Atendente')),
  criado_em     timestamptz not null default now()
);

-- ============================================================
-- ORDENS DE SERVIÇO
-- ============================================================
create table if not exists ordens_servico (
  id                  bigint primary key generated always as identity,
  num                 text not null unique,
  data                date not null default current_date,
  mecanico_id         bigint not null references mecanicos(id) on delete restrict,
  ajudante_id         bigint references mecanicos(id) on delete set null,
  percentual_ajudante numeric(5,2) not null default 0 check (percentual_ajudante >= 0 and percentual_ajudante <= 100),
  cliente             text not null,
  veiculo             text not null,
  placa               text not null,
  descricao           text,
  total_pecas         numeric(10,2) not null default 0 check (total_pecas >= 0),
  total_mao_obra      numeric(10,2) not null default 0 check (total_mao_obra >= 0),
  comissao            numeric(10,2) not null default 0 check (comissao >= 0),
  comissao_mecanico   numeric(10,2) not null default 0 check (comissao_mecanico >= 0),
  comissao_ajudante   numeric(10,2) not null default 0 check (comissao_ajudante >= 0),
  status              text not null default 'aberta'
                        check (status in ('aberta','concluida','paga','em_pendencia','cancelada')),
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

-- Atualiza timestamp automaticamente
create or replace function set_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger trg_os_atualizado
  before update on ordens_servico
  for each row execute function set_atualizado_em();

-- ============================================================
-- EDIÇÕES DE OS (histórico de alterações)
-- ============================================================
create table if not exists edicoes_os (
  id          bigint primary key generated always as identity,
  os_id       bigint not null references ordens_servico(id) on delete cascade,
  quem        text not null,
  campo       text not null,
  valor_de    text,
  valor_para  text,
  motivo      text,
  criado_em   timestamptz not null default now()
);

-- ============================================================
-- PENDÊNCIAS
-- ============================================================
create table if not exists pendencias (
  id          bigint primary key generated always as identity,
  os_id       bigint references ordens_servico(id) on delete set null,
  tipo        text not null,
  descricao   text not null,
  severidade  text not null default 'media' check (severidade in ('alta','media')),
  resolvida   boolean not null default false,
  criado_em   timestamptz not null default now()
);

-- ============================================================
-- FECHAMENTOS MENSAIS
-- ============================================================
create table if not exists fechamentos_mensais (
  id              bigint primary key generated always as identity,
  mecanico_id     bigint not null references mecanicos(id) on delete cascade,
  mes             int not null check (mes between 1 and 12),
  ano             int not null,
  total_os        int not null default 0,
  total_mao_obra  numeric(10,2) not null default 0,
  total_pecas     numeric(10,2) not null default 0,
  total_comissao  numeric(10,2) not null default 0,
  status          text not null default 'aberto' check (status in ('aberto','fechado','pago')),
  data_pagamento  date,
  data_confirmacao date,
  criado_em       timestamptz not null default now(),
  unique (mecanico_id, mes, ano)
);

-- ============================================================
-- ÍNDICES DE PERFORMANCE
-- ============================================================
create index if not exists idx_os_mecanico_id  on ordens_servico(mecanico_id);
create index if not exists idx_os_ajudante_id  on ordens_servico(ajudante_id);
create index if not exists idx_os_status       on ordens_servico(status);
create index if not exists idx_os_data         on ordens_servico(data);
create index if not exists idx_pendencias_os   on pendencias(os_id);
create index if not exists idx_pendencias_res  on pendencias(resolvida);
create index if not exists idx_edicoes_os_id   on edicoes_os(os_id);
create index if not exists idx_fechamentos_mec on fechamentos_mensais(mecanico_id, mes, ano);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table mecanicos          enable row level security;
alter table ordens_servico     enable row level security;
alter table edicoes_os         enable row level security;
alter table pendencias         enable row level security;
alter table fechamentos_mensais enable row level security;

-- Por enquanto: acesso total via anon key (ajuste para auth depois)
create policy "acesso_total_mecanicos"           on mecanicos           for all using (true) with check (true);
create policy "acesso_total_os"                  on ordens_servico      for all using (true) with check (true);
create policy "acesso_total_edicoes"             on edicoes_os          for all using (true) with check (true);
create policy "acesso_total_pendencias"          on pendencias          for all using (true) with check (true);
create policy "acesso_total_fechamentos"         on fechamentos_mensais for all using (true) with check (true);

-- ============================================================
-- DADOS INICIAIS (mock data do painel)
-- ============================================================
insert into mecanicos (nome, fone, comissao_padrao, status) values
  ('Carlos Souza',   '(11) 99999-1111', 15, 'Ativo'),
  ('Paulo Oliveira', '(11) 98888-2222', 20, 'Ativo'),
  ('Zé Roberto',     '(11) 97777-3333', 15, 'Ativo');

insert into ordens_servico (num, data, mecanico_id, cliente, veiculo, placa, total_pecas, total_mao_obra, comissao, status) values
  ('#1045', '2026-05-27', 1, 'João Silva',     'Gol',     'ABC-1234', 100,  150,  22.50,  'concluida'),
  ('#1044', '2026-05-26', 2, 'Ana Beatriz',    'Corolla', 'DEF-5678', 600,  600,  120.00, 'aberta'),
  ('#1043', '2026-05-24', 1, 'Pedro Souza',    'HB20',    'GHI-9012', 200,  250,  37.50,  'paga'),
  ('#1042', '2026-05-23', 3, 'Maria Lima',     'Onix',    'JKL-3456', 0,    80,   12.00,  'em_pendencia'),
  ('#1041', '2026-05-22', 2, 'Rui Barbosa',    'Civic',   'MNO-7890', 400,  500,  100.00, 'concluida'),
  ('#1040', '2026-05-21', 1, 'Lúcia Ferreira', 'Palio',   'PQR-1234', 50,   100,  15.00,  'paga'),
  ('#1039', '2026-05-20', 3, 'Fábio Alves',    'Creta',   'STU-5678', 300,  700,  105.00, 'concluida'),
  ('#1038', '2026-05-19', 2, 'Cláudia Neves',  'Sandero', 'VWX-9012', 150,  350,  70.00,  'paga'),
  ('#1037', '2026-05-15', 1, 'André Costa',    'Polo',    'YZA-3456', 800,  900,  135.00, 'paga'),
  ('#1036', '2026-05-10', 3, 'Tatiane Rocha',  'Hilux',   'BCD-7890', 1200, 1500, 225.00, 'concluida'),
  ('#1035', '2026-04-28', 1, 'Marcos Vieira',  'Fiat 500','EFG-1111', 200,  400,  60.00,  'paga'),
  ('#1034', '2026-04-25', 2, 'Jéssica Lima',   'Fiesta',  'HIJ-2222', 100,  200,  40.00,  'paga'),
  ('#1033', '2026-04-20', 3, 'Bruno Santos',   'Ranger',  'KLM-3333', 500,  1200, 180.00, 'concluida'),
  ('#1032', '2026-04-15', 1, 'Elaine Dias',    'Corsa',   'NOP-4444', 300,  600,  90.00,  'cancelada');

insert into pendencias (os_id, tipo, descricao, severidade) values
  (4, 'OS Cancelada com Comissão',
   'A OS #1042 foi cancelada, mas já estava constando no fechamento parcial do mecânico Zé.',
   'alta'),
  (6, 'Edição de Valor',
   'Valor da Mão de Obra alterado de R$ 250 para R$ 150 na OS #1040 após a finalização.',
   'media');
