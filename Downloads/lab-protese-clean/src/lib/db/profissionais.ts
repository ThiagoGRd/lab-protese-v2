import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Profissional {
  id: number;
  nome: string;
  cliente_id: number | null;
  telefone: string | null;
  email: string | null;
  observacoes: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

export async function getProfissionais(): Promise<Profissional[]> {
  return executeQuery<Profissional>('SELECT * FROM profissionais ORDER BY nome');
}

export async function getProfissionaisByCliente(clienteId: number): Promise<Profissional[]> {
  return executeQuery<Profissional>(
    'SELECT * FROM profissionais WHERE cliente_id = ? ORDER BY nome',
    [clienteId]
  );
}

export async function getProfissionalById(id: number): Promise<Profissional | null> {
  return executeSingleQuery<Profissional>(
    'SELECT * FROM profissionais WHERE id = ?',
    [id]
  );
}

export async function createProfissional(profissional: Omit<Profissional, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO profissionais (nome, cliente_id, telefone, email, observacoes) VALUES (?, ?, ?, ?, ?) RETURNING id',
    [profissional.nome, profissional.cliente_id, profissional.telefone, profissional.email, profissional.observacoes]
  );
  return result[0]?.id;
}

export async function updateProfissional(id: number, profissional: Partial<Omit<Profissional, 'id' | 'data_criacao' | 'data_atualizacao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (profissional.nome !== undefined) {
    fields.push('nome = ?');
    values.push(profissional.nome);
  }
  
  if (profissional.cliente_id !== undefined) {
    fields.push('cliente_id = ?');
    values.push(profissional.cliente_id);
  }
  
  if (profissional.telefone !== undefined) {
    fields.push('telefone = ?');
    values.push(profissional.telefone);
  }
  
  if (profissional.email !== undefined) {
    fields.push('email = ?');
    values.push(profissional.email);
  }
  
  if (profissional.observacoes !== undefined) {
    fields.push('observacoes = ?');
    values.push(profissional.observacoes);
  }

  if (fields.length === 0) return false;

  fields.push('data_atualizacao = CURRENT_TIMESTAMP');
  values.push(id);
  
  await executeQuery(
    `UPDATE profissionais SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function deleteProfissional(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM profissionais WHERE id = ?', [id]);
  return true;
}
