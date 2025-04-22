# Guia de Implantação do Sistema ProTech Lab na Vercel

Este guia simplificado mostrará como implantar o sistema ProTech Lab na Vercel e conectá-lo ao seu domínio existente, sem custos adicionais significativos.

## Pré-requisitos

- Conta na Vercel (que você já criou)
- Acesso ao painel de controle do seu domínio
- Git instalado no seu computador (opcional, mas recomendado)

## Passo 1: Preparar o código para implantação

1. Baixe o código completo do sistema:
   - Se você tiver acesso ao código via download direto, extraia-o em uma pasta em seu computador
   - Se você precisar clonar de um repositório Git, use: `git clone [URL_DO_REPOSITÓRIO]`

2. Verifique se a estrutura do projeto está correta:
   - Deve haver um arquivo `package.json` na raiz do projeto
   - Deve haver uma pasta `src` com o código-fonte
   - Deve haver uma pasta `migrations` com o arquivo SQL inicial

3. Se você estiver usando Git (recomendado):
   ```bash
   cd /caminho/para/lab-protese
   git init
   git add .
   git commit -m "Versão inicial do sistema ProTech Lab"
   ```

## Passo 2: Implantar na Vercel

1. Acesse sua conta na Vercel (https://vercel.com)

2. Na dashboard, clique no botão "Add New..." e selecione "Project"

3. Escolha como importar o código:
   - Se você conectou sua conta GitHub/GitLab/Bitbucket, selecione o repositório
   - Ou use "Import Git Repository" se tiver o código em outro repositório Git
   - Ou use a opção "Upload" para fazer upload direto dos arquivos do seu computador

4. Na tela de configuração do projeto:
   - **Nome do projeto**: "protechlab" (ou outro nome de sua preferência)
   - **Framework Preset**: Next.js (deve ser detectado automaticamente)
   - **Root Directory**: ./ (se o código estiver na raiz do repositório)
   - **Build Command**: deixe o padrão (npm run build)
   - **Output Directory**: deixe o padrão (.next)

5. Em "Environment Variables", adicione as seguintes variáveis:
   ```
   DATABASE_URL=file:./data.db
   JWT_SECRET=seu_segredo_jwt_aqui (use uma string aleatória longa)
   JWT_EXPIRATION=7d
   ```

6. Clique em "Deploy" e aguarde a conclusão da implantação (pode levar alguns minutos)

7. Quando a implantação for concluída, você verá uma mensagem de sucesso e um link para acessar o site (algo como https://protechlab.vercel.app)

## Passo 3: Configurar seu domínio existente

1. Na dashboard do projeto na Vercel, clique na aba "Domains"

2. Clique em "Add" e digite o domínio ou subdomínio que você deseja usar:
   - Exemplo: protechlab.seudominio.com.br

3. A Vercel fornecerá instruções específicas para configurar os registros DNS:
   - **Opção CNAME**: Adicione um registro CNAME que aponta para cname.vercel-dns.com
   - **Opção A Records**: Adicione registros A que apontam para os IPs da Vercel (serão mostrados na tela)

4. Acesse o painel de controle do seu provedor de domínio:
   - Localize a seção de gerenciamento de DNS
   - Adicione os registros conforme as instruções da Vercel
   - Salve as alterações

5. Volte à Vercel e clique em "Verify" para verificar se a configuração do DNS está correta
   - Pode levar até 48 horas para as alterações de DNS propagarem completamente, mas geralmente é muito mais rápido (minutos a algumas horas)

## Passo 4: Verificar a implantação

1. Após a verificação do domínio, acesse seu site através do domínio configurado

2. Faça login com as credenciais de teste:
   - **Administrador**: admin@protechlab.com / senha123
   - **Técnico**: tecnico@protechlab.com / senha123

3. Verifique se todas as funcionalidades estão operando corretamente:
   - Cadastro de serviços
   - Gestão de clientes
   - Ordens de serviço
   - Controle financeiro
   - Relatórios
   - Notificações

## Solução de problemas comuns

### Problema: A implantação falha durante o build
- Verifique os logs de build na Vercel para identificar o erro específico
- Certifique-se de que todas as dependências estão listadas no package.json
- Verifique se as variáveis de ambiente necessárias foram configuradas

### Problema: O site carrega, mas o login não funciona
- Verifique se as variáveis de ambiente JWT_SECRET e JWT_EXPIRATION foram configuradas corretamente
- Verifique se o banco de dados foi inicializado corretamente com os usuários de teste

### Problema: O domínio não está funcionando
- Verifique se os registros DNS foram configurados corretamente
- Aguarde o tempo de propagação do DNS (pode levar até 48 horas)
- Use uma ferramenta como dnschecker.org para verificar se os registros DNS estão corretos

### Problema: Erros 500 ou páginas em branco
- Verifique os logs de erro na seção "Functions" da dashboard da Vercel
- Verifique se o banco de dados foi inicializado corretamente

## Manutenção e atualizações

Para atualizar o sistema no futuro:

1. Faça as alterações necessárias no código
2. Se estiver usando Git, faça commit das alterações
3. Faça upload do código atualizado para a Vercel
   - Se estiver usando integração com GitHub/GitLab/Bitbucket, basta fazer push para o repositório
   - Se estiver usando upload manual, repita o processo de upload

A Vercel automaticamente detectará as alterações e implantará a nova versão do sistema.

## Suporte

Se você encontrar problemas durante a implantação, entre em contato para obter assistência adicional.
