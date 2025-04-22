import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { getServicos, createServico, updateServico, deleteServico } from '@/lib/db/servicos';

export async function GET() {
  try {
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    const servicos = await getServicos();
    
    return NextResponse.json({ servicos });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, descricao, preco, ativo } = await request.json();
    
    if (!nome || preco === undefined) {
      return NextResponse.json(
        { error: 'Nome e preço são obrigatórios' },
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
    
    const id = await createServico({ nome, descricao, preco, ativo });
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Serviço criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
