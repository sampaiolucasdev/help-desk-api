# Help Desk API

API REST para gerenciamento de chamados de suporte técnico,
desenvolvida com Node.js, TypeScript, Express, PostgreSQL e Prisma.

## Funcionalidades

- Cadastro e autenticação de usuários
- Autenticação com JWT
- Controle de acesso por papel
- Criação e consulta de chamados
- Atribuição de técnicos
- Alteração de status e prioridade
- Comentários em chamados
- Histórico de alterações
- Cadastro de departamentos e categorias
- Validação de dados com Zod
- Tratamento centralizado de erros
- Limitação de tentativas de login
- Testes automatizados com Jest e Supertest

## Papéis

- REQUESTER: abre e acompanha os próprios chamados
- TECHNICIAN: atende chamados autorizados
- ADMIN: administra o sistema e atribui chamados

## Requisitos

- Node.js 22.20.0
- npm 10.9.3
- Docker Desktop
- PostgreSQL 17.6, executado via Docker

## Instalação

1. Clone o repositório.
2. Instale as dependências:

   npm ci

3. Crie um arquivo `.env` com as variáveis necessárias.
4. Inicie o banco:

   docker compose up -d

5. Gere o cliente Prisma:

   npx prisma generate

6. Aplique as migrações:

   npx prisma migrate dev

7. Crie os dados iniciais:

   npm run prisma:seed

8. Inicie a API:

   npm run dev

## Variáveis de ambiente

- NODE_ENV
- PORT
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- SEED_DEFAULT_PASSWORD

Nunca publique credenciais reais no repositório.

## Endpoints

### Saúde

- GET /health

### Autenticação

- POST /api/auth/register
- POST /api/auth/login

### Chamados

- POST /api/tickets
- GET /api/tickets
- GET /api/tickets/:id
- POST /api/tickets/:id/assign
- PATCH /api/tickets/:id/status
- POST /api/tickets/:id/comments
- GET /api/tickets/:id/history

### Catálogo

- GET /api/catalog/departments
- GET /api/catalog/categories
- POST /api/catalog/departments (ADMIN)
- POST /api/catalog/categories (ADMIN)

## Testes

Configure um banco exclusivo para testes e execute:

npm test

## Compilação

npm run build

## Iniciar em modo de produção

npm start