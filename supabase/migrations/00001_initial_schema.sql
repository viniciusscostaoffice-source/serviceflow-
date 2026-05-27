-- 1. Oficinas (Tenants)
CREATE TABLE oficinas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Usuarios Oficina (Managers/Owners)
CREATE TABLE usuarios_oficina (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    cargo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Mecanicos
CREATE TABLE mecanicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    telefone TEXT,
    comissao_padrao DECIMAL(5,2) DEFAULT 15.00,
    status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Atendente', 'Inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Regras de Comissão
CREATE TABLE regras_comissao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    servico TEXT NOT NULL,
    comissao DECIMAL(5,2) NOT NULL,
    tipo TEXT DEFAULT 'percentual' CHECK (tipo IN ('percentual', 'fixo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Ordens de Serviço (OS)
CREATE TABLE ordens_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    num SERIAL,
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'Aberta' CHECK (status IN ('Aberta', 'Concluída', 'Paga', 'Em_Pendência', 'Cancelada')),
    cliente TEXT NOT NULL,
    veiculo TEXT,
    placa TEXT,
    mecanico_principal_id UUID REFERENCES mecanicos(id) ON DELETE SET NULL,
    ajudante_id UUID REFERENCES mecanicos(id) ON DELETE SET NULL,
    descricao TEXT,
    mao_de_obra DECIMAL(10,2) DEFAULT 0.00,
    pecas DECIMAL(10,2) DEFAULT 0.00,
    comissao_mecanico DECIMAL(10,2) DEFAULT 0.00,
    comissao_ajudante DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Edições OS
CREATE TABLE edicoes_os (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    os_id UUID NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios_oficina(id) ON DELETE SET NULL,
    motivo TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    dados_anteriores JSONB,
    dados_novos JSONB
);

-- 7. Pendências
CREATE TABLE pendencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    os_id UUID REFERENCES ordens_servico(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    severidade TEXT DEFAULT 'media' CHECK (severidade IN ('baixa', 'media', 'alta')),
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvida', 'ignorada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Fechamentos Mensais
CREATE TABLE fechamentos_mensais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oficina_id UUID NOT NULL REFERENCES oficinas(id) ON DELETE CASCADE,
    mecanico_id UUID NOT NULL REFERENCES mecanicos(id) ON DELETE CASCADE,
    mes_ano TEXT NOT NULL, -- Ex: '2026-05'
    total_mao_obra DECIMAL(10,2) DEFAULT 0.00,
    comissao_total DECIMAL(10,2) DEFAULT 0.00,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago')),
    comprovante_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) configuration

ALTER TABLE oficinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_oficina ENABLE ROW LEVEL SECURITY;
ALTER TABLE mecanicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE regras_comissao ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE edicoes_os ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE fechamentos_mensais ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's oficina_id
CREATE OR REPLACE FUNCTION current_oficina_id() 
RETURNS UUID AS $$
    SELECT oficina_id FROM usuarios_oficina WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;


-- RLS Policies

-- Usuarios Oficina
CREATE POLICY "Users can view their own profile" ON usuarios_oficina
    FOR SELECT USING (auth.uid() = id);

-- Oficinas
CREATE POLICY "Users can view their own oficina" ON oficinas
    FOR SELECT USING (id = current_oficina_id());
CREATE POLICY "Users can update their own oficina" ON oficinas
    FOR UPDATE USING (id = current_oficina_id());

-- Mecanicos
CREATE POLICY "Oficina users can view mecanicos" ON mecanicos
    FOR SELECT USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can insert mecanicos" ON mecanicos
    FOR INSERT WITH CHECK (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can update mecanicos" ON mecanicos
    FOR UPDATE USING (oficina_id = current_oficina_id());

-- Regras de Comissão
CREATE POLICY "Oficina users can view regras" ON regras_comissao
    FOR SELECT USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can manage regras" ON regras_comissao
    FOR ALL USING (oficina_id = current_oficina_id());

-- Ordens de Serviço
CREATE POLICY "Oficina users can view OS" ON ordens_servico
    FOR SELECT USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can insert OS" ON ordens_servico
    FOR INSERT WITH CHECK (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can update OS" ON ordens_servico
    FOR UPDATE USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can delete OS" ON ordens_servico
    FOR DELETE USING (oficina_id = current_oficina_id());

-- Edições OS
CREATE POLICY "Oficina users can view edicoes" ON edicoes_os
    FOR SELECT USING (EXISTS (SELECT 1 FROM ordens_servico WHERE id = edicoes_os.os_id AND oficina_id = current_oficina_id()));
CREATE POLICY "Oficina users can insert edicoes" ON edicoes_os
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM ordens_servico WHERE id = edicoes_os.os_id AND oficina_id = current_oficina_id()));

-- Pendencias
CREATE POLICY "Oficina users can view pendencias" ON pendencias
    FOR SELECT USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can manage pendencias" ON pendencias
    FOR ALL USING (oficina_id = current_oficina_id());

-- Fechamentos
CREATE POLICY "Oficina users can view fechamentos" ON fechamentos_mensais
    FOR SELECT USING (oficina_id = current_oficina_id());
CREATE POLICY "Oficina users can manage fechamentos" ON fechamentos_mensais
    FOR ALL USING (oficina_id = current_oficina_id());
