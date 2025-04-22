import { executeQuery, executeSingleQuery } from '@/lib/db';

export interface Notificacao {
  id: number;
  usuario_id: number | null;
  titulo: string;
  mensagem: string;
  tipo: 'sistema' | 'ordem_servico' | 'financeiro' | 'estoque';
  lida: boolean;
  data_criacao: string;
}

export async function getNotificacoes(usuarioId?: number): Promise<Notificacao[]> {
  if (usuarioId) {
    return executeQuery<Notificacao>(
      'SELECT * FROM notificacoes WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY data_criacao DESC',
      [usuarioId]
    );
  } else {
    return executeQuery<Notificacao>(
      'SELECT * FROM notificacoes ORDER BY data_criacao DESC'
    );
  }
}

export async function getNotificacoesNaoLidas(usuarioId?: number): Promise<Notificacao[]> {
  if (usuarioId) {
    return executeQuery<Notificacao>(
      'SELECT * FROM notificacoes WHERE lida = FALSE AND (usuario_id = ? OR usuario_id IS NULL) ORDER BY data_criacao DESC',
      [usuarioId]
    );
  } else {
    return executeQuery<Notificacao>(
      'SELECT * FROM notificacoes WHERE lida = FALSE ORDER BY data_criacao DESC'
    );
  }
}

export async function getNotificacaoPorId(id: number): Promise<Notificacao | null> {
  return executeSingleQuery<Notificacao>(
    'SELECT * FROM notificacoes WHERE id = ?',
    [id]
  );
}

export async function createNotificacao(notificacao: Omit<Notificacao, 'id' | 'data_criacao' | 'lida'>): Promise<number> {
  const result = await executeQuery<{ id: number }>(
    'INSERT INTO notificacoes (usuario_id, titulo, mensagem, tipo, lida) VALUES (?, ?, ?, ?, FALSE) RETURNING id',
    [notificacao.usuario_id, notificacao.titulo, notificacao.mensagem, notificacao.tipo]
  );
  return result[0]?.id;
}

export async function marcarComoLida(id: number): Promise<boolean> {
  await executeQuery(
    'UPDATE notificacoes SET lida = TRUE WHERE id = ?',
    [id]
  );
  return true;
}

export async function marcarTodasComoLidas(usuarioId?: number): Promise<number> {
  let result;
  if (usuarioId) {
    result = await executeQuery<{ count: number }>(
      'UPDATE notificacoes SET lida = TRUE WHERE lida = FALSE AND (usuario_id = ? OR usuario_id IS NULL) RETURNING COUNT(*) as count',
      [usuarioId]
    );
  } else {
    result = await executeQuery<{ count: number }>(
      'UPDATE notificacoes SET lida = TRUE WHERE lida = FALSE RETURNING COUNT(*) as count'
    );
  }
  return result[0]?.count || 0;
}

export async function deleteNotificacao(id: number): Promise<boolean> {
  await executeQuery('DELETE FROM notificacoes WHERE id = ?', [id]);
  return true;
}

// Funções para criar notificações específicas

export async function criarNotificacaoOrdemServico(
  ordemId: number, 
  titulo: string, 
  mensagem: string, 
  usuarioId?: number
): Promise<number> {
  return createNotificacao({
    usuario_id: usuarioId || null,
    titulo,
    mensagem: `Ordem de Serviço #${ordemId}: ${mensagem}`,
    tipo: 'ordem_servico'
  });
}

export async function criarNotificacaoFinanceira(
  titulo: string, 
  mensagem: string, 
  usuarioId?: number
): Promise<number> {
  return createNotificacao({
    usuario_id: usuarioId || null,
    titulo,
    mensagem,
    tipo: 'financeiro'
  });
}

export async function criarNotificacaoEstoque(
  materialId: number,
  materialNome: string,
  quantidade: number,
  usuarioId?: number
): Promise<number> {
  return createNotificacao({
    usuario_id: usuarioId || null,
    titulo: 'Alerta de Estoque',
    mensagem: `O material "${materialNome}" (ID: ${materialId}) está com estoque baixo: ${quantidade} unidades.`,
    tipo: 'estoque'
  });
}
