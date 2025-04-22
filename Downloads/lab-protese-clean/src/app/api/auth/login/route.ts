import { NextRequest, NextResponse } from 'next/server';
import { verificarCredenciais, updateUltimoAcesso } from '@/lib/db/usuarios';
import { getCloudflareContext } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();
    
    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
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
    
    const usuario = await verificarCredenciais(email, senha);
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
    
    // Atualizar último acesso
    await updateUltimoAcesso(usuario.id);
    
    // Remover a senha do objeto de resposta
    const { id, nome, tipo } = usuario;
    
    // Criar token de sessão (simplificado para exemplo)
    // Em produção, usar JWT ou outro método seguro
    const session = {
      id,
      nome,
      email,
      tipo,
      authenticated: true,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      user: { id, nome, email, tipo },
      session
    });
    
  } catch (error) {
    console.error('Erro ao processar login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
