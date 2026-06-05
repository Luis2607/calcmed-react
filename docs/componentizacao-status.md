> ⚠️ **DOC HISTÓRICO** — descreve uma fase anterior do protótipo (iframe golden / não-portado / pré-git). Hoje as 5 centrais são React nativo e tudo está versionado. Mantido como registro; **não usar como verdade atual** (ver `docs/00-index.md`).

# Componentização — status e gaps (vivo)

Atualizado: 2026-05-26. Atualizar a cada avanço.

## Resumo

| Camada | Status |
|---|---|
| Tokens | OK — DS (`tokens.css`) + adicionados: `--radius-sheet-top`, `--fonte-tamanho-*` (rotulo/auxiliar/corpo/corpo-forte/titulo-sheet/numero/input/micro). Valores vindos do golden/DS, não inventados. |
| Átomos | OK p/ bottomsheets: Button, Checkbox, Radio, SectionLabel, InputField (borda dupla + setas corrigidas, tipografia tokenizada). |
| Moléculas | OK — sheet/* (Header, Body, Footer, Section, Alert, OptionList, Text, List, Textarea, Media, ChecklistItem, CalculationBlock, ActionItem, DetailRow) + ProtocolSteps + InputField + Stepper(numérico). |
| Organismos | OK — BottomSheet (focus trap, scroll lock, ESC, close preenchido) + ProtocolHeader + AlertCard + HistoryView. |
| Patterns | OK — 8: Info, Select, Confirm, Form, Tool, Action, Checklist, Detail. Barrels completos. |
| Templates/telas | PARCIAL — só CAD é React de ponta a ponta. |

## Bottomsheets: 100% componentizados e testáveis

Área de QA em `features/ds/SheetGallery` (rota `ds-sheets`): **40 sheets** abríveis.
- Padrões DS (8) · CAD (8) · SCA (10) · Sepse (5) · PCR (5) · AVC (4).
- Todos reproduzidos fiéis ao golden, no padrão novo, com tokens.

## O que falta pra 100% das TELAS

Os bottomsheets estão prontos. Para as TELAS ficarem 100% na arquitetura nova, falta **portar os fluxos do golden pro React** — porque SCA/Sepse/PCR/AVC rodam como iframe do HTML validado:

1. **SCA** — header+stepper+telas+lógica (Sgarbossa, P2Y12, classificação ECG, reperfusão, timers).
2. **Sepse** — bundle, SOFA/qSOFA, vasopressor, timers.
3. **PCR** — ciclos, adrenalina/desfibrilação, timers, RCE.
4. **AVC** — NIHSS, janela, contraindicações, dose trombolítico.
5. **CAD** — já é React; falta só plugar os sheets restantes (anotação/histórico/infos/reset) no fluxo vivo (hoje estão na área de QA).

Regra: porte com **paridade verificada** contra o golden (tela-a-tela, sheet-a-sheet). É grande, multi-sessão e clínico — não rushar (risco de erro de dose/conduta).

## Débitos menores

- `AlertCard` e `Button` têm hex cravado (`#7f1d1d`, `#78350f`…) — tokenizar.
- `GoldenProtocolFrame.module.css` tem `.backBar/.backButton/.backTitle` mortos (barra removida) — limpar.
- Chrome do CADFlow (cards/conteúdo das telas T1–T6) ainda tem estilo inline — migrar pra componentes/tokens no port.
