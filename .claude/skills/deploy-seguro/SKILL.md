---
name: deploy-seguro
description: Workflow blindado de merge + deploy do CalcMed (branch dev → main → Vercel). Use SEMPRE que for commitar/mergear/deployar mudanças, ou quando o usuário pedir "sobe pra prod", "mergeia", "deploya". Codifica lições já aprendidas (empurrar antes do PR; batch de deploys; verificar hash).
---

# Deploy seguro (CalcMed)

Branch de desenvolvimento: `claude/ds-react-docs-rt3tj`. Produção: `main` → `calcmed-react.vercel.app`.

## Regras de ouro (aprendidas na marra)
1. **EMPURRE a branch ANTES de abrir o PR.** Commits locais não-empurrados **não entram no PR** — já perdemos código assim. Sempre `git push` e confirme com `git log --oneline origin/<branch> -1` antes de criar o PR.
2. **BATCH, não merge-por-item.** Acumule vários fixes na branch e faça **UM** PR/merge por bloco. Muitos merges seguidos estouram o **limite diário de deploy da Vercel** (Hobby ~100/dia) e os deploys passam a ser dropados.
3. **`build` (e idealmente `lint`) verdes antes do merge** (CLAUDE.md §6). `npm run build`.
4. **Resync após cada squash-merge.** Squash cria um commit novo na `main` e a branch **diverge**. Depois de mergear: `git fetch origin main && git reset --hard origin/main && git push -u origin <branch> --force`. Isso também mantém os commits da branch "verificados" (Stop hook).

## Passo a passo
```
# 1. build/lint
npm run build           # bloqueante
npx eslint src/<area>   # checar erros novos

# 2. commit (acumule na branch; NÃO mergeie por item)
git add -A && git commit -q -m "<tipo>(<escopo>): <resumo>"

# 3. empurrar ANTES do PR
git push -u origin claude/ds-react-docs-rt3tj
git log --oneline origin/claude/ds-react-docs-rt3tj -1   # confirmar que subiu

# 4. PR + squash merge (via GitHub MCP: create_pull_request + merge_pull_request method=squash)

# 5. resync da branch com a main (pós-squash)
git fetch origin main && git reset --hard origin/main && git push -u origin claude/ds-react-docs-rt3tj --force
```

## Verificar o deploy
- Pegue o hash do build local: `ls dist/assets/main-*.js`.
- Poll em background até a prod servir o mesmo hash:
  `curl -s https://calcmed-react.vercel.app/ | grep -oE 'assets/main-[A-Za-z0-9_-]+\.js'`
- **Se não bater em ~15 min:** cheque a Vercel (MCP `list_deployments`, projectId `calcmed-react`, teamId `team_t53IlJA1dnRzd2EzMjVcEsf0`). Se não houver deploy de produção novo, foi o **limite diário** — o código já está na `main`; o próximo deploy traz tudo. Não force; **batch** os próximos.

## Commit message
- Termine com: `https://claude.ai/code/session_016CdNxHUqwYhNjmJDS7RYWL`
- **Nunca** crie PR sem o usuário pedir explicitamente (aqui o dono pediu "tudo vai pra produção", então PR+merge é o fluxo — mas confirme se for ambíguo).
