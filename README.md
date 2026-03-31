# Estruturas Lineares Frontend

Aplicacao web em React + TypeScript para consumo de API REST de estruturas lineares: Pilha, Fila e Lista.

## Funcionalidades

- Navegacao com React Router entre as paginas de Pilha, Fila e Lista.
- Barra de menu fixa em todas as paginas.
- Exibicao de estatisticas da API no menu (total de estruturas e resumo em uso).
- Atualizacao dinamica da interface apos cada operacao.
- Tratamento de erros com mensagens claras para falhas de comunicacao, estrutura vazia, indice invalido e entrada invalida.
- Timeout e retry configuraveis para chamadas HTTP da API.
- Modo simulado opcional (somente quando habilitado por variavel de ambiente).

## Tecnologias

- React 18
- TypeScript 5
- Vite 5
- React Router DOM 6
- Docker / Docker Compose

## Requisitos

- Node.js 20+
- npm 10+
- Docker e Docker Compose (opcional, para execucao containerizada)

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`.

Exemplo:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_MOCK_MODE=false
VITE_API_TIMEOUT_MS=8000
VITE_API_RETRY_COUNT=1
```

Descricao rapida:

- `VITE_API_BASE_URL`: URL base da API REST.
- `VITE_ENABLE_MOCK_MODE`: habilita fallback para servico simulado (`true` ou `false`).
- `VITE_API_TIMEOUT_MS`: tempo maximo por requisicao em milissegundos.
- `VITE_API_RETRY_COUNT`: quantidade de novas tentativas para erros de rede/5xx.

## Executando Localmente

1. Instale as dependencias:

```bash
npm install
```

2. Inicie em modo desenvolvimento:

```bash
npm run dev
```

3. Acesse no navegador:

- http://localhost:5173

## Build de Producao

```bash
npm run build
```

## Testes

```bash
npm run test
```

## Estrutura de Pastas

```text
.
|-- Dockerfile
|-- .dockerignore
|-- docker-compose.yml
|-- .env.example
|-- tests
|   |-- apiClient.test.ts
|   `-- linearStructuresService.test.ts
|-- vitest.config.ts
|-- src
|   |-- components
|   |   |-- AppLayout.tsx
|   |   |-- Feedback.tsx
|   |   `-- MenuBar.tsx
|   |-- pages
|   |   |-- StackPage.tsx
|   |   |-- QueuePage.tsx
|   |   `-- ListPage.tsx
|   |-- routes
|   |   `-- AppRoutes.tsx
|   |-- services
|   |   |-- apiClient.ts
|   |   |-- serviceDetector.ts
|   |   |-- mockService.ts
|   |   `-- linearStructuresService.ts
|   |-- styles
|   |   `-- global.css
|   |-- types
|   |   `-- structures.ts
|   |-- App.tsx
|   `-- main.tsx
`-- package.json
```

## Docker

### Build e execucao do frontend

```bash
docker build -t estruturas-lineares-frontend .
docker run --rm -p 5173:5173 -e VITE_API_BASE_URL=http://host.docker.internal:8080 estruturas-lineares-frontend
```

### Execucao integrada com backend

O arquivo `docker-compose.yml` sobe frontend, backend e MongoDB juntos.
O compose tambem possui healthchecks para garantir ordem de inicializacao entre os servicos.

Configuracao recomendada do frontend no compose integrado:

```yaml
frontend:
  environment:
    - VITE_API_BASE_URL=http://localhost:8080
    - VITE_ENABLE_MOCK_MODE=false
```

Observacao: ajuste o caminho de build do backend no compose para o diretorio real da API da Atividade 1.

```yaml
backend:
  build:
    context: ../API/platform-back
```

Para subir:

```bash
docker compose up -d --build
```

Para acompanhar logs:

```bash
docker compose logs -f frontend
docker compose logs -f backend
```

Frontend: http://localhost:5173  
Backend: http://localhost:8080  
MongoDB: mongodb://localhost:27017

## Troubleshooting

### 1) `unable to prepare context: path ... not found`

Causa comum: caminho do backend no `docker-compose.yml` esta incorreto.

Como resolver:

- Confira o `context` do backend:

```yaml
backend:
  build:
    context: ../API/platform-back
```

### 2) `MongoParseError: URI contained empty userinfo section`

Causa comum: `MONGO_URI` ausente ou invalida no backend.

Como resolver:

- Garanta no `docker-compose.yml`:

```yaml
backend:
  environment:
    - MONGO_URI=mongodb://mongo:27017/unilaunch
```

- Suba novamente os containers:

```bash
docker compose down
docker compose up -d --build
```

### 3) `Nao foi possivel conectar com a API`

Causas comuns:

- backend nao iniciou;
- `VITE_API_BASE_URL` incorreta;
- API nao possui os endpoints esperados (`/stats`, `/stack`, `/queue`, `/list`).

Como resolver:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

Confirme tambem se o `.env` esta correto:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_MOCK_MODE=false
```

### 4) Frontend sobe, mas sem dados de Pilha/Fila/Lista

Causa comum: backend em execucao nao e o da Atividade 1/4 (rotas diferentes).

Como resolver:

- Aponte o compose para o backend correto com os endpoints de estruturas lineares;
- ou ajuste `src/services/linearStructuresService.ts` para o contrato real da API.

## Endpoints esperados no backend

- Estatisticas: `GET /stats`
- Pilha: `/stack/push`, `/stack/pop`, `/stack/peek`, `/stack/items`, `/stack/clear`
- Fila: `/queue/enqueue`, `/queue/dequeue`, `/queue/front`, `/queue/items`, `/queue/clear`
- Lista: `/list/append`, `/list/pop`, `/list/last`, `/list/items`, `/list/index/:index`, `/list/clear`

## Observacoes

- Se os endpoints da sua API tiverem nomes diferentes, ajuste a camada de servicos em `src/services/linearStructuresService.ts`.
- O cliente HTTP centralizado fica em `src/services/apiClient.ts`.
- Os testes de servico estao na pasta `tests` e podem ser executados com `npm run test`.
