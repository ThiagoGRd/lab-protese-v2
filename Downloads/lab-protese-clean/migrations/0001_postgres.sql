-- Criação de tabelas para o sistema de laboratório de prótese (PostgreSQL)

-- Tabela de usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('admin', 'tecnico', 'auxiliar')),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_acesso TIMESTAMP,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de serviços (tabela de preços)
CREATE TABLE servicos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de clientes (clínicas e profissionais)
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('clinica', 'profissional')),
  endereco TEXT,
  telefone VARCHAR(50),
  email VARCHAR(255),
  observacoes TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de profissionais (dentistas vinculados às clínicas)
CREATE TABLE profissionais (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  especialidade VARCHAR(100),
  telefone VARCHAR(50),
  email VARCHAR(255),
  observacoes TEXT,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de ordens de serviço
CREATE TABLE ordens_servico (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  profissional_id INTEGER REFERENCES profissionais(id),
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_entrega TIMESTAMP,
  urgencia BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'entregue', 'cancelado')),
  observacoes TEXT,
  data_atualizacao TIMESTAMP
);

-- Tabela de itens da ordem de serviço
CREATE TABLE itens_ordem_servico (
  id SERIAL PRIMARY KEY,
  ordem_servico_id INTEGER NOT NULL REFERENCES ordens_servico(id) ON DELETE CASCADE,
  servico_id INTEGER NOT NULL REFERENCES servicos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  cor_dente VARCHAR(50),
  escala_cor VARCHAR(50),
  material VARCHAR(100),
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  observacoes TEXT
);

-- Tabela de materiais (estoque)
CREATE TABLE materiais (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  quantidade DECIMAL(10,2) NOT NULL DEFAULT 0,
  unidade VARCHAR(50) NOT NULL,
  preco_unitario DECIMAL(10,2),
  estoque_minimo DECIMAL(10,2),
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de movimentações de estoque
CREATE TABLE movimentacoes_estoque (
  id SERIAL PRIMARY KEY,
  material_id INTEGER NOT NULL REFERENCES materiais(id),
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade DECIMAL(10,2) NOT NULL,
  data_movimentacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  usuario_id INTEGER REFERENCES usuarios(id),
  observacoes TEXT
);

-- Tabela de contas a receber
CREATE TABLE contas_receber (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id),
  ordem_servico_id INTEGER REFERENCES ordens_servico(id),
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'atrasado', 'pago')),
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de contas a pagar
CREATE TABLE contas_pagar (
  id SERIAL PRIMARY KEY,
  fornecedor VARCHAR(255) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'atrasado', 'pago')),
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP
);

-- Tabela de notificações
CREATE TABLE notificacoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('info', 'alerta', 'urgente')),
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_leitura TIMESTAMP
);

-- Inserir dados iniciais

-- Usuários iniciais
INSERT INTO usuarios (nome, email, senha, tipo) VALUES 
('Administrador', 'admin@protechlab.com', '$2a$10$JGHjJQjmKrJMu.9LNBQo7.XK5IbVtQVP8Q8WjZ9L5o5YYzBw5xKjW', 'admin'),
('Técnico', 'tecnico@protechlab.com', '$2a$10$JGHjJQjmKrJMu.9LNBQo7.XK5IbVtQVP8Q8WjZ9L5o5YYzBw5xKjW', 'tecnico');

-- Serviços iniciais (conforme especificado pelo cliente)
INSERT INTO servicos (nome, descricao, preco) VALUES 
('Prótese Total', 'Prótese dentária completa', 450.00),
('Prótese Parcial Removível', 'Prótese dentária parcial removível', 520.00),
('Protocolo de Implantes Total', 'Protocolo completo para implantes', 1350.00),
('Provisório em Resina Impressa', 'Provisório em resina impressa 3D', 50.00);

-- Clientes e profissionais de exemplo
INSERT INTO clientes (nome, tipo, endereco, telefone, email) VALUES 
('Clínica Odontológica Sorriso Perfeito', 'clinica', 'Av. Paulista, 1000, São Paulo, SP', '(11) 3456-7890', 'contato@sorrisoperfeito.com.br'),
('Clínica Dental Care', 'clinica', 'Rua Augusta, 500, São Paulo, SP', '(11) 2345-6789', 'contato@dentalcare.com.br'),
('Dr. Roberto Almeida', 'profissional', 'Rua Oscar Freire, 200, São Paulo, SP', '(11) 98765-4321', 'dr.roberto@gmail.com');

