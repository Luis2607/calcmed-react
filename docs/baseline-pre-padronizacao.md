# Baseline pré-padronização (F-1)

> Estado oficial do "ANTES" — registrado em 2026-05-27 antes de QUALQUER alteração de padronização.
> Qualquer regressão posterior se mede contra isto. Nenhum arquivo de produto foi alterado nesta fase.
> Plano: `~/.claude/plans/agile-floating-moore.md`.

## 1. Build atual (verde ✅)
`npm run build` → **OK** · 213 módulos transformados · 462ms.
- `dist/index.html` 5.38 kB (gzip 2.02)
- `dist/assets/index-DN8xbkfJ.css` 207.28 kB (gzip 32.70)
- `dist/assets/index-Jg3ic0aM.js` 478.76 kB (gzip 134.37)

(Hashes do bundle servem de referência; mudaram a cada build, mas o tamanho/contagem de módulos é o marco.)

## 2. Git — ⚠️ ACHADO CRÍTICO
- Branch: **`main`** · último commit: `7bcf422` (docs lp-eduardo).
- **O protótipo `calcmed-react/` está INTEIRAMENTE NÃO-RASTREADO pelo git** (`git status` → `?? ./`; NÃO é gitignore). 
- **Consequência:** **NÃO há rollback via git** para o protótipo — `git checkout/revert` não restaura nada daqui. O histórico do git só cobre wiki/docs na raiz do workspace (vários arquivos modificados lá, não relacionados ao protótipo).
- ⚠️ **Proibido `git reset`/`checkout` amplo** — destruiria trabalho não relacionado (wiki) e não recuperaria o protótipo.

## 3. Inventário de rotas (o que existe hoje)
**Rotas vivas (produto)** — via `App.jsx` (`?route=` ou `active_route` persistido):
- `home` (default) — Home/hub React (Dr. Rafael, acesso rápido, em-andamento).
- `hub` — HubHome React.
- `cad` — `CADFlow` (React nativo) — header + 6 steps + conteúdo telaAtual 1-6. **Sem abas.**
- `sca` — `SCAFlow` (React nativo) — header + 5 steps (capsule) + abas Executar/Histórico/Teoria + footer + tabbar.
- `sepse` / `pcr` / `avc` — `GoldenProtocolFrame` (**iframe** do golden `/golden/src/protocolos/<id>/<id>.html`). NÃO portados.

**Rotas QA (DsDashboard)** — via `?qa=`:
`colors` · `typography` · `spacing` · `icons` · `buttons` · `inputs` · `controles` · `alertas` · `tags` · `clinicos` · `urgencia` · `bottomsheets`.

## 4. Screenshots de smoke (renderizam OK)
Tool de screenshot **intermitente** nesta sessão (alguns `UnknownVizError`; refazer resolve). Capturados e confirmados renderizando:
- ✅ root/`pcr` (golden iframe) — "MODO PCR" + cards de cronômetro (Compressões/Adrenalina).
- ✅ `?route=cad` (nativo) — Protocolo CAD, header + 6 steps + Dados de Triagem (Idade/Peso/HGT + checks).
- ✅ `?route=sca` (nativo) — header + 5 steps capsule + setupCard/Chips + SectionLabel(+info) + inputs.
- ✅ `?qa=buttons` (DsDashboard) — galeria de botões + sidebar com as 12 abas QA.
- ⏳ Demais QA routes (controles/clinicos/tags/alertas/urgencia/...) e live (home/hub/sepse/avc): inventariadas; screenshot a capturar conforme necessário (smoke por demanda — o tool é flaky, e o preview do Luis mostra ao vivo).

> Observação: o tool de screenshot mostra a imagem em contexto, **não persiste arquivo** — então a comparação de regressão é visual/in-context (re-screenshot + olho), não diff de pixel salvo. O baseline persistente real = build + este doc + rotas.

## 5. Plano de ROLLBACK (dado que o protótipo é untracked)
Como o git NÃO cobre o protótipo, o rollback é por uma destas vias (escolher antes de F0.0):
- **(Recomendado) Commitar o baseline agora** — `git add` do `calcmed-react/` + commit "baseline pré-padronização". Dá rollback real (revert por arquivo/commit) a cada passo seguinte. (Ação não-destrutiva; aguardando OK do Luis — não comito sem autorização.)
- **OU backup manual por arquivo** — antes de cada edição (F0.0+), copiar o(s) arquivo(s) alvo p/ `.baseline-bak/` e restaurar de lá se preciso.
- **OU** confiar no histórico do editor/undo (frágil — não recomendado p/ mudanças multi-arquivo).
- Regra fixa: **nunca** `git reset --hard` / `git checkout .` no workspace (apaga wiki + não recupera protótipo).

## 6. Próximo passo (BLOQUEADO até aprovação)
F-1 concluída. **Tudo a partir daqui (F0.0 tokenizar hardcodes, componentes, StepHeader, templates, shell, ports) está BLOQUEADO até o Luis revisar este baseline e autorizar F0.0.**
Antes de F0.0, decidir a via de rollback (commit do baseline vs backup manual).
