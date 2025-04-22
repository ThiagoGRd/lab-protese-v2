import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getNotificacoes, 
  getNotificacoesNaoLidas,
  createNotificacao,
  marcarComoLida,
  marcarTodasComoLidas
} from '@/lib/db/notificacoes';

export async function GET(request: NextRequest) {
  try {
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    const searchParams = request.nextUrl.searchParams;
    const usuarioId = searchParams.get('usuario_id') ? parseInt(searchParams.get('usuario_id')!) : undefined;
    const apenasNaoLidas = searchParams.get('nao_lidas') === 'true';
    
    let notificacoes;
    if (apenasNaoLidas) {
      notificacoes = await getNotificacoesNaoLidas(usuarioId);
    } else {
      notificacoes = await getNotificacoes(usuarioId);
    }
    
    return NextResponse.json({ notificacoes });
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      usuario_id, 
      titulo, 
      mensagem, 
      tipo 
    } = await request.json();
    
    if (!titulo || !mensagem || !tipo) {
      return NextResponse.json(
        { error: 'Título, mensagem e tipo são obrigatórios' },
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
    
    const id = await createNotificacao({ 
      usuario_id, 
      titulo, 
      mensagem, 
      tipo 
    });
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Notificação criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { marcar_todas_como_lidas, usuario_id } = await request.json();
    
    if (!marcar_todas_como_lidas) {
      return NextResponse.json(
        { error: 'Operação não especificada' },
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
    
    const count = await marcarTodasComoLidas(usuario_id);
    
    return NextResponse.json({ 
      success: true, 
      count,
      message: `${count} notificações marcadas como lidas`
    });
  } catch (error) {
    console.error('Erro ao atualizar notificações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
