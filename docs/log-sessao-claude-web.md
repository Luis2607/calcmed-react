# Log de sessão — Claude Code (web)

> Registro cronológico de **todas as ações e ajustes** feitos pelo assistente nesta
> sessão, para auditoria e para portar as mudanças a outros repositórios / ao
> repositório local. Cada entrada traz: o que foi feito, arquivos, commit, motivo e
> como foi verificado.
>
> Branch de trabalho: `claude/react-prototype-vercel-fk2k9`
> Mantido vivo: novas ações são acrescentadas ao fim, na seção da data corrente.

---

## Como portar para outro repositório / local

```bash
# 1. Buscar a branch de trabalho
git fetch origin claude/react-prototype-vercel-fk2k9

# 2a. Aplicar por merge (preserva histórico de commits)
git merge origin/claude/react-prototype-vercel-fk2k9

# 2b. OU cherry-pick commits específicos (ver hashes abaixo)
git cherry-pick a182f51 e5c3dfc 4a176df aac2449 127ec1f
```

Commits desta sessão (mais novo no topo):

| Commit    | Data (UTC)        | Resumo |
|-----------|-------------------|--------|
| `127ec1f` | 2026-06-04 02:07  | fix(mobile): hover de seleção só com ponteiro real (sem estado preso no toque) |
| `aac2449` | 2026-06-04 01:28  | fix(mobile): DevPanel inicia recolhido e acima da TabBar |
| `4a176df` | 2026-06-04 01:25  | fix(mobile): toasts AVC/CAD/Sepse usam absolute (ancoram no frame) |
| `e5c3dfc` | 2026-06-04 01:21  | fix(mobile): trava o frame em 100dvh e impede a página de rolar |
| `a182f51` | 2026-06-04 01:03  | chore(deploy): add vercel.json (framework vite, cleanUrls) |

---

## 2026-06-04

### [a182f51] Preparação de deploy na Vercel
- **Pedido:** "o protótipo react já tá no git né? upa ele na vercel".
- **Ação:** criado `vercel.json` (framework `vite`, `outputDirectory: dist`, `cleanUrls: true`
  para servir `/admin.html` como `/admin`).
- **Arquivos:** `vercel.json` (novo).
- **Verificação:** `npm run build` OK → gera `dist/index.html` (app mobile) + `dist/admin.html`.
- **Nota de ambiente:** o container não tem Vercel CLI nem token, então o deploy em si é
  feito pelo dono da conta (import do repo em vercel.com/new, branch auto-detectada como Vite).
  O app já estava no ar em `*.vercel.app` (confirmado por screenshot do usuário).
- **Status:** ✅ commitado e enviado (push) para a branch.

### [e5c3dfc] Barra de navegação inferior fixa + rolagem só no interior (mobile)
- **Pedido:** no celular a TabBar inferior não ficava fixa e a página inteira rolava;
  a rolagem deveria ser só no conteúdo interno.
- **Causa raiz (global, não por-tela):** `html/body/.page-wrapper` usavam `100vh` (inclui as
  barras do navegador) enquanto `.viewport-container` usava `100dvh` (área visível). A
  diferença tornava a página inteira rolável e a TabBar `sticky` subia junto (o "buraco"
  embaixo da barra no print = `100vh − 100dvh`). `#root` não tinha altura.
- **Ação:** no `@media (max-width: 430px)`, travado `html, body, #root, .page-wrapper` em
  `100dvh` com `overflow: hidden` e `overscroll-behavior: none`. Só os scrollers internos
  (`.scroll-container` e o `<main class=.body>` do `ProtocolShell`) rolam.
- **Arquivos:** `src/shared/styles/global.css`.
- **Verificação:** Chromium headless (Playwright) a 390×740 em PCR, AVC, Sepse, CAD, SCA e Home:
  `pageScrollable: false` (página não rola), interior rola (`interiorScrollTop` muda,
  `pageScrollTop` permanece 0), TabBar com `bottom == winH` (colada no rodapé) mesmo durante
  a rolagem interna.
- **Status:** ✅ commitado e enviado.

### [4a176df] Toasts AVC/CAD/Sepse ancorados no frame
- **Origem:** varredura mobile (2 subagentes read-only) após a correção do frame.
- **Causa:** AVC/CAD/Sepse usavam `position: fixed` (ancora na janela) com `bottom: calc(64px
  + esp-4)`; no desktop com o frame centralizado o toast escapava dos 390px. PCR/SCA já
  usavam o padrão correto (`absolute`).
- **Ação:** trocado `position: fixed` → `absolute` nos três (ancora no `.viewport-container`,
  que é `position: relative`), preservando o design de toast acima da TabBar.
- **Arquivos:** `src/features/avc/AVCFlow.module.css`, `src/features/cad/CADFlow.module.css`,
  `src/features/sepse/SepseFlow.module.css`.
- **Verificação:** `npm run build` OK.
- **Status:** ✅ commitado e enviado.

### [aac2449] DevPanel inicia recolhido e acima da TabBar
- **Origem:** varredura mobile — o painel de teste (DevPanel) renderiza em produção e
  sobrepunha a barra de navegação no deploy (visível no print do usuário).
- **Decisão do usuário (AskUserQuestion):** "Recolhido por padrão" — manter no deploy para
  testar no celular, mas iniciar recolhido e liberar a navegação.
- **Ação:** `useState(true)` → `useState(false)` (inicia recolhido); `.panel` e `.fab`
  movidos de `bottom: 16px` → `bottom: 88px` (acima da TabBar ~72px).
- **Arquivos:** `src/shared/components/layout/DevPanel/DevPanel.jsx`,
  `src/shared/components/layout/DevPanel/DevPanel.module.css`.
