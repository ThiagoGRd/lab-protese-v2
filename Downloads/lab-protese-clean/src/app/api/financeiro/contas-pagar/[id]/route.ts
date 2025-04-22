import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getContaPagarById, 
  updateContaPagar, 
  deleteContaPagar,
  registrarPagamento
} from '@/lib/db/contas-pagar';

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
    
    const conta = await getContaPagarById(id);
    
    if (!conta) {
      return NextResponse.json(
        { error: 'Conta a pagar não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ conta });
  } catch (error) {
    console.error(`Erro ao buscar conta a pagar ${params.id}:`, error);
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
      fornecedor, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status,
      registrar_pagamento
    } = await request.json();
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    // Verificar se a conta existe
    const contaExistente = await getContaPagarById(id);
    if (!contaExistente) {
      return NextResponse.json(
        { error: 'Conta a pagar não encontrada' },
        { status: 404 }
      );
    }
    
    // Se a opção de registrar pagamento estiver ativa, chamar a função específica
    if (registrar_pagamento) {
      await registrarPagamento(id, data_pagamento);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Pagamento registrado com sucesso'
      });
    }
    
    // Caso contrário, atualizar normalmente
    const success = await updateContaPagar(id, { 
      fornecedor, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status 
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Nenhum campo foi atualizado' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conta a pagar atualizada com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao atualizar conta a pagar ${params.id}:`, error);
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
    
    // Verificar se a conta existe
    const contaExistente = await getContaPagarById(id);
    if (!contaExistente) {
      return NextResponse.json(
        { error: 'Conta a pagar não encontrada' },
        { status: 404 }
      );
    }
    
    await deleteContaPagar(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conta a pagar excluída com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao excluir conta a pagar ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
