import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getContasReceber, 
  getContasReceberDetalhadas,
  getContasReceberPorStatus,
  createContaReceber,
  registrarPagamento,
  atualizarStatusContasVencidas
} from '@/lib/db/contas-receber';

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
    const status = searchParams.get('status');
    const atualizarVencidas = searchParams.get('atualizar_vencidas') === 'true';
    
    // Atualizar status de contas vencidas, se solicitado
    if (atualizarVencidas) {
      const contasAtualizadas = await atualizarStatusContasVencidas();
      console.log(`${contasAtualizadas} contas atualizadas para status 'atrasado'`);
    }
    
    let contas;
    if (status) {
      contas = await getContasReceberPorStatus(status as any);
    } else if (detalhada) {
      contas = await getContasReceberDetalhadas();
    } else {
      contas = await getContasReceber();
    }
    
    return NextResponse.json({ contas });
  } catch (error) {
    console.error('Erro ao buscar contas a receber:', error);
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
      ordem_servico_id, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status 
    } = await request.json();
    
    if (!cliente_id || !descricao || valor === undefined || !data_vencimento) {
      return NextResponse.json(
        { error: 'Cliente, descrição, valor e data de vencimento são obrigatórios' },
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
    
    const id = await createContaReceber({ 
      cliente_id, 
      ordem_servico_id, 
      descricao, 
      valor, 
      data_vencimento, 
      data_pagamento, 
      status 
    });
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Conta a receber criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar conta a receber:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
