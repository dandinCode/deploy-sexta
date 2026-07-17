# Deploy Sexta

Jogo web de simulação de carreira tech em formato roguelike.

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind + Zustand
- **Backend:** Fastify + Prisma + PostgreSQL
- **Engine:** regras puras em `backend/src/engine` (sem IA)

## Estrutura

```
frontend/
backend/
docker-compose.yml
```

## Subir com Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health: http://localhost:3001/api/health

## Desenvolvimento local

### Banco

```bash
docker compose up db -d
```

## Desenvolvimento local (sem Docker)

Backend com store em memória (útil se o Postgres não estiver no ar):

```bash
cd backend
npm install
MEMORY_STORE=1 npm run dev
```

No PowerShell:

```powershell
$env:MEMORY_STORE="1"; npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API (MVP)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Healthcheck |
| GET | `/api/meta` | Cartas, atributos, skills, config |
| POST | `/api/games` | Nova partida (`{ name?, seed? }`) |
| GET | `/api/games/:id` | Estado da partida |
| POST | `/api/games/:id/draft` | Escolher 3 cartas (`{ cardIds }`) |
| POST | `/api/games/:id/choose` | Escolher opção do evento (`{ optionId }`) |
| GET | `/api/ranking?by=wealth\|longevity` | Ranking mundial (top 20) |

Ao finalizar uma carreira, a entrada entra automaticamente no ranking (patrimônio + longevidade).

## Extensibilidade

Adicione conteúdo sem mexer na engine:

- Cartas → `backend/src/data/cards/catalog.ts`
- Eventos → `backend/src/data/events/catalog.ts`
- Empresas → `backend/src/data/companies/catalog.ts`
- Mercado → `backend/src/data/market/eras.ts`

## Fluxo da engine

```
Estado → filtrar eventos → pesos → sortear → aplicar efeitos → próximo mês
```
