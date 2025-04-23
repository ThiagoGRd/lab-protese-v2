// src/lib/db/index.ts
import { executeQuery, executeSingleQuery } from '@/lib/postgres';

// Manter a interface e funções exportadas para não quebrar o código existente
export interface CloudflareContext {
  DB: any;
}

export function getCloudflareContext(): CloudflareContext | null {
  // Retornamos um contexto fictício pois não estamos mais usando o D1
  return {
    DB: null
  };
}

// Reexportar as funções do postgres.js para manter compatibilidade
export { executeQuery, executeSingleQuery };
