# Decisões de DS/Figma (ADR-lite) — fonte única

> As decisões pendentes que travam a passagem pro Figma viviam duplicadas em `figma-handoff-plan.md`
> e `figma-handoff-centrais.md`. Aqui é o **registro único**. Cada item: contexto · opções · decisão ·
> status (`PENDENTE` / `DECIDIDO`). Os handoffs apenas linkam pra cá.

## Como usar
- Nova decisão de DS/Figma → entra aqui (não espalhar pelos handoffs).
- Resolver a decisão → marcar `DECIDIDO` + data + impacto, e aplicar no código/Figma.

---

## D1 · Vocabulário de severidade/variante (CRÍTICO p/ component-properties)
- **Contexto:** o mesmo conceito (cor semântica clínica) é exposto com 4 props/enums diferentes —
  `AlertCard.level` (info/warning/critical/result/footnote), `ResultDisplay.level` (success/warning/critical),
  `ScoreResult.risk` (baixo/moderado/alto, PT), `tone` em Tag/Chip/OptionCard/Table/BannerContextual.
  Sem unificar, cada componente vira uma component-property diferente no Figma (não reaproveitável).
- **Opções:** (a) padronizar **uma** prop `tone` com enum canônico `info|success|warning|critical|neutral`;
  `level→tone`; `risk→tone` (baixo→success/moderado→warning/alto→critical); `result/footnote` viram prop
  ortogonal (tipo de bloco, não severidade). (b) manter como está e mapear 4 enums no Figma.
- **Decisão:** PENDENTE (recomendação: opção (a) — refactor de API, fazer com QA visual das 5 centrais + IA).
- **Bônus:** corrigir a troca glifo↔valor no `AlertCard` (warning desenha octógono/critico; critical desenha triângulo/atencao).

## D2 · Idioma dos valores de enum
- **Contexto:** convivem `state:'sucesso'` (PT) + `state:'error'` (EN) no mesmo enum (InputField); `risk` em PT.
- **Decisão:** PENDENTE — escolher um idioma para os **valores** (nomes de prop já são EN). Recomendação: EN nos valores.

## D3 · Tipografia 100% token
- **Contexto:** 24 `*.module.css` ainda setam `font-size`/`line-height`/`font-weight` crus (74 ocorrências) em vez
  de `font: var(--ds-font-*)`. E o registry JS (`design-tokens/typographyTokens.js`) diverge do `tokens.css`
  (valores "FIX" não sincronizados) — as galerias mostram número diferente do que renderiza.
- **Decisão:** PENDENTE — migrar tudo para `font: var(--ds-font-*)` e sincronizar o registry com `tokens.css`
  (fonte única). Garante mapeamento 1:1 com os 29 text-styles do Figma.

## D4 · `darkMode` como prop (anti-pattern)
- **Contexto:** `AlertCard`/`ResultDisplay`/`IconButton` têm prop `darkMode` paralela ao escopo global `.modo-escuro`.
  Dark é modo de página, não de instância → no Figma vira boolean espúrio.
- **Decisão:** PENDENTE — remover `darkMode` das 3 APIs; confiar só em `.modo-escuro`. Deletar `--ds-iconbtn-dark-*`.

## D5 · Dois `Icon` divergentes
- **Contexto:** `ProtocolHeader` tem um `Icon` SVG local (back/audio/edit/exit/clock/plus) paralelo ao átomo `Icon`.
- **Decisão:** PENDENTE — deletar o local; usar o átomo (+ adicionar `exit` ao átomo). Code Connect aponta pra 1 nó.

## D6 · `tokens.css` deve conter só tokens
- **Contexto:** `tokens.css:404-507` declara layout/reset/utilitários/a11y que `global.css` já tem (duplicado e divergente:
  `.page` vs `.page-wrapper`, `.viewport` vs `.viewport-container`).
- **Decisão:** PENDENTE — mover o não-`:root` de `tokens.css` para `global.css` (dedup), deixar `tokens.css` 100% variáveis.

## D7 · Camada de templates das centrais
- **Contexto:** as 5 flows são telas inteiras em `features/`, não em `templates/`. O esqueleto comum (header+abas+footer)
  está disperso. Para "virar telas no Figma" a camada template é a que mapeia telas.
- **Decisão:** PENDENTE — extrair um template comum (`useProtocolSession`/shell) pra a 6ª central nascer compondo, não copiando.

## D9 · Débito de lint do `admin/` (CI ainda não bloqueia lint)
- **Contexto:** `src/admin/` (editor de escores — ferramenta interna) tem 5 erros de lint reais
  (`setState` síncrono em effect em `ScoreEditorModal.jsx:29`/`ScoresListView.jsx:108`; acesso a refs em
  render em `ScoreEditorModal.jsx:48,51`; `id` não usado em `scoreSchema.js:195`). O CI roda lint como
  **informativo** (`continue-on-error`) por causa disso; o build é bloqueante.
- **Decisão:** PENDENTE — limpar o lint do `admin/` (fixes React não-triviais, fazer com cuidado), depois
  remover o `continue-on-error` do `.github/workflows/ci.yml` e tornar o lint **bloqueante**.

## D8 · Decisões herdadas dos handoffs (já listadas lá, consolidadas aqui)
- TimerCard `Tone`×`State`×`Size`; `Domain`→cor (mapa); AlertCard layout horizontal vs vertical; Radio átomo vs Radio Option;
  Icon `critico`/`rodape`; tag tokens sem variável no Figma (TC2/TC3/CC5 do ledger); web como modo de variável vs frames distintos.
- **Decisão:** PENDENTE — resolver em bloco antes da Fase 2 do Figma. (Detalhe técnico nos handoffs + ledger.)
