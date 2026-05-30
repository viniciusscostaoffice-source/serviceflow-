-- Seed Data

-- 1. Create a dummy oficina
INSERT INTO oficinas (id, nome, cnpj, telefone, endereco) VALUES
('b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Torke Auto Center', '12.345.678/0001-90', '(11) 9999-8888', 'Av. das Nações, 1000 - São Paulo, SP');

-- 2. Create mock mechanics
INSERT INTO mecanicos (id, oficina_id, nome, telefone, comissao_padrao, status) VALUES
('87db1aa2-5e60-4b06-a886-f6c12365acbe', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Carlos Souza', '(11) 98888-1111', 15.00, 'Ativo'),
('aa4cf4b5-412f-488f-a951-dc4fb21a3765', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Paulo Oliveira', '(11) 97777-2222', 20.00, 'Ativo'),
('dd290a6e-4bb5-48b2-b1bf-7f41eec7d187', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Zé Roberto', '(11) 96666-3333', 15.00, 'Atendente');

-- 3. Create commission rules
INSERT INTO regras_comissao (id, oficina_id, servico, comissao, tipo) VALUES
(gen_random_uuid(), 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Troca de Óleo Completa', 5.00, 'percentual'),
(gen_random_uuid(), 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Revisão Motor', 30.00, 'percentual'),
(gen_random_uuid(), 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'Alinhamento 3D', 12.00, 'percentual');

-- 4. Create Os
INSERT INTO ordens_servico (id, oficina_id, num, status, cliente, veiculo, placa, mecanico_principal_id, ajudante_id, descricao, mao_de_obra, pecas, comissao_mecanico, comissao_ajudante) VALUES
('6b2e1b10-6cce-4ba8-bc1d-91b3e944b20a', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 1040, 'Concluída', 'João Silva', 'VW Gol 1.6 2018', 'ABC-1234', '87db1aa2-5e60-4b06-a886-f6c12365acbe', 'aa4cf4b5-412f-488f-a951-dc4fb21a3765', 'Troca de óleo, filtros e pastilhas de freio dianteiras. Revisão geral nos fluidos.', 250.00, 450.00, 30.00, 7.50),
('f65bcb6d-8dd1-4ba2-a25b-ae224b1ec515', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 1041, 'Aberta', 'Maria Costa', 'Honda Civic Touring 2021', 'XYZ-9876', 'aa4cf4b5-412f-488f-a951-dc4fb21a3765', NULL, 'Suspensão com barulho do lado direito.', 150.00, 0.00, 30.00, 0.00),
('3a5518b5-3dcf-42eb-81ed-c0c272a0890a', 'b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 1042, 'Em_Pendência', 'Pedro Almeida', 'Ford Ranger XLT', 'RNG-5555', '87db1aa2-5e60-4b06-a886-f6c12365acbe', NULL, 'Motor falhando em rotação alta.', 0.00, 0.00, 0.00, 0.00);

-- 5. Create Pendencias
INSERT INTO pendencias (oficina_id, os_id, tipo, descricao, severidade, status) VALUES
('b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'f65bcb6d-8dd1-4ba2-a25b-ae224b1ec515', 'Atraso na liberação', 'A OS está aberta há mais de 48h aguardando aprovação de peças.', 'baixa', 'pendente');

-- 6. Create Fechamentos
INSERT INTO fechamentos_mensais (oficina_id, mecanico_id, mes_ano, total_mao_obra, comissao_total, status) VALUES
('b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', '87db1aa2-5e60-4b06-a886-f6c12365acbe', '2026-05', 4500.00, 1250.00, 'pendente'),
('b303e002-6c17-4ef6-bb4d-17e9f36fcc1e', 'aa4cf4b5-412f-488f-a951-dc4fb21a3765', '2026-05', 3200.00, 850.00, 'pago');
