// src/app/api/init-db/route.ts
import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/postgres';

export async function GET() {
  try {
    await initializeDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Banco de dados inicializado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao inicializar banco de dados',
      details: error.message
    }, { status: 500 });
  }
}
