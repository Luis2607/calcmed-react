# Checklist de nova feature (gate repetível)

> Rode este checklist **antes de mergear** qualquer feature/tela nova. É o gate único que
> consolida as regras do `CLAUDE.md`. Objetivo do dono (designer): protótipo fiel a tokens →
> telas documentadas no Figma + PRD, de forma repetível.

## 0. Kickoff
- [ ] PRD criado a partir de `docs/_templates/PRD.md` → `docs/prd-<feature>.md`.
- [ ] Feature registrada em `docs/00-index.md` (status `VIVO`).

## 1. Construção (CLAUDE.md §1–§4)
- [ ] **Composição sobre reinvenção:** usa componentes do DS existentes (atoms→templates); nada de UI paralela.
- [ ] **Gestalt/proximidade (§1):** espaçamento expressa agrupamento (par lógico mais perto; título↔conteúdo).
- [ ] **App-shell (§4):** header/composer/footer fixos; só o conteúdo rola.
- [ ] **Ícone (§3):** `Icon` atom — **sem emoji** em chrome/UI.

## 2. Tokens (CLAUDE.md §2) — zero hardcode
- [ ] Cor/fonte/espaço/raio **sempre** via `var(--…)`. Sem hex/px cru onde há token.
- [ ] `grep -rnE "#[0-9a-fA-F]{3,6}" src/features/<feature>` → só em comentário (anotação), nunca em valor CSS.
- [ ] Tipografia via `font: var(--ds-font-*)` (mapeia 1:1 com text-style do Figma).

## 3. Documentação na mesma entrega (CLAUDE.md §7)
- [ ] `docs/prd-<feature>.md` atualizado (fluxo, estados, cálculos, segurança clínica, copy).
- [ ] Toda divergência/extensão de componente do DS → **entrada no `figma-sync-ledger.md`** no mesmo commit.
- [ ] Decisão de DS/Figma nova → registrada em `docs/decisoes-figma.md` (não espalhar).

## 4. Copy (CLAUDE.md §5)
- [ ] Tom clínico, direto, humano. **Não** soar como IA genérica. Sem quebrar a 4ª parede.

## 5. Verificação (gate automatizável)
- [ ] `npm run build` ✅
- [ ] `npm run lint` ✅ (sem novos erros)
- [ ] QA visual no **mobile (390px)** e na **web** (sem overflow/quebra; alvos de toque ≥44px no destrutivo).
- [ ] Dark mode (`.modo-escuro`) coerente.

## 6. Merge & deploy (CLAUDE.md §6 — com cadência)
- [ ] **Empurrar a branch ANTES de abrir o PR** (commits locais não-empurrados não entram no PR).
- [ ] **Batch:** agrupar fixes num PR; **não** mergear por-item (estoura o limite diário de deploy da Vercel).
- [ ] Após merge: confirmar deploy **READY** na Vercel + hash do bundle servido = `dist/` local.
- [ ] Se a Vercel não deployar (limite), o código está na `main`; o próximo deploy traz tudo.

## 7. Passagem pro Figma (cadência, não big-bang)
- [ ] Ao fechar a feature/épico: drenar os itens `aberto` do `figma-sync-ledger.md` pro Figma (Fases do handoff), marcar `sincronizado`.
