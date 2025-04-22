import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'administrador' | 'tecnico' | 'auxiliar';
  data_criacao: string;
  ultimo_acesso: string | null;
}

export async function getUsuarios(): Promise<Usuario[]> {
  return executeQuery<Usuario>('SELECT id, nome, email, tipo, data_criacao, ultimo_acesso FROM usuarios');
}

export async function getUsuarioById(id: number): Promise<Usuario | null> {
  return executeSingleQuery<Usuario>(
    'SELECT id, nome, email, tipo, data_criacao, ultimo_acesso FROM usuarios WHERE id = ?',
    [id]
  );
}

export async function getUsuarioByEmail(email: string): Promise<Usuario | null> {
  return executeSingleQuery<Usuario>(
    'SELECT id, nome, email, tipo, data_criacao, ultimo_acesso FROM usuarios WHERE email = ?',
    [email]
  );
}

export async function createUsuario(usuario: Omit<Usuario, 'id' | 'data_criacao' | 'ultimo_acesso'> & { senha: string }): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?) RETURNING id',
    [usuario.nome, usuario.email, usuario.senha, usuario.tipo]
  );
  return result[0]?.id;
}

export async function updateUsuario(id: number, usuario: Partial<Omit<Usuario, 'id' | 'data_criacao' | 'ultimo_acesso'> & { senha?: string }>): Promise<boolean> {
  const fields: string[] = [];
  const values: any[] = [];

  if (usuario.nome) {
    fields.push('nome = ?');
    values.push(usuario.nome);
  }
  
  if (usuario.email) {
    fields.push('email = ?');
    values.push(usuario.email);
  }
  
  if (usuario.senha) {
    fields.push('senha = ?');
    values.push(usuario.senha);
  }
  
  if (usuario.tipo) {
    fields.push('tipo = ?');
    values.push(usuario.tipo);
  }

  if (fields.length === 0) return false;

  values.push(id);
  
  await executeQuery(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  
  return true;
}

export async function updateUltimoAcesso(id: number): Promise<boolean> {
  await executeQuery(
    'UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
  return true;
}

export async function deleteUsuario(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM usuarios WHERE id = ?', [id]);
  return true;
}

export async function verificarCredenciais(email: string, senha: string): Promise<Usuario | null> {
  return executeSingleQuery<Usuario>(
    'SELECT id, nome, email, tipo, data_criacao, ultimo_acesso FROM usuarios WHERE email = ? AND senha = ?',
    [email, senha]
  );
}