- **Verificação:** screenshot 390px → painel inicia recolhido (botão ⚙ em `bottom 652`),
  acima da TabBar (`top 667`); barra de navegação totalmente visível.
- **Status:** ✅ commitado e enviado.

### [127ec1f] Hover de seleção só com ponteiro real (sem estado preso no toque)
- **Pedido:** ao tocar numa opção (radio), ela ficava "meio cinza" e exigia tocar fora para
  marcar certo; deveria marcar limpo no primeiro toque.
- **Causa:** `:hover` "grudado" no toque — Radio/Checkbox aplicavam fundo
  `--interativo-primario-tint-04` e OptionCard/rangeChip aplicavam borda no hover, que ficava
  preso até tocar fora (touch não dispara mouse-leave).
- **Ação:** regras de hover envolvidas em `@media (hover: hover)` — só mouse real recebe
  hover; no toque o tap marca limpo.
- **Arquivos:** `src/shared/components/atoms/Radio/Radio.module.css`,
  `src/shared/components/atoms/Checkbox/Checkbox.module.css`,
  `src/shared/components/molecules/OptionCard/OptionCard.module.css`,
  `src/shared/components/molecules/Chip/Chip.module.css` (`.rangeChip`).
- **Verificação:** emulação de toque a 390px → `matchMedia('(hover: hover)').matches === false`;
  ao tocar "Convencional" na SCA: `checked: true` na hora, fundo do círculo branco
  (`rgb(255,255,255)` — sem cinza preso), borda teal do estado selecionado. Screenshot confirma.
- **Status:** ✅ commitado e enviado.

---

### [docs] QA comportamental — varredura dirigida por browser (5 agentes)
- **Pedido:** "seja um QA nível elite... procure problemas, bugs, áreas que deveriam
  clicar e não funcionam, cenários mal executados".
- **Método:** crawler Playwright/Chromium (mobile 390px) detectando cliques mortos +
  erros de console em 13 rotas; depois 5 agentes em paralelo (Home+Hub, SCA, CAD, PCR,
  AVC+Sepse) executando cenários completos (progressão de passos, gating, cálculos,
  modais, timers, persistência).
- **Resultado:** nenhum crash, **0 erros de console**, e os **cálculos clínicos conferidos
  estão corretos** (doses, escores, tempos). Problemas concentrados em *wiring* (UI sem
  handler na Home), *validação de entrada* (aceita negativos/absurdos), *formatação PT-BR*
  (ponto×vírgula no CAD) e *gating* de passos.
- **Entregável:** `docs/qa-comportamental-2026-06-04.md` (achados por fluxo + severidade +
  causa provável + backlog priorizado P0/P1/P2). Tooling/screenshots ficaram em `_qa/` e
  `/tmp` (gitignored).
- **Arquivos:** `docs/qa-comportamental-2026-06-04.md` (novo).
- **Status:** ✅ relatório commitado. Correções **aguardando priorização do usuário**
  (ver backlog P0/P1/P2 no relatório).

---

### [4301525 + 6 commits] Correções pós-QA (P0+P1+P2) — fundação + 5 agentes por fluxo
- **Pedido:** após o relatório de QA, dono escolheu **corrigir tudo (P0+P1+P2)** com postura
  **bloquear + validar faixa**.
- **Método:** fundação compartilhada feita pelo assistente (p/ agentes não conflitarem nos
  mesmos arquivos), depois 5 agentes de implementação em paralelo (Home+Hub, CAD, SCA,
  Sepse, AVC+PCR), cada um nos seus arquivos, buildando e verificando com Playwright em
  porta própria. Revisão de diffs + build + crawler de regressão pelo assistente antes de commitar.
- **Commits:**
  - `4301525` fix(ds): Radio recebe `value` + deselect de item de escore (RadioGroup, ScoreCriterionGroup).
  - `27b534a` fix(home): abas Adulto/Pediatra ligadas; barra inferior/cards (navegam ou toast “Em breve”); Hub abre React.
  - `39a613e` fix(cad): formatação vírgula (sódio/insulina), pré-preenche insulina, HCO₃ T5, valida faixa idade/peso.
  - `3e94e80` fix(sca): valida faixa + gating T3 (escore+troponina) e T4 (P2Y12).
  - `9804da4` fix(sepse): guard de peso (sem volume negativo) + acesso à T3 (ATB) pelo stepper.
  - `7d906dd` fix(avc): janela >24h (seletor Hoje/Ontem/Anteontem) + horário inválido.
  - `1842cdd` fix(pcr): banner só após iniciar compressões + card de adrenalina ATRASADA visível.
- **Verificação:** cada agente passou seus testes Playwright; build OK; **crawler de regressão
  em 13 rotas = 0 erros de console/página**, e cliques mortos da Home caíram de 10 → 3
  (restantes são falsos-positivos do harness, ex.: “Início” faz scroll ao topo).
- **Decisões P2 resolvidas:** Hub unificado nas versões React; janela AVC >24h via seletor de
  dia; ferramentas de dev (DevPanel + “Pular 5 min” do CAD) **mantidas** no deploy (uso de teste).
- **Status:** ✅ todos commitados. Backlog P0/P1/P2 do relatório de QA endereçado.

---

## Itens avaliados e NÃO alterados (de propósito)

- **`safe-area-inset-bottom` nos BottomSheets** — melhoria para iPhone com notch; opcional,
  não aplicada (aguardando decisão).
- **`min-height: 360px` do hero do PCR** e **overflow do stepper de 5 passos da SCA** —
  testados a 390px, renderizam OK; sem alteração para evitar regressão.

## Pendências / aguardando usuário
- Aplicar (ou não) o `safe-area-inset-bottom` nos sheets.
- Deploy de produção na Vercel: importar repo / escolher branch ou mergear na `main`.
