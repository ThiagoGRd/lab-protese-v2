// setup-db.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de configuração automática do banco de dados para deploy na Vercel
 * 
 * Este script:
 * 1. Verifica se o ambiente Vercel está configurado corretamente
 * 2. Cria a estrutura necessária para o banco D1
 * 3. Executa o script de migração inicial
 * 4. Configura as variáveis de ambiente necessárias
 */

function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados para ProTech Lab...');
  
  try {
    // Verificar se estamos em ambiente Vercel
    const isVercel = process.env.VERCEL === '1';
    if (!isVercel) {
      console.log('⚠️  Este script é destinado para execução no ambiente Vercel.');
      console.log('    Para desenvolvimento local, use o wrangler CLI.');
      return;
    }

    // Criar diretório para D1 (caso não exista)
    const dbDir = path.join(process.cwd(), '.wrangler', 'state', 'v3', 'd1');
    if (!fs.existsSync(dbDir)) {
      console.log('📁 Criando diretório para banco D1...');
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Ler o script SQL de migração
    const migrationPath = path.join(process.cwd(), 'migrations', '0001_initial.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Arquivo de migração não encontrado: ${migrationPath}`);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Criar arquivo de banco de dados SQLite
    const dbFilePath = path.join(dbDir, 'lab-protese-db.sqlite');
    
    // Se o banco já existir, fazer backup
    if (fs.existsSync(dbFilePath)) {
      const backupPath = `${dbFilePath}.backup-${Date.now()}`;
      console.log(`🔄 Banco de dados existente. Criando backup em: ${backupPath}`);
      fs.copyFileSync(dbFilePath, backupPath);
    }
    
    // Criar banco SQLite e executar script de migração
    console.log('🗃️  Criando banco de dados e executando migrações...');
    
    // Inicializar o banco SQLite e executar as migrações
    const sqlite3 = require('better-sqlite3');
    const db = sqlite3(dbFilePath);
    
    // Executar o script de migração completo
    db.exec(migrationSQL);
    
    // Fechar conexão
    db.close();
    
    // Verificar se JWT_SECRET está configurado
    if (!process.env.JWT_SECRET) {
      console.log('🔑 Gerando JWT_SECRET para autenticação...');
      // Gerar string aleatória para JWT_SECRET
      const crypto = require('crypto');
      const jwtSecret = crypto.randomBytes(64).toString('hex');
      
      // Adicionar ao .env.local (para desenvolvimento local)
      fs.appendFileSync('.env.local', `\nJWT_SECRET=${jwtSecret}\n`);
      console.log('✅ JWT_SECRET gerado e adicionado ao .env.local');
      console.log('⚠️  IMPORTANTE: Configure esta variável no painel da Vercel:');
      console.log(`    JWT_SECRET=${jwtSecret}`);
    }
    
    console.log('✅ Configuração de banco de dados concluída com sucesso!');
    console.log('');
    console.log('🌐 Para concluir a implantação na Vercel:');
    console.log('1. Configure as variáveis de ambiente no painel da Vercel:');
    console.log('   - JWT_SECRET (gerado acima)');
    console.log('   - JWT_EXPIRATION=7d');
    console.log('   - DATABASE_URL=file:./.wrangler/state/v3/d1/lab-protese-db.sqlite');
    console.log('2. Associe seu domínio personalizado no painel da Vercel');
    console.log('3. Após o deploy, faça login com as credenciais:');
    console.log('   - Admin: admin@protechlab.com / senha123');
    console.log('   - Técnico: tecnico@protechlab.com / senha123');
    
  } catch (error) {
    console.error('❌ Erro na configuração do banco de dados:');
    console.error(error);
    process.exit(1);
  }
}

// Executar a função principal
setupDatabase();
