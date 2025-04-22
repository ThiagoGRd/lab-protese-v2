import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getOrdemServicoById, 
  getOrdemServicoDetalhadaById,
  updateOrdemServico, 
  deleteOrdemServico,
  getItensOrdemServico,
  createItemOrdemServico,
  updateItemOrdemServico,
  deleteItemOrdemServico
} from '@/lib/db/ordens-servico';

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
    
    const searchParams = request.nextUrl.searchParams;
    const detalhada = searchParams.get('detalhada') === 'true';
    
    let ordem;
    if (detalhada) {
      ordem = await getOrdemServicoDetalhadaById(id);
    } else {
      ordem = await getOrdemServicoById(id);
    }
    
    if (!ordem) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ ordem });
  } catch (error) {
    console.error(`Erro ao buscar ordem de serviço ${params.id}:`, error);
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
    
    const { 
      cliente_id, 
      profissional_id, 
      data_entrega, 
      urgencia, 
      status, 
      observacoes,
      itens 
    } = await request.json();
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    // Verificar se a ordem existe
    const ordemExistente = await getOrdemServicoById(id);
    if (!ordemExistente) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }
    
    // Atualizar a ordem
    const success = await updateOrdemServico(id, { 
      cliente_id, 
      profissional_id, 
      data_entrega, 
      urgencia, 
      status, 
      observacoes 
    });
    
    // Se houver itens, atualizar os itens da ordem
    if (itens && Array.isArray(itens)) {
      // Obter itens existentes
      const itensExistentes = await getItensOrdemServico(id);
      
      // Mapear IDs dos itens existentes
      const idsExistentes = new Set(itensExistentes.map(item => item.id));
      
      // Processar cada item da requisição
      for (const item of itens) {
        if (item.id && idsExistentes.has(item.id)) {
          // Atualizar item existente
          await updateItemOrdemServico(item.id, {
            servico_id: item.servico_id,
            quantidade: item.quantidade,
            cor_dente: item.cor_dente,
            escala_cor: item.escala_cor,
            material: item.material,
            valor_unitario: item.valor_unitario,
            observacoes: item.observacoes
          });
          
          // Remover do conjunto de IDs existentes
          idsExistentes.delete(item.id);
        } else if (!item.id) {
          // Criar novo item
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
      
      // Excluir itens que não estão mais presentes
      for (const itemId of idsExistentes) {
        await deleteItemOrdemServico(itemId);
      }
    }
    
    // Buscar a ordem atualizada com detalhes
    const ordemAtualizada = await getOrdemServicoDetalhadaById(id);
    
    return NextResponse.json({ 
      success: true, 
      ordem: ordemAtualizada,
      message: 'Ordem de serviço atualizada com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao atualizar ordem de serviço ${params.id}:`, error);
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
    
    // Verificar se a ordem existe
    const ordemExistente = await getOrdemServicoById(id);
    if (!ordemExistente) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }
    
    await deleteOrdemServico(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Ordem de serviço excluída com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao excluir ordem de serviço ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
