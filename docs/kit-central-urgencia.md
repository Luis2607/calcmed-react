> ⚠️ **DOC HISTÓRICO** — descreve uma fase anterior do protótipo (iframe golden / não-portado / pré-git). Hoje as 5 centrais são React nativo e tudo está versionado. Mantido como registro; **não usar como verdade atual** (ver `docs/00-index.md`).

# Kit de Componentes — Central de Urgência

> Plano consolidado dos componentes que faltam pra Central de Urgência ficar **100% componentizada
> e consistente com o DS**. Fonte: brainstorm do Luis (2026-05-26) + auditoria
> (`audit-central-urgencia-componentizacao.md`). Quase todos são a **fundação pra portar os fluxos
> golden→React** (SCA/Sepse/PCR/AVC ainda são `<iframe>` do HTML legado — só CAD é React nativo).

## Status atual (verificado)
- **CAD**: React nativo (usa tokens; falta polir — InfoButton, extrair section-cards).
- **SCA / Sepse / PCR / AVC**: `GoldenProtocolFrame` (iframe `/golden/...`) — ~0% React nativo.
- **DS pronto e verificado**: Botões, Inputs, Controles, Alertas, Tags/Chips, Componentes Clínicos
  (11/12), BottomSheets. Galerias QA em `?qa=*`.

## Kit a construir (ordem sugerida: código-only primeiro, depois grounded no Figma)

| # | Componente | Tipo | Figma a aterrissar | Esforço | Risco | Notas |
|---|---|---|---|---|---|---|
| K1 | `ProtocolHeader` + prop `steps`/`currentStep` + variante por doença | ESTENDE (existe) | Headers 114:3753 | S–M | baixo | hoje steps é separado; embutir como property. Variante por doença = cor/tom de domínio. |
| K2 | `StepItem` (átomo: default/active/completed/hover/disabled) + recompor `ProtocolSteps` (N=4..7) | EXTRAI átomo (grupo existe) | Headers/steps | S | baixo | ⚠️ NÃO confundir com `Stepper` (numérico +/−). |
| K3 | `TimerCard` (compressões / adrenalina PCR) | NOVO | CENTRAL DE URGÊNCIA / PCR | M–L | baixo (novo) | título + ciclo + timer mono gigante + progress + Segmented (BPM / 3-4-5 min) + ação "Apliquei agora". 2 tons (neutro / crítico). |
| K4 | `ActionTile` (Selecionar ritmo / Desfibrilar) | NOVO | PCR | S–M | baixo | ícone + label + status/valor ("Não avaliado" / "200 J · bifásico"), clicável, em grid. ≠ DisclosureCard (row). |
| K5 | `ActionFooter` (barra fixa acima da navbar) | NOVO | fluxos | M | médio | **Pronto no código.** Linha de hint opcional em cima + meta + fileira de Buttons. Recorrente (CAD Sair/Confirmar, PCR Pausa/Stop/RCE). |
| K6 | `TabBar` (navbar inferior) | NOVO | nav | S–M | médio | **Pronto no código.** Executar / Histórico / Teoria\|ACLS, com badge opcional. |
| K7 | `Timeline` (linha do tempo de eventos do caso) | NOVO | Histórico | M | baixo | **Pronto no código.** Eventos cronológicos (adrenalina, ritmo, choques, medidas). |
| K8 | `PatientDetail` (blocos do caso aberto) | NOVO ou `DetailSheet` | Histórico | M | baixo | **Pronto no código.** Detalhe "blocadinho"; falta decidir no Figma se é sheet ou tela cheia. |

## NOTA: ver `~/.claude/plans/agile-floating-moore.md` — plano de padronização total + revisão adversarial (ordem revisada, gates, blast radius, riscos clínicos). Decisões: golden da fonte (Luis fornece); captura de estrutura dos 5 antes do shell; CAD estrutura por último.

## Dependências / ordem
1. **K1, K2, K5, K6, K7, K8** — prontos no código e expostos em `?qa=urgencia`.
2. **K3–K4** — NOVOS, PCR/fluxo-específicos → **precisam de grounding no Figma** (página "CENTRAL DE URGÊNCIA" 1474:10523 e/ou os HTMLs golden como referência visual).
3. Com K1–K8 prontos, **portar os 4 fluxos golden→React** (task #13) vira composição desses componentes.

## Princípios (inalterados)
- Tokens `--ds-*` / base; zero hardcode (exceto valores não-tokenizados no Figma → logar no ledger).
- Dark via `.modo-escuro`; pediatria via `.modo-pediatrico`.
- Reuse antes de criar. Cada componente: registry + gallery QA + verificação DOM/build.
- Divergências código↔Figma → `figma-sync-ledger.md`.