INSERT INTO profissionais (cliente_id, nome, especialidade, telefone, email) VALUES 
(1, 'Dra. Ana Silva', 'Ortodontia', '(11) 97654-3210', 'dra.ana@sorrisoperfeito.com.br'),
(1, 'Dr. Carlos Oliveira', 'Implantodontia', '(11) 96543-2109', 'dr.carlos@sorrisoperfeito.com.br'),
(2, 'Dra. Mariana Santos', 'Prótese Dentária', '(11) 95432-1098', 'dra.mariana@dentalcare.com.br');

-- Materiais de exemplo
INSERT INTO materiais (nome, descricao, quantidade, unidade, preco_unitario, estoque_minimo) VALUES 
('Resina Acrílica Termopolimerizável', 'Para confecção de próteses totais', 5, 'kg', 120.00, 2),
('Dentes Trilux', 'Dentes artificiais para próteses', 100, 'unidade', 1.50, 20),
('Gesso Pedra Tipo III', 'Para modelos de trabalho', 10, 'kg', 15.00, 3),
('Zircônia', 'Para confecção de coroas e pontes', 2, 'disco', 350.00, 1),
('Dissilicato de Lítio', 'Para confecção de coroas e facetas', 3, 'bloco', 180.00, 1);

-- Ordens de serviço de exemplo
INSERT INTO ordens_servico (cliente_id, profissional_id, data_entrega, urgencia, status, observacoes) VALUES 
(1, 1, CURRENT_DATE + INTERVAL '5 days', FALSE, 'pendente', 'Paciente alérgico a metal'),
(2, 3, CURRENT_DATE + INTERVAL '3 days', TRUE, 'em_andamento', 'Prioridade alta - paciente viaja em 4 dias'),
(3, NULL, CURRENT_DATE + INTERVAL '7 days', FALSE, 'pendente', 'Verificar cor com o dentista antes de finalizar');

-- Itens das ordens de serviço
INSERT INTO itens_ordem_servico (ordem_servico_id, servico_id, quantidade, cor_dente, escala_cor, material, valor_unitario, valor_total) VALUES 
(1, 1, 1, 'A2', 'Vita', 'Resina Acrílica', 450.00, 450.00),
(2, 3, 1, 'B1', 'Vita', 'Zircônia', 1350.00, 1350.00),
(3, 2, 1, 'A3', 'Vita', 'Resina Acrílica', 520.00, 520.00),
(3, 4, 2, 'A3', 'Vita', 'Resina 3D', 50.00, 100.00);

-- Contas a receber
INSERT INTO contas_receber (cliente_id, ordem_servico_id, descricao, valor, data_vencimento, status) VALUES 
(1, 1, 'OS #1 - Prótese Total', 450.00, CURRENT_DATE + INTERVAL '15 days', 'pendente'),
(2, 2, 'OS #2 - Protocolo de Implantes', 1350.00, CURRENT_DATE + INTERVAL '10 days', 'pendente'),
(3, 3, 'OS #3 - Prótese Parcial + Provisórios', 620.00, CURRENT_DATE + INTERVAL '20 days', 'pendente');

-- Contas a pagar
INSERT INTO contas_pagar (fornecedor, descricao, valor, data_vencimento, status) VALUES 
('Dental Cremer', 'Compra de materiais - NF 12345', 850.00, CURRENT_DATE + INTERVAL '5 days', 'pendente'),
('Angelus Dental', 'Compra de zircônia - NF 54321', 700.00, CURRENT_DATE + INTERVAL '10 days', 'pendente'),
('Aluguel', 'Aluguel do laboratório - Mês atual', 1200.00, CURRENT_DATE + INTERVAL '2 days', 'pendente');

-- Notificações
INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo) VALUES 
(1, 'Bem-vindo ao ProTech Lab', 'Bem-vindo ao sistema de gerenciamento do laboratório de prótese. Explore as funcionalidades e comece a usar!', 'info'),
(1, 'Ordem de serviço urgente', 'A ordem de serviço #2 foi marcada como urgente e precisa ser entregue em 3 dias.', 'urgente'),
(2, 'Estoque baixo', 'O material "Resina Acrílica Termopolimerizável" está com estoque abaixo do mínimo.', 'alerta'),
(2, 'Ordem de serviço urgente', 'A ordem de serviço #2 foi marcada como urgente e precisa ser entregue em 3 dias.', 'urgente');
