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
- **Ações/átomos:** `CopyButton` (copiar com micro-interação de check; só confirma cópia real).
- **Reuso do DS:** `Table`, `ChecklistBlock`, `AlertCard`, `Chip`, `DoseDisplay`, `Tag`.

`AIResponseRenderer` aceita `onSelect(value, meta)` — sem ele a resposta é só
visual (galeria do DS); com ele, seletores/chips/ações continuam a conversa
(usado na tela de IA do protótipo).

**Badge de intenção é interno:** o `ResponseHeader` só mostra o rótulo de intenção
("Triagem contextual" etc.) na variante `card` (galeria/doc do DS). Na UI do chat
(`plain`) o badge **não aparece** — a taxonomia é nossa, não do usuário.

## Tela de IA no protótipo

`src/features/ia/` — aba "IA" do Home:

- **Header** = variante do `ProtocolHeader` das centrais (mesma altura/tipografia). Ícone da IA = `ia` (sparkle).
- Abre **direto num chat novo**. Histórico atrás do ícone de relógio (header direito); cards só **nome + data**; o histórico tem **composer próprio** (inicia conversa nova).
- **Sugestões iniciais** numa **faixa horizontal rolável** (curadas, sem ícone) acima do composer, só no estado vazio.
- Respostas em **largura cheia** (`AIResponse variant="plain"`), com reveal progressivo dos blocos.
- **Streaming:** "pensando" **por intenção** — urgência (dose/crítico/protocolo) ~700ms, comparação/aprendizado ~2,4s, demais ~1,5s — com **rótulo de estado** ("Calculando a dose…", "Avaliando o risco…"). Revelação por unidades (~48ms). **Parar** congela e marca "Resposta interrompida" → **Continuar** retoma do ponto exato. **Parar no "pensando"** (antes do 1º token) deixa "Geração cancelada → **Tentar de novo**" (não some a pergunta órfã). Guard síncrono evita **envio duplicado** (double-tap). Progresso efêmero (nunca persiste cru). **`prefers-reduced-motion`: revela a resposta completa de imediato** (sem digitar).
- **Ações por mensagem** (`MessageActions`): copiar (`CopyButton`, micro-check; não confirma cópia vazia), 👍/👎, **Refazer** (só na última; toast com **Desfazer**, pois refazer é determinístico e pode devolver o mesmo). A cópia carimba proveniência (`— Gerado pela IA do CalcMed.`) e serializa a ressalva clínica.
- **Feedback estruturado:** 👍/👎 abre o `IAFeedbackSheet` (BottomSheet do DS) com chips de motivo (multi-seleção, conjuntos distintos p/ up/down) + texto opcional + fineprint "sem dados do paciente"; grava `feedbackReasons`/`feedbackDetail` na mensagem.
- **Editar/reenviar** a última pergunta (devolve ao composer e trunca o último par). **Preserva o token original** se o texto não mudar — editar uma pergunta vinda de chip não cai no fallback.
- **Ressalva de segurança calibrada por risco:** `risk_level: 'alto'` usa copy mais forte ("Valide a dose…") e a `LimitationNote` ganha saliência (tom atenção), em vez de sumir no rodapé.
- **Composer** multilinha (`textarea` auto-resize 1→~5 linhas; Enter envia, Shift+Enter quebra).
- **Onboarding** de 1º acesso = `InfoSheet` **bloqueante** (só fecha pelo CTA); "Sobre a IA · avisos" reabre não-bloqueante.
- Conversas persistidas em `localStorage` (`ia_conversations`); exclusão com **Desfazer** (toast).
- `iaData.js` é o **roteiro de demonstração** (faz o papel do backend): classificação por heurística
  `matchText` + tokens; um backend real devolveria o mesmo contrato de resposta.
- **Robustez (auditoria fundacional, P0):** cada bloco é envolvido por um `BlockBoundary` — payload
  malformado falha sozinho, sem branquear a resposta. `rich()` ignora não-string (evita crash).
  `matchText` usa **limites de palavra** ("noradrenalina" não casa "adrenalina"; `ph`/`pam` no fim da
  frase), só cai em comparação com sinal explícito, prioriza **conduta crítica** sobre marcador
  laboratorial isolado, e cobre hipercalemia amplamente (+ rota navegável). `responseToText` leva
  **ressalva de proveniência** e não perde rótulo de seção do checklist.
