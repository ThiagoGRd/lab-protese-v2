import { D1Database } from '@cloudflare/workers-types';

export interface CloudflareContext {
  DB: D1Database;
}

export function getCloudflareContext(): CloudflareContext | null {
  // @ts-ignore
  const ctx = process.env.CLOUDFLARE_CONTEXT;
  if (!ctx) return null;
  return JSON.parse(ctx);
}

export async function executeQuery<T = any>(
  query: string, 
  params: any[] = [],
  context?: CloudflareContext
): Promise<T[]> {
  const ctx = context || getCloudflareContext();
  if (!ctx) {
    throw new Error('Contexto do Cloudflare não disponível');
  }

  try {
    const result = await ctx.DB.prepare(query).bind(...params).all();
    return result.results as T[];
  } catch (error) {
    console.error('Erro ao executar query:', error);
    throw error;
  }
}

export async function executeSingleQuery<T = any>(
  query: string, 
  params: any[] = [],
  context?: CloudflareContext
): Promise<T | null> {
  const results = await executeQuery<T>(query, params, context);
  return results.length > 0 ? results[0] : null;
}
