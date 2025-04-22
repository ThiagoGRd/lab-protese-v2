import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Cliente {
  id: number;
  nome: string;
  tipo: 'clinica' | 'profissional' | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  observacoes: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

export async function getClientes(): Promise<Cliente[]> {
  return executeQuery<Cliente>('SELECT * FROM clientes ORDER BY nome');
}

export async function getClienteById(id: number): Promise<Cliente | null> {
  return executeSingleQuery<Cliente>(
    'SELECT * FROM clientes WHERE id = ?',
    [id]
  );
}

export async function createCliente(cliente: Omit<Cliente, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO clientes (nome, tipo, endereco, telefone, email, observacoes) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [cliente.nome, cliente.tipo, cliente.endereco, cliente.telefone, cliente.email, cliente.observacoes]
  );
  return result[0]?.id;
}

export async function updateCliente(id: number, cliente: Partial<Omit<Cliente, 'id' | 'data_criacao' | 'data_atualizacao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (cliente.nome !== undefined) {
    fields.push('nome = ?');
    values.push(cliente.nome);
  }
  
  if (cliente.tipo !== undefined) {
    fields.push('tipo = ?');
    values.push(cliente.tipo);
  }
  
  if (cliente.endereco !== undefined) {
    fields.push('endereco = ?');
    values.push(cliente.endereco);
  }
  
  if (cliente.telefone !== undefined) {
    fields.push('telefone = ?');
    values.push(cliente.telefone);
  }
  
  if (cliente.email !== undefined) {
    fields.push('email = ?');
    values.push(cliente.email);
  }
  
  if (cliente.observacoes !== undefined) {
    fields.push('observacoes = ?');
    values.push(cliente.observacoes);
  }

  if (fields.length === 0) return false;

  fields.push('data_atualizacao = CURRENT_TIMESTAMP');
  values.push(id);
  
  await executeQuery(
    `UPDATE clientes SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function deleteCliente(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM clientes WHERE id = ?', [id]);
  return true;
}
