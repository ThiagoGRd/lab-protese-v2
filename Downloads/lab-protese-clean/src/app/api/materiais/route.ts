import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getMateriais, 
  getMateriaisComEstoqueBaixo,
  createMaterial
} from '@/lib/db/materiais';

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
    const estoqueBaixo = searchParams.get('estoque_baixo') === 'true';
    
    let materiais;
    if (estoqueBaixo) {
      materiais = await getMateriaisComEstoqueBaixo();
    } else {
      materiais = await getMateriais();
    }
    
    return NextResponse.json({ materiais });
  } catch (error) {
    console.error('Erro ao buscar materiais:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      nome, 
      descricao, 
      quantidade, 
      unidade, 
      preco_unitario, 
      estoque_minimo 
    } = await request.json();
    
    if (!nome || quantidade === undefined || !unidade) {
      return NextResponse.json(
        { error: 'Nome, quantidade e unidade são obrigatórios' },
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
    
    const id = await createMaterial({ 
      nome, 
      descricao, 
      quantidade, 
      unidade, 
      preco_unitario, 
      estoque_minimo 
    });
    
    return NextResponse.json({ 
      success: true, 
      id,
      message: 'Material criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar material:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
