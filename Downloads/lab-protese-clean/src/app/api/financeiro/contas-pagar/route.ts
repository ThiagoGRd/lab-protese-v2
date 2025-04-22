import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getContasPagar, 
  getContasPagarPorStatus,
  createContaPagar,
  registrarPagamento,
  atualizarStatusContasVencidas
} from '@/lib/db/contas-pagar';

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
    const status = searchParams.get('status');
    const fornecedor = searchParams.get('fornecedor');
    const atualizarVencidas = searchParams.get('atualizar_vencidas') === 'true';
    
    // Atualizar status de contas vencidas, se solicitado
    if (atualizarVencidas) {
      const contasAtualizadas = await atualizarStatusContasVencidas();
      console.log(`${contasAtualizadas} contas atualizadas para status 'atrasado'`);
    }
    
    let contas;
    if (status) {
      contas = await getContasPagarPorStatus(status as any);
    } else if (fornecedor) {
      contas = await getContasPagarPorFornecedor(fornecedor);
    } else {
      contas = await getContasPagar();
    }
    
    return NextResponse.json({ contas });
  } catch (error) {
    console.error('Erro ao buscar contas a pagar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      fornecedor, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status 
    } = await request.json();
    
    if (!fornecedor || !descricao || valor === undefined || !data_vencimento) {
      return NextResponse.json(
        { error: 'Fornecedor, descrição, valor e data de vencimento são obrigatórios' },
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
    
    const id = await createContaPagar({ 
      fornecedor, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status 
    });
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Conta a pagar criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar conta a pagar:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
