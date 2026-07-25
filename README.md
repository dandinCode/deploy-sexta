# Deploy Sexta

Roguelike de carreira tech no Brasil. Você monta a personalidade com cartas de lendas da computação, sobrevive mês a mês a eventos do mercado e tenta entrar no ranking mundial — sem IA, só regras e RNG com seed.

> Deploy na sexta? Às vezes. Às vezes burnout. Às vezes a Google te chama no LinkedIn.

---

## Índice

- [Como jogar](#como-jogar)
- [Stack](#stack)
- [Subir o projeto](#subir-o-projeto)
- [Arquitetura](#arquitetura)
- [Engine e algoritmos](#engine-e-algoritmos)
- [API](#api)
- [Extensibilidade](#extensibilidade)
- [Scripts úteis](#scripts-úteis)

---

## Como jogar

1. **Draft** — escolha 3 de 8 cartas (Turing, Linus, Hopper…). Cada uma altera atributos e skills.
2. **Mês a mês** — a engine sorteia um evento elegível; você escolhe uma opção e aplica efeitos (salário, empresa, saúde mental, etc.).
3. **Fim de carreira** — aposentadoria, burnout, falência, bilionário, venda da empresa…
4. **Ranking** — a partida entra no leaderboard (patrimônio, longevidade e maior salário).
5. **Compartilhar** — no fim, dá para encaminhar o card do resultado no WhatsApp.

Objetivo implícito: construir uma carreira memorável, não só acumular dinheiro. O score premia reputação, projetos, conquistas e longevidade — e pune burnout/falência.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19, Vite, TypeScript, Tailwind, Zustand |
| Backend | Fastify, Zod, Prisma, PostgreSQL |
| Engine | TypeScript puro em `backend/src/engine` (sem IA) |
| RNG | Mulberry32 com seed (`backend/src/engine/random`) |

---

## Subir o projeto

### Docker (mais simples)

```bash
docker compose up --build
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Health | http://localhost:3001/api/health |

### Desenvolvimento local

**1. Banco**

```bash
docker compose up db -d
```

Configure o backend com `DATABASE_URL` (veja `backend/.env.example`), depois:

```bash
cd backend
npm install
npx prisma db push
npm run dev
```

**2. Frontend**

```bash
cd frontend
npm install
npm run dev
```

Opcional: `VITE_API_URL=http://localhost:3001/api` (já é o default).

### Sem Postgres (memória)

Útil para prototipar a engine sem banco:

```bash
cd backend
npm install
MEMORY_STORE=1 npm run dev
```

PowerShell:

```powershell
$env:MEMORY_STORE="1"; npm run dev
```

---

## Arquitetura

```
Deploy Sexta/
├── frontend/          # UI (draft, mês, fim, ranking, share)
├── backend/
│   ├── src/
│   │   ├── engine/    # simulação, eventos, salário, score…
│   │   ├── data/      # catálogos (cartas, eventos, empresas, eras)
│   │   ├── routes/    # HTTP
│   │   └── services/  # persistência + ranking
│   └── prisma/
├── docker-compose.yml
└── README.md
```

**Fluxo de uma partida**

```
POST /games  →  draft (3 cartas)  →  loop mensal (choose)
     → fim  →  score + ranking  →  share (opcional)
```

A API só orquestra. As regras moram na engine; o conteúdo mora nos catálogos.

---

## Engine e algoritmos

Defaults (`DEFAULT_CONFIG`): começa em **2016**, idade **20**, aposentadoria aos **60**, patrimônio inicial **500**, empresa `primeiro_estagio`, draft **8 cartas / escolha 3**.

### 1. Draft de personalidade

1. Embaralha o catálogo de cartas com o seed da partida.
2. Oferece 8; o jogador confirma exatamente 3.
3. Atributos base começam em **38** (saúde mental **70**).
4. Bônus das cartas são somados e limitados a `0–100`.

Arquivos: `engine/simulation`, `engine/player`, `data/cards/catalog.ts`.

### 2. Seleção de eventos (o coração do roguelike)

A cada mês (`beginMonth`):

```
seed do mês = seed da partida + monthsPlayed × 9973
```

Assim a mesma seed reproduz a mesma carreira.

**Passo a passo**

1. **Elegibilidade** — `meetsRequirement`: ano/mês, riqueza, salário, empresa, senioridade, tempo no nível, path de carreira, atributos e skills mínimos/máximos.
2. **Pool** — eventos com requisitos ok e opções suficientes (≥ 2, ou 1 em eventos forçados como demissão).
3. **Cooldowns duros**
   - últimos **5** eventos (id) não repetem;
   - mesmo `cooldownGroup` bloqueado por **8** meses (ex.: `external_offer`, `technology_trend`, `ai_market`).
4. **Peso efetivo**

```
peso = weight_base
     × modificador_da_era(ano, eventId)
     × vieses_situacionais
     × cooldown_suave(evento)
     × cooldown_suave(grupo)
```

Exemplos de viés:

| Condição | Efeito |
|----------|--------|
| `deploy_friday` em dezembro | × 1.4 |
| tag `burnout` e saúde mental &lt; 40 | × 2 |
| tag `opportunity` e reputação ≥ 60 | × 1.5 |

Cooldown suave (quanto mais recente, menor o peso): curva tipo `0 → 0.02 → 0.08 → 0.25 → 0.5 → 0.75`.

5. **Sorteio** — `rng.weightedPick` sobre o pool. Se vazio, cai em `quiet_month`.

Arquivo principal: `backend/src/engine/events/index.ts`.

### 3. Salário, senioridade, empresa e mercado

**Fórmula base**

```
salário = round( baseSenioridade × multiplicadorEmpresa × multiplicadorMercado )
```

Sem empresa → salário `0`.

**Senioridade (CLT BR, referência)**

| Nível | Base (R$/mês) | Meses p/ subir\* |
|-------|---------------|------------------|
| Estágio | 1.600 | 6 |
| Júnior | 3.200 | 14 |
| Pleno | 6.500 | 20 |
| Sênior | 11.000 | 28 |
| Staff | 16.000 | 32 |
| Tech Lead | 21.000 | 36 |
| Principal | 30.000 | 48 |
| CTO | 45.000 | — |

\*O tempo mínimo entra via requisitos dos eventos de promoção (`minMonthsInLevel`), não como gate solto.

**Empresas** — multiplicadores no catálogo (estágio ~1.0, big tech até ~2.8, startup própria ~0.5), com `minYear`/`maxYear` quando faz sentido histórico.

**Eras de mercado**

| Período | Era | Mult. salário |
|---------|-----|---------------|
| 2016–2019 | Angular / Mobile | 1.0 |
| 2020–2022 | Cloud & Remote | 1.15 |
| 2023–2026 | IA | 1.3 |
| 2027–2035 | Pós-IA | 1.45 |

Cada era também define skills quentes/frias e modificadores de peso por evento.

**Regras de realismo**

- Aumento percentual (`raisePct`) depois é **capado** em `1.4 × faixa` do nível/empresa/mercado.
- Promoção: `max(salário_do_novo_nível, salário_anterior × 1.12)` — sobe de verdade.
- Janeiro: idade +1; salário pode realinhar para cima com a era, nunca para baixo só por mudança de multiplicador.
- Passivo mensal: custo de vida ≈ `1200 + senioridade×500`; patrimônio cresce com ~35% do excedente. Saúde mental oscila conforme o nível atual e a disciplina.

### 4. Loop do mês e finais

```
escolhe opção
  → aplica efeitos
  → fim? senão avança mês
  → fim? senão sorteia próximo evento
```

| Fim | Condição |
|-----|----------|
| `retirement` | idade ≥ 60 |
| `burnout` | saúde mental ≤ 0 |
| `bankruptcy` | patrimônio &lt; −50.000 |
| `billionaire` | patrimônio ≥ 1e9 |
| `company_sale` / `death` | efeito explícito do evento |

### 5. Score

Carreira memorável &gt; só grana:

| Componente | Cálculo (teto) |
|------------|----------------|
| Patrimônio | `min(400, floor(wealth / 5000))` |
| Pico salarial | `min(200, floor(peakSalary / 500))` |
| Reputação | `reputation × 2` |
| Projetos | `projetos × 25` |
| Conquistas | `conquistas × 40` |
| Longevidade | `min(150, monthsPlayed)` |
| Empresas | `histórico × 15` |
| Bônus de final | bilionário +500, venda +300, aposentadoria +200, morte +50, burnout −100, falência −150 |

Resultado: `max(0, soma)`.

Arquivo: `backend/src/engine/simulation/score.ts`.

### 6. Ranking

Ao terminar, cria-se uma entrada idempotente por `gameId`.

| `?by=` | Ordenação |
|--------|-----------|
| `wealth` | patrimônio ↓, score ↓ |
| `longevity` | meses ↓, patrimônio ↓ |
| `salary` | pico salarial ↓, score ↓ |

Default: top 20 (`limit` até 50).


## API

Prefixo: `/api`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Healthcheck |
| `GET` | `/meta` | Cartas, labels, config |
| `POST` | `/games` | Nova partida `{ name?, seed? }` |
| `GET` | `/games/:id` | Estado público |
| `POST` | `/games/:id/draft` | `{ cardIds }` (3 ids) |
| `POST` | `/games/:id/choose` | `{ optionId }` — no fim pode vir `ranking` |
| `GET` | `/ranking` | `?by=wealth\|longevity\|salary&limit=` |

Respostas de jogo enriquecem opções de vaga com `offeredCompany` e `projectedSalary` quando a opção troca de empresa.

---

## Extensibilidade

Conteúdo é data-driven: **não precisa mexer na engine** para adicionar lore.

| Conteúdo | Arquivo |
|----------|---------|
| Cartas | `backend/src/data/cards/catalog.ts` |
| Eventos | `backend/src/data/events/catalog.ts` |
| Empresas | `backend/src/data/companies/catalog.ts` |
| Eras de mercado | `backend/src/data/market/eras.ts` |
| Skills | `backend/src/data/skills/` |

Dicas para eventos novos:

- Defina `weight`, `requirements` e, se fizer sentido, `cooldownGroup`.
- Opções usam `effects` (`setCompanyId`, `raisePct`, `promote`, deltas de atributo/skill, `endGame`…).
- Tags (`burnout`, `opportunity`, …) entram nos vieses situacionais.

---

## Scripts úteis

Na raiz:

```bash
npm run dev:backend
npm run dev:frontend
npm run docker:up
npm run docker:down
npm run smoke          # smoke da engine (tsx)
```

No backend: `prisma:generate`, `prisma:migrate`, `prisma:push`, `db:seed`.

---

## Licença / contribuição

Código aberto. PRs de conteúdo (eventos, cartas, empresas) são especialmente bem-vindas — é o jeito mais barato de deixar o jogo mais vivo.
