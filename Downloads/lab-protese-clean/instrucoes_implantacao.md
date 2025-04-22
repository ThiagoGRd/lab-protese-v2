# Instruções de Implantação - Sistema ProTech Lab

Este documento contém instruções detalhadas para implantar o sistema ProTech Lab no domínio https://protechlab.clinprime.com.br/. Estas instruções são destinadas à equipe de TI responsável pela implantação do sistema.

## Requisitos do Servidor

- Node.js 18.x ou superior
- NPM 8.x ou superior
- Banco de dados SQLite (incluído no projeto) ou outro banco de dados SQL compatível
- Servidor web com suporte a Node.js (Nginx ou Apache recomendados como proxy reverso)
- Certificado SSL para o domínio (recomendado para segurança)

## Estrutura do Projeto

O sistema ProTech Lab é uma aplicação Next.js com as seguintes características:

- Frontend: React com Next.js
- Backend: API Routes do Next.js
- Banco de dados: SQLite (D1 Cloudflare)
- Autenticação: Sistema próprio com tokens JWT

## Passos para Implantação

### 1. Preparação do Servidor

1.1. Instale o Node.js e NPM:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

1.2. Verifique a instalação:
```bash
node -v
npm -v
```

1.3. Instale o PM2 (gerenciador de processos para Node.js):
```bash
sudo npm install -g pm2
```

### 2. Configuração do Domínio

2.1. Configure o DNS do domínio https://protechlab.clinprime.com.br/ para apontar para o IP do seu servidor.

2.2. Obtenha um certificado SSL para o domínio (recomendamos Let's Encrypt):
```bash
sudo apt-get install certbot
sudo certbot certonly --standalone -d protechlab.clinprime.com.br
```

### 3. Configuração do Projeto

3.1. Crie um diretório para o projeto:
```bash
mkdir -p /var/www/protechlab
cd /var/www/protechlab
```

3.2. Copie todos os arquivos do projeto para este diretório.

3.3. Instale as dependências:
```bash
npm install
```

3.4. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
# Configurações do banco de dados
DATABASE_URL=file:./data.db

# Configurações de autenticação
JWT_SECRET=seu_segredo_jwt_aqui
JWT_EXPIRATION=7d

# Configurações do servidor
NEXT_PUBLIC_BASE_URL=https://protechlab.clinprime.com.br
```

3.5. Inicialize o banco de dados:
```bash
mkdir -p .wrangler/state/v3/d1
cp migrations/0001_initial.sql .wrangler/state/v3/d1/
```

### 4. Compilação do Projeto

4.1. Compile o projeto para produção:
```bash
npm run build
```

### 5. Configuração do Servidor Web (Nginx)

5.1. Instale o Nginx:
```bash
sudo apt-get install nginx
```

5.2. Configure o Nginx como proxy reverso. Crie um arquivo de configuração:
```bash
sudo nano /etc/nginx/sites-available/protechlab
```

5.3. Adicione a seguinte configuração:
```nginx
server {
    listen 80;
    server_name protechlab.clinprime.com.br;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name protechlab.clinprime.com.br;

    ssl_certificate /etc/letsencrypt/live/protechlab.clinprime.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/protechlab.clinprime.com.br/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5.4. Ative a configuração:
```bash
sudo ln -s /etc/nginx/sites-available/protechlab /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Inicialização da Aplicação

6.1. Inicie a aplicação com PM2:
```bash
cd /var/www/protechlab
pm2 start npm --name "protechlab" -- start
```

6.2. Configure o PM2 para iniciar automaticamente após reinicialização:
```bash
pm2 startup
pm2 save
```

### 7. Verificação da Implantação

7.1. Acesse https://protechlab.clinprime.com.br/ no navegador para verificar se a aplicação está funcionando corretamente.

7.2. Faça login com as credenciais de teste:
- Administrador: admin@protechlab.com / senha123
- Técnico: tecnico@protechlab.com / senha123

### 8. Manutenção e Atualizações

Para atualizar a aplicação no futuro:

8.1. Pare a aplicação:
```bash
pm2 stop protechlab
```

8.2. Atualize os arquivos do projeto.

8.3. Instale as dependências (se necessário):
```bash
npm install
```

8.4. Compile o projeto:
```bash
npm run build
```

8.5. Reinicie a aplicação:
```bash
pm2 restart protechlab
```

## Solução de Problemas

### Problema: A aplicação não inicia
- Verifique os logs: `pm2 logs protechlab`
- Verifique se todas as dependências foram instaladas: `npm install`
- Verifique se o banco de dados foi inicializado corretamente

### Problema: Erro de conexão com o banco de dados
- Verifique se o arquivo do banco de dados existe e tem permissões corretas
- Verifique as configurações de conexão no arquivo `.env.local`

### Problema: Erro de certificado SSL
- Verifique se o certificado está válido: `sudo certbot certificates`
- Renove o certificado se necessário: `sudo certbot renew`

### Problema: Erro 502 Bad Gateway
- Verifique se a aplicação Node.js está em execução: `pm2 status`
- Verifique os logs do Nginx: `sudo tail -f /var/log/nginx/error.log`

## Contato para Suporte

Se você encontrar problemas durante a implantação, entre em contato com nossa equipe de suporte:

- Email: suporte@protechlab.com
- Telefone: (XX) XXXX-XXXX

---

© 2025 ProTech Lab - Sistema de Gestão para Laboratório de Prótese
