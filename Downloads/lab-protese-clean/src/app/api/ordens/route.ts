import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getOrdensServico, 
  getOrdensServicoDetalhadas,
  createOrdemServico, 
  getOrdemServicoDetalhadaById 
} from '@/lib/db/ordens-servico';

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
    const detalhada = searchParams.get('detalhada') === 'true';
    
    let ordens;
    if (detalhada) {
      ordens = await getOrdensServicoDetalhadas();
    } else {
      ordens = await getOrdensServico();
    }
    
    return NextResponse.json({ ordens });
  } catch (error) {
    console.error('Erro ao buscar ordens de serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      cliente_id, 
      profissional_id, 
      data_entrega, 
      urgencia, 
      status, 
      observacoes,
      itens 
    } = await request.json();
    
    if (!cliente_id) {
      return NextResponse.json(
        { error: 'Cliente é obrigatório' },
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
    
    // Criar a ordem de serviço
    const id = await createOrdemServico({ 
      cliente_id, 
      profissional_id, 
      data_entrega, 
      urgencia: urgencia || false, 
      status: status || 'pendente', 
      observacoes 
    });
    
    // Se houver itens, criar os itens da ordem
    if (itens && Array.isArray(itens) && itens.length > 0) {
      const { createItemOrdemServico } = await import('@/lib/db/ordens-servico');
      
      for (const item of itens) {
        await createItemOrdemServico({
          ordem_servico_id: id,
          servico_id: item.servico_id,
          quantidade: item.quantidade || 1,
          cor_dente: item.cor_dente,
          escala_cor: item.escala_cor,
          material: item.material,
          valor_unitario: item.valor_unitario,
          valor_total: (item.quantidade || 1) * item.valor_unitario,
          observacoes: item.observacoes
        });
      }
    }
    
    // Buscar a ordem criada com detalhes
    const ordemCriada = await getOrdemServicoDetalhadaById(id);
    
    return NextResponse.json({ 
      success: true, 
      id,
      ordem: ordemCriada,
      message: 'Ordem de serviço criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
