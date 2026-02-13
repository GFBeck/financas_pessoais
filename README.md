# 💰 Aplicativo de Finanças Pessoais

Aplicativo para gerenciamento de finanças pessoais, criado para disponibilizar em ambiente corporativo onde colaboradores podem aprender a controlar suas receitas e despesas.

## 🚀 Recursos

- Cadastro e login com email/senha (ou Google OAuth)
- Adicionar, editar e excluir receitas e despesas
- Categorias personalizadas por usuário (com possibilidade de criar novas)
- Filtro por período com saldo acumulado até a data selecionada
- Gráfico de evolução mensal (linhas de receitas/despesas + barras de saldo)
- Gráficos de pizza para receitas e despesas por categoria
- Tema dark/light (cores Omni Theme da Rocketseat)
- Interface responsiva
- Dados isolados por usuário
- Controle de registro de novos usuários via variável de ambiente

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Copie o arquivo de exemplo e edite:

```bash
cp .env.local.example .env.local
```

### Variáveis de ambiente

| Variável               | Descrição                                                         |
| ---------------------- | ----------------------------------------------------------------- |
| `NEXTAUTH_URL`         | URL da aplicação (ex: `http://localhost:3000`)                    |
| `NEXTAUTH_SECRET`      | Chave secreta para criptografia de sessões                        |
| `AUTH_MODE`            | Modo de autenticação (ver abaixo)                                 |
| `ALLOW_REGISTRATION`   | `true` ou `false` — controla se novos usuários podem se cadastrar |
| `GOOGLE_CLIENT_ID`     | Client ID do Google OAuth (só para modos `public` e `whitelist`)  |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google OAuth                                     |
| `ALLOWED_EMAILS`       | Lista de emails separados por vírgula (só para modo `whitelist`)  |

### Gerar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## 🔐 Modos de Autenticação (AUTH_MODE)

### `credentials` — Email e Senha (recomendado para uso corporativo)

```env
AUTH_MODE=credentials
ALLOW_REGISTRATION=true
```

- Usuários criam conta com nome, email e senha
- Senhas são salvas com hash seguro (bcrypt)
- Dados armazenados localmente em `users.json`
- Cada usuário vê apenas suas transações
- Não precisa de Google OAuth configurado

**Fluxo de operação:**

1. Configure `ALLOW_REGISTRATION=true`
2. Informe aos colaboradores a URL do sistema
3. Cada um cria sua conta em "Criar conta"
4. Quando todos estiverem cadastrados, mude para `ALLOW_REGISTRATION=false` e reinicie o servidor
5. Ninguém mais consegue criar conta, mas quem já tem continua acessando normalmente

### `disabled` — Sem autenticação

```env
AUTH_MODE=disabled
```

- Acesso direto sem login
- Ideal para uso pessoal/local
- Todos os dados ficam em um único usuário ("local-user")
- Não precisa de nenhuma configuração adicional

### `public` — Google OAuth aberto

```env
AUTH_MODE=public
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
```

- Qualquer pessoa com conta Google pode acessar
- Dados isolados por conta Google
- Requer configuração de credenciais no Google Cloud Console

### `whitelist` — Google OAuth restrito

```env
AUTH_MODE=whitelist
GOOGLE_CLIENT_ID=seu-client-id
GOOGLE_CLIENT_SECRET=seu-client-secret
ALLOWED_EMAILS=email1@gmail.com,email2@gmail.com
```

- Apenas emails listados em `ALLOWED_EMAILS` podem acessar
- Requer configuração de credenciais no Google Cloud Console

## 🏃 Executar

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Armazenamento de dados

O app usa arquivos JSON locais:

| Arquivo      | Conteúdo                                    |
| ------------ | ------------------------------------------- |
| `data.json`  | Transações financeiras de todos os usuários |
| `users.json` | Cadastro de usuários (modo credentials)     |

Ambos são criados automaticamente na primeira execução e estão no `.gitignore`.

**Backup:** Para fazer backup dos dados, copie os arquivos `data.json` e `users.json`.

## 🔧 Administração

### Bloquear novos cadastros

Edite `.env.local`:

```env
ALLOW_REGISTRATION=false
```

Reinicie o servidor. A opção "Criar conta" desaparece da tela de login.

### Reabrir cadastros

Mude para `true` e reinicie:

```env
ALLOW_REGISTRATION=true
```

### Trocar modo de autenticação

Mude `AUTH_MODE` no `.env.local` e reinicie o servidor. Os dados em `data.json` são mantidos (vinculados ao userId de cada modo).

## 🎨 Tecnologias

- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- NextAuth.js
- bcryptjs (hash de senhas)
- Recharts (gráficos)

## 🌐 Deploy em produção

1. Configure as variáveis de ambiente no servidor/provedor
2. Atualize `NEXTAUTH_URL` para a URL de produção
3. Build e start:

```bash
npm run build
npm start
```

**Importante:** Em produção, garanta que os arquivos `data.json` e `users.json` estejam em um diretório persistente (não efêmero).
