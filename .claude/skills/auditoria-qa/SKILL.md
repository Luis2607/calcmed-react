---
name: auditoria-qa
description: Dispara um enxame de agentes de auditoria (read-only, em paralelo) para revisar profundamente código, UX, segurança clínica, DS, ou workflow do CalcMed. Use quando o usuário pedir "revisão profunda", "QA", "audita", "loops de agentes", ou antes de fechar uma feature grande.
---

# Auditoria QA (CalcMed) — enxame de agentes

Padrão que funciona bem: **vários agentes Opus em paralelo, read-only**, cada um numa ótica; depois você sintetiza e aplica as correções **seguras** num batch (skill `deploy-seguro`).

## Como rodar
- Use o **Agent tool** com `model: opus`, `run_in_background: true`, um agente por ótica. Lance todos numa só mensagem (paralelo).
- **Read-only:** instrua "NÃO altere arquivos — entregue RELATÓRIO priorizado [CRÍTICO]/[ALTO]/[MÉDIO]/[BAIXO] com arquivo:linha + problema + correção".
- Dê alvos cirúrgicos (arquivos exatos) e o contexto (CLAUDE.md, tokens, o PRD da feature).

## Óticas que valem (escolha conforme o pedido)
- **Código/arquitetura:** estrutura, escalabilidade, dead code, consistência, anti-patterns (camada `shared/` e/ou `features/`).
- **UX / heurísticas / psicologia:** Nielsen + leis (Hick/Fitts/Miller/Von Restorff/peak-end…), Gestalt.
- **UX writing:** tom clínico, 4ª parede, microcopy, consistência de voz.
- **Segurança clínica:** doses/condutas, ressalvas por risco, edge cases que induzem erro.
- **Acessibilidade:** WCAG 2.2 (foco, alvos, leitor de tela, contraste, reduced-motion).
- **DS / apresentação:** tokens, variantes→component-properties, galeria, mobile/web.
- **Workflow/gaps:** docs, pipeline Figma, CI/deploy, templates.
- **Fundacional:** categorização/contrato (payload↔renderer), robustez a payload malformado.

## Loop de loops (quando pedirem "exaustivo")
- Instrua cada agente a fazer **múltiplas passadas** (mapa → estados → cálculos → edge cases → DS → a11y → otimizações → varrer de novo até estabilizar) e dar um veredito de prontidão (0–100%).

## Depois que voltarem
1. **Sintetize** (convergências entre agentes = alta confiança).
2. Aplique só o que é **seguro** ("não quebra nada") num batch; refactors grandes viram proposta em `docs/decisoes-figma.md`.
3. Atualize os docs afetados (regra §7). Merge via `deploy-seguro`.

## Cuidado
- Enquanto os agentes leem o codebase, **não edite os mesmos arquivos** (geram relatório sobre código já mudado). Espere voltarem, então aplique.
- Para testar lógica pura (ex.: roteamento `matchText`, cálculos), rode um teste Node rápido (`node /tmp/t.mjs` importando o módulo) antes de confiar.
