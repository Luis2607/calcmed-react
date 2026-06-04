# IA · Sistema de Respostas (AI Response System)

Especificação da camada de IA do CalcMed. A IA não responde texto corrido: ela
**reconhece a intenção**, **escolhe o pattern** e retorna uma **resposta
estruturada em blocos**, renderizada pelo Design System.

> Documentação viva (interativa): Design System → `?qa=ia-respostas`.
> Conteúdo clínico nos exemplos é **ilustrativo** — validação final pelo time médico.

## Pipeline

```
Usuário → Intent Detection → Response Type → Structured Blocks → UI Renderer (DS) → Follow-up
```

O backend devolve uma **estrutura** (não markdown). O frontend (`AIResponseRenderer`)
mapeia cada bloco para um componente do DS. Isso elimina markdown inconsistente e
mantém visual, espaçamento, cor e acessibilidade sob controle do DS.

## Taxonomia de intenções

Classificação **comportamental** (o tipo de resposta esperado), não por tema médico:

`dose` · `ambigua` · `operacional` · `exame` · `comparacao` · `protocolo` ·
`aprendizado` · `resumo` · `triagem` · `critico`

Rótulos em `src/shared/components/ai/intents.js` (`INTENT_LABELS`).

## Contrato de resposta (handoff)

```jsonc
{
  "intent": "operacional",            // chave da taxonomia
  "risk_level": "alto",               // baixo | medio | alto (opcional)
  "title": "Choque séptico provável",
  "context": "PAM baixa após volume", // linha de contexto (opcional)
  "blocks": [ /* ver tipos abaixo */ ],
  "actions": [ { "label": "Copiar conduta", "value": "q:resumo" } ] // chips no rodapé
}
```

### Tipos de bloco (`blocks[].type`)

| type | campos | componente DS |
|---|---|---|
| `primary_action` | `content`, `label?`, `tone?` ('primary'\|'critico') | `PrimaryAction` |
| `dose` | `value`, `unit`, `via?`, `copyText?` | `DoseBlock` (compõe `DoseDisplay`) |
| `table` | `columns`, `rows`, `caption?` | `Table` |
| `interpretation` | `columns`, `rows`, `reading`, `tone?`, `chips?` | `InterpretationBlock` (compõe `Table`) |
| `checklist` | `items[]`, `tagLabel?`, `tagTone?` | `ChecklistBlock` |
| `alert` | `level`, `title?`, `content` | `AlertCard` |
| `context_selector` | `question`, `options[]` | `ContextSelector` |
| `copyable` | `text` \| `variants[]` | `CopyableBlock` |
| `expandable` | `title`, `hint?`, `content` | `ExpandableSection` |
| `stepper` | `label?`, `current`, `steps[]` | `ProtocolStep` |
| `limitation` | `content`, `title?` | `LimitationNote` (compõe `AlertCard`) |
| `chips` | `items[]`, `label?` | `SuggestionChips` (compõe `Chip`) |
| `text` | `content` | parágrafo |

`options[]`/`items[]` aceitam `string` ou `{ label, value }`. O `value` é o token
de continuação da conversa (interatividade).

## Patterns × intenção

| Pattern | Quando | Intenção |
|---|---|---|
| Compact Answer (`dose`) | dose/fórmula objetiva | `dose` |
| Context Selector | pergunta ambígua | `ambigua` |
| Operational Response | "o que faço agora" | `operacional` |
| Comparison Table | comparar A × B | `comparacao` |
| Interpretation Result | exame/score | `exame` |
| Guided Flow | caso vago | `triagem` |
| Protocol Stepper | protocolo longo | `protocolo` |
| Copyable Summary | reaproveitar fora do chat | `resumo` |
| Critical Alert | alto risco | `critico` |
| Learning Layer | aprender (camadas) | `aprendizado` |

## Kit de componentes

`src/shared/components/ai/` — camada conversacional, sobre os tokens do DS:

- **Container/estrutura:** `AIResponse` (variantes `card` p/ doc, `plain` p/ chat), `AIResponseRenderer`, `ResponseHeader`.
- **Blocos novos:** `PrimaryAction`, `SuggestionChips`, `DoseBlock`, `CopyableBlock`, `ExpandableSection`, `ContextSelector`, `InterpretationBlock`, `LimitationNote`, `ProtocolStep`.
- **Reuso do DS:** `Table`, `ChecklistBlock`, `AlertCard`, `Chip`, `DoseDisplay`, `Tag`.

`AIResponseRenderer` aceita `onSelect(value, meta)` — sem ele a resposta é só
visual (galeria do DS); com ele, seletores/chips/ações continuam a conversa
(usado na tela de IA do protótipo).

## Tela de IA no protótipo

`src/features/ia/` — aba "IA" do Home:

- Abre **direto num chat novo** (pronto p/ digitar). Histórico atrás do ícone de relógio (header direito).
- Respostas em **largura cheia** (`AIResponse variant="plain"`), com reveal progressivo dos blocos.
- "Digitando…" efêmero (nunca persiste); delay menor p/ dose/crítico.
- Conversas persistidas em `localStorage` (`ia_conversations`).
- `iaData.js` é o **roteiro de demonstração** (faz o papel do backend): um backend
  real devolveria o mesmo contrato de resposta.
