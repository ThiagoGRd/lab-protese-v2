import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Material {
  id: number;
  nome: string;
  descricao: string | null;
  quantidade: number;
  unidade: string;
  preco_unitario: number | null;
  estoque_minimo: number | null;
  data_criacao: string;
  data_atualizacao: string;
}

export async function getMateriais(): Promise<Material[]> {
  return executeQuery<Material>('SELECT * FROM materiais ORDER BY nome');
}

export async function getMateriaisComEstoqueBaixo(): Promise<Material[]> {
  return executeQuery<Material>(
    'SELECT * FROM materiais WHERE quantidade <= estoque_minimo AND estoque_minimo IS NOT NULL ORDER BY nome'
  );
}

export async function getMaterialById(id: number): Promise<Material | null> {
  return executeSingleQuery<Material>(
    'SELECT * FROM materiais WHERE id = ?',
    [id]
  );
}

export async function createMaterial(material: Omit<Material, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO materiais (nome, descricao, quantidade, unidade, preco_unitario, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?) RETURNING id',
    [material.nome, material.descricao, material.quantidade, material.unidade, material.preco_unitario, material.estoque_minimo]
  );
  return result[0]?.id;
}

export async function updateMaterial(id: number, material: Partial<Omit<Material, 'id' | 'data_criacao' | 'data_atualizacao'>>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (material.nome !== undefined) {
    fields.push('nome = ?');
    values.push(material.nome);
  }
  
  if (material.descricao !== undefined) {
    fields.push('descricao = ?');
    values.push(material.descricao);
  }
  
  if (material.quantidade !== undefined) {
    fields.push('quantidade = ?');
    values.push(material.quantidade);
  }
  
  if (material.unidade !== undefined) {
    fields.push('unidade = ?');
    values.push(material.unidade);
  }
  
  if (material.preco_unitario !== undefined) {
    fields.push('preco_unitario = ?');
    values.push(material.preco_unitario);
  }
  
  if (material.estoque_minimo !== undefined) {
    fields.push('estoque_minimo = ?');
    values.push(material.estoque_minimo);
  }

  if (fields.length === 0) return false;

  fields.push('data_atualizacao = CURRENT_TIMESTAMP');
  values.push(id);
  
  await executeQuery(
    `UPDATE materiais SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function ajustarEstoque(id: number, quantidade: number): Promise<boolean> {
  const material = await getMaterialById(id);
  if (!material) return false;
  
  const novaQuantidade = material.quantidade + quantidade;
  if (novaQuantidade < 0) return false;
  
  await executeQuery(
    'UPDATE materiais SET quantidade = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?',
    [novaQuantidade, id]
  );
  
  return true;
}

export async function deleteMaterial(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM materiais WHERE id = ?', [id]);
  return true;
}
