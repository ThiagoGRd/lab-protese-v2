import { NextResponse } from 'next/server';
import { atualizarStatusContasVencidas as atualizarContasReceber } from '@/lib/db/contas-receber';
import { atualizarStatusContasVencidas as atualizarContasPagar } from '@/lib/db/contas-pagar';

export async function GET() {
  try {
    // Atualizar status de contas vencidas
    const contasReceberAtualizadas = await atualizarContasReceber();
    const contasPagarAtualizadas = await atualizarContasPagar();
    
    return NextResponse.json({
      success: true,
      contasReceberAtualizadas,
      contasPagarAtualizadas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na manutenção automática:', error);
    return NextResponse.json({ error: 'Erro na manutenção automática' }, { status: 500 });
  }
}
