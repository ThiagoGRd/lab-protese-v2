// setup-db.js
const fs = require('fs');
const path = require('path');

/**
 * Script de configuração para verificar variáveis de ambiente
 * e preparar o deploy na Vercel
 */
function setupDeployment() {
  console.log('🚀 Preparando deploy do ProTech Lab...');
  
  // Verificar variáveis de ambiente essenciais
  const requiredEnvVars = ['POSTGRES_URL', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    console.log('⚠️ Variáveis de ambiente ausentes:');
    missingVars.forEach(envVar => {
      console.log(`   - ${envVar}`);
    });
    
    console.log('\n🔔 Instruções para configuração:');
    console.log('1. Configure as seguintes variáveis no painel da Vercel:');
    
    if (!process.env.POSTGRES_URL) {
      console.log('   - POSTGRES_URL: Adicione um banco de dados Postgres na aba "Storage" da Vercel');
    }
    
    if (!process.env.JWT_SECRET) {
      // Gerar uma string aleatória para JWT_SECRET
      const crypto = require('crypto');
      const jwtSecret = crypto.randomBytes(32).toString('hex');
      console.log(`   - JWT_SECRET: ${jwtSecret}`);
    }
    
    console.log('\n2. Após configurar as variáveis, redeploye o projeto.');
    
    if (process.env.VERCEL === '1') {
      console.warn('⚠️ Variáveis de ambiente ausentes. O deploy pode falhar.');
    }
  } else {
    console.log('✅ Todas as variáveis de ambiente necessárias estão configuradas.');
  }
  
  console.log('\n🌐 Após o deploy, faça login com as credenciais:');
  console.log('   - Admin: admin@protechlab.com / senha123');
  console.log('   - Técnico: tecnico@protechlab.com / senha123');
}

// Executar verificação
setupDeployment();
