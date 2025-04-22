import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface ContaReceber {
  id: number;
  cliente_id: number;
  ordem_servico_id: number | null;
  descricao: string;
  valor: number;
  data_emissao: string;
  data_vencimento: string;
  data_pagamento: string | null;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
}

export interface ContaReceberDetalhada extends ContaReceber {
  cliente_nome: string;
  ordem_servico_numero?: number;
}

export async function getContasReceber(): Promise<ContaReceber[]> {
  return executeQuery<ContaReceber>(
    'SELECT * FROM contas_receber ORDER BY data_vencimento'
  );
}

export async function getContasReceberDetalhadas(): Promise<ContaReceberDetalhada[]> {
  return executeQuery<ContaReceberDetalhada>(
    `SELECT cr.*, c.nome as cliente_nome, os.id as ordem_servico_numero
     FROM contas_receber cr
     LEFT JOIN clientes c ON cr.cliente_id = c.id
     LEFT JOIN ordens_servico os ON cr.ordem_servico_id = os.id
     ORDER BY cr.data_vencimento`
  );
}

export async function getContasReceberPorStatus(status: ContaReceber['status']): Promise<ContaReceber[]> {
  return executeQuery<ContaReceber>(
    'SELECT * FROM contas_receber WHERE status = ? ORDER BY data_vencimento',
    [status]
  );
}

export async function getContasReceberPorCliente(clienteId: number): Promise<ContaReceber[]> {
  return executeQuery<ContaReceber>(
    'SELECT * FROM contas_receber WHERE cliente_id = ? ORDER BY data_vencimento',
    [clienteId]
  );
}

export async function getContaReceberById(id: number): Promise<ContaReceber | null> {
  return executeSingleQuery<ContaReceber>(
    'SELECT * FROM contas_receber WHERE id = ?',
    [id]
  );
}

export async function getContaReceberDetalhadaById(id: number): Promise<ContaReceberDetalhada | null> {
  return executeSingleQuery<ContaReceberDetalhada>(
    `SELECT cr.*, c.nome as cliente_nome, os.id as ordem_servico_numero
     FROM contas_receber cr
     LEFT JOIN clientes c ON cr.cliente_id = c.id
     LEFT JOIN ordens_servico os ON cr.ordem_servico_id = os.id
     WHERE cr.id = ?`,
    [id]
  );
}

export async function createContaReceber(conta: Omit<ContaReceber, 'id' | 'data_emissao' | 'status'> & { status?: ContaReceber['status'] }): Promise<number> {
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
    'INSERT INTO contas_receber (cliente_id, ordem_servico_id, descricao, valor, data_vencimento, data_pagamento, status) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id',
    [conta.cliente_id, conta.ordem_servico_id, conta.descricao, conta.valor, conta.data_vencimento, conta.data_pagamento, status]
  );
  return result[0]?.id;
}

export async function updateContaReceber(id: number, conta: Partial<Omit<ContaReceber, 'id' | 'data_emissao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (conta.cliente_id !== undefined) {
    fields.push('cliente_id = ?');
    values.push(conta.cliente_id);
  }
  
  if (conta.ordem_servico_id !== undefined) {
    fields.push('ordem_servico_id = ?');
    values.push(conta.ordem_servico_id);
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
    `UPDATE contas_receber SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function registrarPagamento(id: number, dataPagamento: string = new Date().toISOString()): Promise<boolean> {
  await executeQuery(
    'UPDATE contas_receber SET data_pagamento = ?, status = ? WHERE id = ?',
    [dataPagamento, 'pago', id]
  );
  return true;
}

export async function deleteContaReceber(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM contas_receber WHERE id = ?', [id]);
  return true;
}

// Função para atualizar status de contas vencidas
export async function atualizarStatusContasVencidas(): Promise<number> {
  const hoje = new Date().toISOString().split('T')[0];
  const result = await executeQuery<{ count: number }>(
    `UPDATE contas_receber SET status = 'atrasado' 
     WHERE data_vencimento < ? AND status = 'pendente' AND data_pagamento IS NULL
     RETURNING COUNT(*) as count`,
    [hoje]
  );
  return result[0]?.count || 0;
}
