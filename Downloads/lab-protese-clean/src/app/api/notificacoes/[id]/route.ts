import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getNotificacaoPorId, 
  marcarComoLida, 
  deleteNotificacao 
} from '@/lib/db/notificacoes';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    const notificacao = await getNotificacaoPorId(id);
    
    if (!notificacao) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ notificacao });
  } catch (error) {
    console.error(`Erro ao buscar notificação ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const { marcar_como_lida } = await request.json();
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    // Verificar se a notificação existe
    const notificacaoExistente = await getNotificacaoPorId(id);
    if (!notificacaoExistente) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }
    
    if (marcar_como_lida) {
      await marcarComoLida(id);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Notificação marcada como lida'
      });
    }
    
    return NextResponse.json({ 
      error: 'Operação não especificada' 
    }, { status: 400 });
  } catch (error) {
    console.error(`Erro ao atualizar notificação ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    // Verificar se a notificação existe
    const notificacaoExistente = await getNotificacaoPorId(id);
    if (!notificacaoExistente) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }
    
    await deleteNotificacao(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notificação excluída com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao excluir notificação ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
