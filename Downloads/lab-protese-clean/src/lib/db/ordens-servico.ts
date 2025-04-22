import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface OrdemServico {
  id: number;
  cliente_id: number;
  profissional_id: number | null;
  data_cadastro: string;
  data_entrega: string | null;
  urgencia: boolean;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'entregue' | 'cancelado';
  observacoes: string | null;
}

export interface OrdemServicoDetalhada extends OrdemServico {
  cliente_nome: string;
  profissional_nome: string | null;
  itens: ItemOrdemServico[];
  valor_total: number;
}

export interface ItemOrdemServico {
  id: number;
  ordem_servico_id: number;
  servico_id: number;
  servico_nome?: string;
  quantidade: number;
  cor_dente: string | null;
  escala_cor: 'vita' | 'vita3d' | 'outra' | null;
  material: 'zirconia' | 'dissilicato' | 'resina3d' | 'delara' | 'trilux' | 'premium' | 'outro' | null;
  valor_unitario: number;
  valor_total: number;
  observacoes: string | null;
}

export async function getOrdensServico(): Promise<OrdemServico[]> {
  return executeQuery<OrdemServico>(
    'SELECT * FROM ordens_servico ORDER BY data_cadastro DESC'
  );
}

export async function getOrdensServicoDetalhadas(): Promise<OrdemServicoDetalhada[]> {
  const ordens = await executeQuery<OrdemServicoDetalhada>(
    `SELECT os.*, c.nome as cliente_nome, p.nome as profissional_nome,
     (SELECT SUM(valor_total) FROM itens_ordem_servico WHERE ordem_servico_id = os.id) as valor_total
     FROM ordens_servico os
     LEFT JOIN clientes c ON os.cliente_id = c.id
     LEFT JOIN profissionais p ON os.profissional_id = p.id
     ORDER BY os.data_cadastro DESC`
  );

  for (const ordem of ordens) {
    ordem.itens = await getItensOrdemServico(ordem.id);
  }

  return ordens;
}

export async function getOrdemServicoById(id: number): Promise<OrdemServico | null> {
  return executeSingleQuery<OrdemServico>(
    'SELECT * FROM ordens_servico WHERE id = ?',
    [id]
  );
}

export async function getOrdemServicoDetalhadaById(id: number): Promise<OrdemServicoDetalhada | null> {
  const ordem = await executeSingleQuery<OrdemServicoDetalhada>(
    `SELECT os.*, c.nome as cliente_nome, p.nome as profissional_nome,
     (SELECT SUM(valor_total) FROM itens_ordem_servico WHERE ordem_servico_id = os.id) as valor_total
     FROM ordens_servico os
     LEFT JOIN clientes c ON os.cliente_id = c.id
     LEFT JOIN profissionais p ON os.profissional_id = p.id
     WHERE os.id = ?`,
    [id]
  );

  if (ordem) {
    ordem.itens = await getItensOrdemServico(ordem.id);
  }

  return ordem;
}

export async function getOrdensServicoPorStatus(status: OrdemServico['status']): Promise<OrdemServico[]> {
  return executeQuery<OrdemServico>(
    'SELECT * FROM ordens_servico WHERE status = ? ORDER BY data_cadastro DESC',
    [status]
  );
}

export async function getOrdensServicoPorCliente(clienteId: number): Promise<OrdemServico[]> {
  return executeQuery<OrdemServico>(
    'SELECT * FROM ordens_servico WHERE cliente_id = ? ORDER BY data_cadastro DESC',
    [clienteId]
  );
}

export async function getOrdensServicoPorProfissional(profissionalId: number): Promise<OrdemServico[]> {
  return executeQuery<OrdemServico>(
    'SELECT * FROM ordens_servico WHERE profissional_id = ? ORDER BY data_cadastro DESC',
    [profissionalId]
  );
}

export async function createOrdemServico(ordem: Omit<OrdemServico, 'id' | 'data_cadastro'>): Promise<number> {
  // Calcular data de entrega baseada na urgência
  let dataEntrega = ordem.data_entrega;
  if (!dataEntrega) {
    const hoje = new Date();
    const diasUteis = ordem.urgencia ? 3 : 7;
    const dataCalculada = new Date(hoje);
    
    // Adicionar dias úteis (excluindo finais de semana)
    let diasAdicionados = 0;
    while (diasAdicionados < diasUteis) {
      dataCalculada.setDate(dataCalculada.getDate() + 1);
      // 0 = Domingo, 6 = Sábado
      if (dataCalculada.getDay() !== 0 && dataCalculada.getDay() !== 6) {
        diasAdicionados++;
      }
    }
    
    dataEntrega = dataCalculada.toISOString().split('T')[0];
  }

  const result = await executeQuery<{ id: number }>(
    'INSERT INTO ordens_servico (cliente_id, profissional_id, data_entrega, urgencia, status, observacoes) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [ordem.cliente_id, ordem.profissional_id, dataEntrega, ordem.urgencia, ordem.status || 'pendente', ordem.observacoes]
  );
  return result[0]?.id;
}

