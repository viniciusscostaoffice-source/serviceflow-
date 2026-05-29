-- ============================================================
-- Migration: corrige tabela ordens_servico e adiciona índices
-- Aplica apenas as mudanças necessárias no banco existente
-- ============================================================

-- 1. Colunas de ajudante (adicionadas com segurança via IF NOT EXISTS)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'ordens_servico' and column_name = 'ajudante_id'
  ) then
    alter table ordens_servico
      add column ajudante_id bigint references mecanicos(id) on delete set null;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'ordens_servico' and column_name = 'percentual_ajudante'
  ) then
    alter table ordens_servico
      add column percentual_ajudante numeric(5,2) not null default 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'ordens_servico' and column_name = 'comissao_mecanico'
  ) then
    alter table ordens_servico
      add column comissao_mecanico numeric(10,2) not null default 0;
    -- Popula comissao_mecanico com o valor de comissao para registros antigos
    update ordens_servico set comissao_mecanico = comissao where comissao_mecanico = 0;
  end if;

  if not exists (
    select 1 from information_schema.columns
    where table_name = 'ordens_servico' and column_name = 'comissao_ajudante'
  ) then
    alter table ordens_servico
      add column comissao_ajudante numeric(10,2) not null default 0;
  end if;
end;
$$;

-- 2. CHECK constraints (adicionadas com segurança)
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where table_name = 'ordens_servico' and constraint_name = 'chk_total_pecas_positivo'
  ) then
    alter table ordens_servico
      add constraint chk_total_pecas_positivo   check (total_pecas >= 0),
      add constraint chk_total_mao_obra_positivo check (total_mao_obra >= 0),
      add constraint chk_comissao_positiva       check (comissao >= 0),
      add constraint chk_comissao_mecanico_pos   check (comissao_mecanico >= 0),
      add constraint chk_comissao_ajudante_pos   check (comissao_ajudante >= 0),
      add constraint chk_percentual_ajudante     check (percentual_ajudante >= 0 and percentual_ajudante <= 100);
  end if;
end;
$$;

-- 3. Índices de performance
create index if not exists idx_os_mecanico_id  on ordens_servico(mecanico_id);
create index if not exists idx_os_ajudante_id  on ordens_servico(ajudante_id);
create index if not exists idx_os_status       on ordens_servico(status);
create index if not exists idx_os_data         on ordens_servico(data);
create index if not exists idx_pendencias_os   on pendencias(os_id);
create index if not exists idx_pendencias_res  on pendencias(resolvida);
create index if not exists idx_edicoes_os_id   on edicoes_os(os_id);
create index if not exists idx_fechamentos_mec on fechamentos_mensais(mecanico_id, mes, ano);
