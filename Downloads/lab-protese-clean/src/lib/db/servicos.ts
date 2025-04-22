import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Servico {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  ativo: boolean;
  data_criacao: string;
  data_atualizacao: string;
}

export async function getServicos(apenasAtivos: boolean = true): Promise<Servico[]> {
  const query = apenasAtivos 
    ? 'SELECT * FROM servicos WHERE ativo = TRUE ORDER BY nome'
    : 'SELECT * FROM servicos ORDER BY nome';
  return executeQuery<Servico>(query);
}

export async function getServicoById(id: number): Promise<Servico | null> {
  return executeSingleQuery<Servico>(
    'SELECT * FROM servicos WHERE id = ?',
    [id]
  );
}

export async function createServico(servico: Omit<Servico, 'id' | 'data_criacao' | 'data_atualizacao' | 'ativo'> & { ativo?: boolean }): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO servicos (nome, descricao, preco, ativo) VALUES (?, ?, ?, ?) RETURNING id',
    [servico.nome, servico.descricao || null, servico.preco, servico.ativo !== undefined ? servico.ativo : true]
  );
  return result[0]?.id;
}

export async function updateServico(id: number, servico: Partial<Omit<Servico, 'id' | 'data_criacao' | 'data_atualizacao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (servico.nome !== undefined) {
    fields.push('nome = ?');
    values.push(servico.nome);
  }
  
  if (servico.descricao !== undefined) {
    fields.push('descricao = ?');
    values.push(servico.descricao);
  }
  
  if (servico.preco !== undefined) {
    fields.push('preco = ?');
    values.push(servico.preco);
  }
  
  if (servico.ativo !== undefined) {
    fields.push('ativo = ?');
    values.push(servico.ativo);
  }

  if (fields.length === 0) return false;

  fields.push('data_atualizacao = CURRENT_TIMESTAMP');
  values.push(id);
  
  await executeQuery(
    `UPDATE servicos SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function deleteServico(id: number): Promise<boolean> {
  // Soft delete - apenas marca como inativo
  await executeQuery(
    'UPDATE servicos SET ativo = FALSE, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return true;
}

export async function hardDeleteServico(id: number): Promise<boolean> {
  // Hard delete - remove permanentemente
  await executeQuery('DELETE FROM servicos WHERE id = ?', [id]);
  return true;
}