export async function updateOrdemServico(id: number, ordem: Partial<Omit<OrdemServico, 'id' | 'data_cadastro'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (ordem.cliente_id !== undefined) {
    fields.push('cliente_id = ?');
    values.push(ordem.cliente_id);
  }
  
  if (ordem.profissional_id !== undefined) {
    fields.push('profissional_id = ?');
    values.push(ordem.profissional_id);
  }
  
  if (ordem.data_entrega !== undefined) {
    fields.push('data_entrega = ?');
    values.push(ordem.data_entrega);
  }
  
  if (ordem.urgencia !== undefined) {
    fields.push('urgencia = ?');
    values.push(ordem.urgencia);
  }
  
  if (ordem.status !== undefined) {
    fields.push('status = ?');
    values.push(ordem.status);
  }
  
  if (ordem.observacoes !== undefined) {
    fields.push('observacoes = ?');
    values.push(ordem.observacoes);
  }

  if (fields.length === 0) return false;

  values.push(id);
  
  await executeQuery(
    `UPDATE ordens_servico SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function deleteOrdemServico(id: number): Promise<boolean> {
  // Primeiro excluir os itens relacionados
  await executeQuery('DELETE FROM itens_ordem_servico WHERE ordem_servico_id = ?', [id]);
  // Depois excluir a ordem
  await executeQuery('DELETE FROM ordens_servico WHERE id = ?', [id]);
  return true;
}

// Funções para itens da ordem de serviço

export async function getItensOrdemServico(ordemId: number): Promise<ItemOrdemServico[]> {
  return executeQuery<ItemOrdemServico>(
    `SELECT ios.*, s.nome as servico_nome
     FROM itens_ordem_servico ios
     LEFT JOIN servicos s ON ios.servico_id = s.id
     WHERE ios.ordem_servico_id = ?`,
    [ordemId]
  );
}

export async function getItemOrdemServicoById(id: number): Promise<ItemOrdemServico | null> {
  return executeSingleQuery<ItemOrdemServico>(
    `SELECT ios.*, s.nome as servico_nome
     FROM itens_ordem_servico ios
     LEFT JOIN servicos s ON ios.servico_id = s.id
     WHERE ios.id = ?`,
    [id]
  );
}

export async function createItemOrdemServico(item: Omit<ItemOrdemServico, 'id' | 'servico_nome'>): Promise<number> {
  // Calcular valor total
  const valorTotal = item.quantidade * item.valor_unitario;
  
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO itens_ordem_servico (ordem_servico_id, servico_id, quantidade, cor_dente, escala_cor, material, valor_unitario, valor_total, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
    [item.ordem_servico_id, item.servico_id, item.quantidade, item.cor_dente, item.escala_cor, item.material, item.valor_unitario, valorTotal, item.observacoes]
  );
  return result[0]?.id;
}

export async function updateItemOrdemServico(id: number, item: Partial<Omit<ItemOrdemServico, 'id' | 'servico_nome'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (item.servico_id !== undefined) {
    fields.push('servico_id = ?');
    values.push(item.servico_id);
  }
  
  if (item.quantidade !== undefined) {
    fields.push('quantidade = ?');
    values.push(item.quantidade);
  }
  
  if (item.cor_dente !== undefined) {
    fields.push('cor_dente = ?');
    values.push(item.cor_dente);
  }
  
  if (item.escala_cor !== undefined) {
    fields.push('escala_cor = ?');
    values.push(item.escala_cor);
  }
  
  if (item.material !== undefined) {
    fields.push('material = ?');
    values.push(item.material);
  }
  
  if (item.valor_unitario !== undefined) {
    fields.push('valor_unitario = ?');
    values.push(item.valor_unitario);
    
    // Se o valor unitário ou quantidade mudar, recalcular o valor total
    const itemAtual = await getItemOrdemServicoById(id);
    if (itemAtual) {
      const quantidade = item.quantidade !== undefined ? item.quantidade : itemAtual.quantidade;
      const valorTotal = quantidade * item.valor_unitario;
      fields.push('valor_total = ?');
      values.push(valorTotal);
    }
  } else if (item.quantidade !== undefined) {
    // Se apenas a quantidade mudar, recalcular o valor total
    const itemAtual = await getItemOrdemServicoById(id);
    if (itemAtual) {
      const valorTotal = item.quantidade * itemAtual.valor_unitario;
      fields.push('valor_total = ?');
      values.push(valorTotal);
    }
  }
  
  if (item.observacoes !== undefined) {
    fields.push('observacoes = ?');
    values.push(item.observacoes);
  }

  if (fields.length === 0) return false;

  values.push(id);
  
  await executeQuery(
    `UPDATE itens_ordem_servico SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function deleteItemOrdemServico(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM itens_ordem_servico WHERE id = ?', [id]);
  return true;
}
