# PRD — <Feature> (CalcMed)

> **Status:** <protótipo / em validação> · **Destino:** P.O. · **Plataforma:** mobile-first (390px), React + Vite
> **Docs irmãos:** `docs/figma-handoff-*.md` · `docs/00-index.md`
> Molde: copie este arquivo para `docs/prd-<feature>.md` e preencha. Fonte da verdade = o CÓDIGO atual.

## 1. Sumário executivo
O que é, para quem, e o diferencial em 1 parágrafo.

## 2. Problema & oportunidade
Dor real (no contexto de uso) + por que vale resolver.

## 3. Visão & princípios
Frase de visão + 3–5 princípios de produto.

## 4. Personas & contexto de uso
Tabela: persona · contexto · necessidade central. (Plantão: mobile, uma mão, pressa.)

## 5. Objetivos & métricas
Tabela: objetivo · métrica (a instrumentar) · alvo.

## 6. Escopo
P0 (entregue) · P1 (backlog) · Fora de escopo.

## 7. Arquitetura funcional
Pipeline/estrutura. Componentes do DS usados. (Liga ao handoff de Figma.)

## 8. Requisitos funcionais (RF) — numerados
RF-01, RF-02, … por área (entrada, fluxo, ações, histórico, estados).

## 9. Requisitos não-funcionais (RNF)
DS/tokens (zero hardcode), a11y, app-shell, dark mode, performance, copy.

## 10. Mapa de fluxo, estados e cálculos
- **Fluxo:** telas/steps, navegação, gates.
- **Estados:** máquina de estados (hook), transições, persistência, reset.
- **Cálculos:** cada fórmula com **unidades + limites + tratamento de NaN/extremos**.

## 11. Edge cases
Voltar/refresh no meio, fora de ordem, valores fora de faixa, vazio, conclusão.

## 12. Segurança clínica
Avisos, ressalvas calibradas por risco, validação no protocolo do serviço.

## 13. UX writing & tom
Tom clínico, direto, humano. Exemplos de copy. Estados de erro/vazio.

## 14. Decisões registradas
Decisões de produto/UX/clínicas tomadas (com motivo).

## 15. Backlog / pendências conhecidas
O que falta, catalogado.

## 16. Glossário
Termos-chave.
