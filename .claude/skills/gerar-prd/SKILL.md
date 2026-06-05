---
name: gerar-prd
description: Gera/atualiza um PRD de feature do CalcMed extraído do CÓDIGO ATUAL, no padrão dos PRDs existentes. Use quando o usuário pedir um PRD, documentação de uma feature, ou para o "cérebro" de uma central/feature. Pode ser paralelizado (um agente por feature).
---

# Gerar PRD (CalcMed)

PRD = documento-cérebro de uma feature, **fonte da verdade = o código atual** (não o que "deveria" ser). Padrão e nível em qualquer `docs/prd-*.md` (ex.: `docs/prd-ia-calcmed.md` é a referência de qualidade). Molde: `docs/_templates/PRD.md`.

## Como fazer
1. **Leia 100% do código da feature** — para as centrais: `src/features/<x>/{X}Flow.jsx`, `{x}Data.js`, `{x}Modais.jsx`, `hooks/use{X}State.js`, CSS. Para a IA: `src/features/ia/*` + `src/shared/components/ai/*`.
2. **Escreva `docs/prd-<feature>.md`** seguindo as seções do molde: sumário, problema, personas, objetivos/métricas, escopo, arquitetura funcional, **RF numerados**, RNF, **mapa de fluxo/estados/cálculos** (cada fórmula com unidades+limites+NaN), edge cases, segurança clínica, UX writing, decisões, backlog, glossário.
3. **Nada inventado** — tudo verificável no código (cite arquivo quando útil). PT-BR, tom clínico.
4. Registre/atualize a entrada no `docs/00-index.md` (status VIVO).

## Paralelizar (várias features de uma vez)
- Use o Agent tool (`model: opus`, `run_in_background`), **um agente por feature** — escrevem arquivos independentes (`docs/prd-cad.md`, `docs/prd-sca.md`…), zero conflito. Cada agente recebe os arquivos da sua feature + `docs/prd-ia-calcmed.md` como template.

## Manter sincronizado (regra §7)
- Mexeu na feature → atualize o PRD dela **na mesma entrega**. Se uma feature antes "pendente" virou implementada, corrija a seção de backlog/decisões do PRD (ex.: AVC hemorrágico, SCA porta-balão).
