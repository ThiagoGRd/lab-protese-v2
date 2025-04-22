import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@/lib/db';
import { 
  getMaterialById, 
  updateMaterial, 
  deleteMaterial,
  ajustarEstoque
} from '@/lib/db/materiais';

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
    
    const material = await getMaterialById(id);
    
    if (!material) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ material });
  } catch (error) {
    console.error(`Erro ao buscar material ${params.id}:`, error);
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
      nome, 
      descricao, 
      quantidade, 
      unidade, 
      preco_unitario, 
      estoque_minimo 
    } = await request.json();
    
    const context = getCloudflareContext();
    if (!context) {
      return NextResponse.json(
        { error: 'Erro de conexão com o banco de dados' },
        { status: 500 }
      );
    }
    
    // Verificar se o material existe
    const materialExistente = await getMaterialById(id);
    if (!materialExistente) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      );
    }
    
    const success = await updateMaterial(id, { 
      nome, 
      descricao, 
      quantidade, 
      unidade, 
      preco_unitario, 
      estoque_minimo 
    });
    
    if (!success) {
      return NextResponse.json(
        { error: 'Nenhum campo foi atualizado' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Material atualizado com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao atualizar material ${params.id}:`, error);
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
    
    // Verificar se o material existe
    const materialExistente = await getMaterialById(id);
    if (!materialExistente) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      );
    }
    
    await deleteMaterial(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Material excluído com sucesso'
    });
  } catch (error) {
    console.error(`Erro ao excluir material ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
