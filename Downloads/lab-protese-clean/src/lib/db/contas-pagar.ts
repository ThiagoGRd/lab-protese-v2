import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface ContaPagar {
  id: number;
  fornecedor: string;
  descricao: string;
  valor: number;
  data_emissao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
}

export async function getContasPagar(): Promise<ContaPagar[]> {
  return executeQuery<ContaPagar>(
    'SELECT * FROM contas_pagar ORDER BY data_vencimento'
  );
}

export async function getContasPagarPorStatus(status: ContaPagar['status']): Promise<ContaPagar[]> {
  return executeQuery<ContaPagar>(
    'SELECT * FROM contas_pagar WHERE status = ? ORDER BY data_vencimento',
    [status]
  );
}

export async function getContasPagarPorFornecedor(fornecedor: string): Promise<ContaPagar[]> {
  return executeQuery<ContaPagar>(
    'SELECT * FROM contas_pagar WHERE fornecedor LIKE ? ORDER BY data_vencimento',
    [`%${fornecedor}%`]
  );
}

export async function getContaPagarById(id: number): Promise<ContaPagar | null> {
  return executeSingleQuery<ContaPagar>(
    'SELECT * FROM contas_pagar WHERE id = ?',
    [id]
  );
}

export async function createContaPagar(conta: Omit<ContaPagar, 'id' | 'data_emissao' | 'status'> & { status?: ContaPagar['status'] }): Promise<number> {
  // Determinar status inicial com base na data de vencimento
  let status = conta.status || 'pendente';
  if (!status || status === 'pendente') {
    const hoje = new Date();
    const vencimento = new Date(conta.data_vencimento);
    if (vencimento < hoje) {
      status = 'atrasado';
    }
  }

  const result = await executeQuery<{ id: number }>(
    'INSERT INTO contas_pagar (fornecedor, descricao, valor, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [conta.fornecedor, conta.descricao, conta.valor, conta.data_vencimento, conta.data_pagamento, status]
  );
  return result[0]?.id;
}

export async function updateContaPagar(id: number, conta: Partial<Omit<ContaPagar, 'id' | 'data_emissao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (conta.fornecedor !== undefined) {
    fields.push('fornecedor = ?');
    values.push(conta.fornecedor);
  }
  
  if (conta.descricao !== undefined) {
    fields.push('descricao = ?');
    values.push(conta.descricao);
  }
  
  if (conta.valor !== undefined) {
    fields.push('valor = ?');
    values.push(conta.valor);
  }
  
  if (conta.data_vencimento !== undefined) {
    fields.push('data_vencimento = ?');
    values.push(conta.data_vencimento);
  }
  
  if (conta.data_pagamento !== undefined) {
    fields.push('data_pagamento = ?');
    values.push(conta.data_pagamento);
    
    // Se data de pagamento for definida, atualizar status para pago
    if (conta.data_pagamento) {
      fields.push('status = ?');
      values.push('pago');
    }
  }
  
  if (conta.status !== undefined) {
    fields.push('status = ?');
    values.push(conta.status);
  }

  if (fields.length === 0) return false;

  values.push(id);
  
  await executeQuery(
    `UPDATE contas_pagar SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function registrarPagamento(id: number, dataPagamento: string = new Date().toISOString()): Promise<boolean> {
  await executeQuery(
    'UPDATE contas_pagar SET data_pagamento = ?, status = ? WHERE id = ?',
    [dataPagamento, 'pago', id]
  );
  return true;
}

export async function deleteContaPagar(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM contas_pagar WHERE id = ?', [id]);
  return true;
}

// Função para atualizar status de contas vencidas
export async function atualizarStatusContasVencidas(): Promise<number> {
  const hoje = new Date().toISOString().split('T')[0];
  const result = await executeQuery<{ count: number }>(
    `UPDATE contas_pagar SET status = 'atrasado' 
     WHERE data_vencimento < ? AND status = 'pendente' AND data_pagamento IS NULL
     RETURNING COUNT(*) as count`,
    [hoje]
  );
  return result[0]?.count || 0;
}
