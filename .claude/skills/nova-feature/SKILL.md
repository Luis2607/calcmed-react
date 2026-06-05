---
name: nova-feature
description: Pipeline repetível para construir uma feature/tela nova no protótipo CalcMed (do código ao PRD pronto pro Figma). Use quando o usuário pedir uma feature/tela nova, ou para padronizar a entrega. Encadeia com as skills gerar-prd, auditoria-qa e deploy-seguro.
---

# Nova feature (CalcMed) — pipeline repetível

Objetivo do dono (designer): protótipo **fiel a tokens** → **telas documentadas no Figma + PRD**, de forma repetível. Siga o gate completo em [`docs/checklist-nova-feature.md`](../../docs/checklist-nova-feature.md).

## 0. Kickoff
- Crie o PRD a partir do molde: `cp docs/_templates/PRD.md docs/prd-<feature>.md` (ou use a skill `gerar-prd`).
- Registre a feature em `docs/00-index.md` (status VIVO).

## 1. Construir (CLAUDE.md §1–§4)
- **Composição sobre reinvenção:** use os componentes do DS (atoms→templates). Não crie UI paralela.
- **Gestalt/proximidade (§1):** espaçamento expressa agrupamento (par lógico junto; título↔conteúdo).
- **App-shell (§4):** header/composer/footer fixos; só o conteúdo rola.
- **Ícone (§3):** `Icon` atom — sem emoji em chrome.
- **Tokens (§2):** zero hardcode. Cor/fonte/espaço/raio via `var(--…)`; tipografia via `font: var(--ds-font-*)`.

## 2. Documentar na MESMA entrega (CLAUDE.md §7)
- Atualize `docs/prd-<feature>.md` (fluxo, estados, **cálculos com unidades/limites**, segurança clínica, copy).
- Toda extensão/divergência de componente do DS → entrada no `docs/figma-sync-ledger.md` no mesmo commit.
- Decisão de DS/Figma nova → `docs/decisoes-figma.md`.

## 3. Copy (§5)
- Tom clínico, direto, humano. Não soar como IA genérica. Sem quebrar a 4ª parede.

## 4. Verificar + entregar
- `npm run build` ✅ · `npm run lint` (sem novos erros) · QA visual **mobile (390px) + web** · dark mode coerente.
- Merge/deploy: use a skill **deploy-seguro** (batch; empurrar antes do PR; verificar hash).

## 5. Qualidade profunda (opcional, recorrente)
- Para revisão estrutural/clínica/UX: use a skill **auditoria-qa** (agentes Opus em paralelo, read-only).
