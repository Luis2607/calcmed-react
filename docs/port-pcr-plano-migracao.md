# Port PCR — plano de migração detalhado

> **Status:** F-PCR-1 (captura) ✅ · F-PCR-2 (contratos DS) ⏳ aguarda aprovação Luis.
> **Doc fonte:** [`port-pcr-inventario.md`](./port-pcr-inventario.md) — 14 seções + apêndice clínico.
> **Voz:** manual de aviação. Sem fluff.

---

## 0. Resumo executivo

PCR é o protocolo MAIS crítico do CalcMed (ACLS · vida ou morte). Conteúdo clínico **já validado por Gustavo em produção**. O port React tem **uma única promessa: zero perda clínica + 1:1 com golden**.

**Magnitude:**
- 4 telas Executar (T1 idle / T2 ativa / T3 pós-RCE / T4 salvar) — **fluxo não-linear, SEM stepper**.
- 2 telas-aba (Histórico · ACLS|AHA com 3 sub-tabs internas).
- 29 modais + 4 dinâmicos inline.
- 3 timers simultâneos (master / ciclo 2min / adrenalina parametrizada).
- TTS gated (anti-spam) + auto-triggers (5H/5T após AESP/Assist).
- Cálculos pediátricos exatos (cargas J/kg · doses mg/kg · ARDSnet · TET).

**Por que isso exige microsteps:**
- Cada erro clínico pode causar dano. Não há "ok, depois ajustamos".
- O fluxo NÃO é linear (não dá pra portar como Sepse T1→T2→T3 com stepper).
- TTS, timers e janelas estão entrelaçados — dev junior portando 1 isoladamente quebra todos.

---

## 1. Fases (sequenciais · gate de aprovação entre elas)

| Fase | O que entrega | Aprovação | Risco |
|---|---|---|---|
| **F-PCR-1** | `port-pcr-inventario.md` completo | ✅ Luis · captura terminada | Baixo (read-only) |
| **F-PCR-2** | 10 contratos de componente DS · 1-a-1 | ⏳ Luis · contrato a contrato | Médio (estrutural) |
| **F-PCR-3** | 12 microsteps de build (cada um = 1 tela ou bloco coeso) | ⏳ Luis · screenshot side-by-side por step | **Alto** (clínico) |
| **F-PCR-4** | Validação clínica final + stress test | ⏳ Luis · sign-off ponto-a-ponto | **Alto** (clínico) |
| **F-PCR-5** | Cutover Home (`route: 'pcr-react'`) | ⏳ Luis · só após F-PCR-4 | Baixo (toggle de rota) |

---

## 2. F-PCR-2 · Contratos de componente DS (mapeamento prévio)

Cada um precisa de **CONTRATO + APROVAÇÃO antes de construir** (governança 3 do plano agile-floating-moore). Esgotar reuso/variante antes de criar.

Existentes (reuso direto · ✅): ProtocolShell · TimerCard 5 estados · SegmentedControl · BottomSheet · OptionCard · AlertCard · ChipsRow · InputField · HistoryScreen · DetailRow · StatGrid · Toast (Undo) · ConfirmSheet · AnnotationSheet · Tag · InfoSheet · SheetSection · SheetDetailRow · SheetText · Timeline.

### 2.1 — `EventItem` (molecule)
- **Camada:** molecule (composição com Tag já existente).
- **Responsabilidade:** uma linha de evento da Timeline T2 (hora absoluta + offset + ação + tag colorida lateral).
- **Props:** `time: string` (HH:MM:SS) · `offset: string` (T+MM:SS) · `title: string` · `tag?: 'droga'|'choque'|'marco'|'rce'` (cor da Tag lateral).
- **Variants:** sem tag · com tag (4 cores via Tag tone).
- **Reuso:** Tag (já existe · tones critico/atencao/sucesso/premium).
- **Risco:** baixo. Pattern read-only.

### 2.2 — `EventList` (organism)
- **Camada:** organism.
- **Responsabilidade:** lista colapsável `<details>+<summary>` com contador + N×EventItem (ordem reverse = mais novo no topo) + empty state.
- **Props:** `events: [{time, offset, title, tag}]` · `emptyText?: string` · `defaultOpen?: bool`.
- **Reuso:** EventItem · Tag (count).
- **Risco:** baixo.

### 2.3 — `BannerContextual` (organism · 4 tons)
- **Camada:** organism. **NÃO** estende AlertCard — anatomia distinta (border-left grosso 3-6px · pulse animation no critico).
- **Responsabilidade:** banner top da T2 que muda de estado dinamicamente conforme ciclo/RCE.
- **Props:** `tone: 'warning' | 'critical' | 'pos-choque' | 'success'` · `title: string` · `description: string` · `onDismiss?: () => void` · `pulse?: bool` (anim atenção).
- **Variants:** `pre-compressao` (amarelo border-left 3px) · `critico-marco` (vermelho border-left 6px + pulse) · `pos-choque` (amarelo) · `pos-rce` (verde fixo T3).
- **Reuso:** botão close (IconButton X).
- **Risco:** médio. Pulse animation precisa cuidado em mobile (perf + acessibilidade `prefers-reduced-motion`).

### 2.4 — `ActionGrandeButton` (atom OU variant)
- **Camada:** decidir com Rafael — atom novo OU variant grande de Button existente.
- **Responsabilidade:** botão tátil grande pra T2 (Selecionar ritmo / Desfibrilar). Touch target ≥ 48-52dp (PCR override).
- **Props:** `icon: ReactNode` · `label: string` · `sub: string` · `disabled?: bool` · `onClick` · `tone?: 'default' | 'danger'`.
- **Variants:** default · disabled · with icon left.
- **Reuso:** Button (variante grande?) · Icon system.
- **Risco:** baixo. Touch target validar com DOM measurement.

### 2.5 — `FAB` (atom)
- **Camada:** atom.
- **Responsabilidade:** Floating Action Button 56×56 circle, ancorado top do ActionFooter (bottom: 100% + margin-bottom: var(--esp-4)).
- **Props:** `icon: ReactNode` · `onClick: () => void` · `ariaLabel: string`.
- **Tokens:** bg `--ds-interativo-primario` · cor texto `--ds-texto-sobre-destaque` · sombra elevada (token novo? ou usar `--sombra-elevado-2`?).
- **Risco:** médio. Position absolute precisa não bloquear elementos toggleable / acessibilidade focus order.

### 2.6 — `DecisionCard` (organism)
- **Camada:** organism.
- **Responsabilidade:** card clicável pra modais com 2-3 opções (selecionar-ritmo 5 opts · encerrar-sem-rce 2 opts · checar-pulso-ritmo 2 opts · aplicar-choque 2 opts · nova-pcr-confirmar 2 opts).
- **Props:** `title: string` · `sub?: string` · `tone?: 'default' | 'critico' | 'sucesso'` · `onClick: () => void` · `disabled?: bool` · `tag?: string` (ex.: "CHOCÁVEL").
- **Reuso:** OptionCard (já existe — verificar overlap). Se OptionCard cobre → ESTENDER OptionCard (não criar novo).
- **Risco:** médio. Decisão estrutural: estender OptionCard OU criar separado.

### 2.7 — `HHTTPills` (molecule)
- **Camada:** molecule.
- **Responsabilidade:** 5H + 5T mnemônicos (letra colorida + termo) em grid 2-col responsivo.
- **Props:** `items: [{letter: 'H'|'T', label: string}]` (10 items).
- **Reuso:** Tag (cores letter)? OU pill custom?
- **Risco:** baixo. Read-only.

### 2.8 — `TETTabela` (organism · só pediatria)
- **Camada:** organism.
- **Responsabilidade:** tabela 3-col responsiva (faixa · sem cuff · com cuff) com 6 linhas.
- **Props:** `rows: [{faixa: string, semCuff: string, comCuff: string}]`.
- **Estilos:** mono nas medidas (tnum); border-collapse; padding compacto.
- **Risco:** baixo. Tabela estática.

### 2.9 — `PanfletoPlaceholder` (organism)
- **Camada:** organism.
- **Responsabilidade:** frame dashed cinza com label "Será importado do Figma" pra modais `algoritmo` / `cuidados-pos-pcr` / `qualidade-rcp` enquanto Gustavo não entrega o panfleto final.
- **Props:** `title: string` · `figmaRef?: string`.
- **Risco:** baixo. Placeholder temporário.

### 2.10 — `EventoCardNovo` (molecule)
- **Camada:** molecule.
- **Responsabilidade:** card no modal "Adicionar evento" com nome + dose + contador atual + botão "+ Aplicar".
- **Props:** `name: string` · `dose?: string` · `count?: number` · `onApply: () => void`.
- **Reuso:** Tag (count badge) · Button.
- **Risco:** médio. Tem incremento atómico (sem race condition).

---

## 3. F-PCR-3 · Build incremental (12 microsteps · aprovação visual por step)

Cada step = 1 PR aprovado por Luis + screenshot side-by-side vs golden + lint+build verde.

| Step | Escopo | Risco clínico | Estimativa |
|---|---|---|---|
| **3.0 Scaffold** | `features/pcr/PCRFlow.jsx` + `usePCRState.js` + ProtocolShell (3 tabs, SEM stepper) · tab nav vazia | Baixo | 30min |
| **3.1 T1 Idle** | 2 cards Compressões+Adrenalina idle · botões Sair/Iniciar PCR · iniciarPCR() | Baixo | 1h |
| **3.2 T2-A Setup** | Banner contextual base + Card Compressões em estado normal + SegmentedControl BPM 100/110/120 + timer loop 500ms | Baixo | 1h |
| **3.3 T2-B Adrenalina** | Card Adren com 3 estados (window-pre/ok/overdue) + janela parametrizada `[m-1, m+1]` + segmented Intervalo 3/4/5 + botão "Apliquei agora" + anti-double-tap <30s | **⚠️ ALTO clínico** | 2h |
| **3.4 T2-C Cycle-end** | Lógica marco 2:00 + buffer 15s + auto-cicle++ + banner critico-marco + TTS gated (avisou30s/avisouAdrenJanela/avisouAdrenAtrasada) | **⚠️ ALTO clínico** | 2h |
| **3.5 T2-D Ritmo+Decisões** | Modal selecionar-ritmo (5 opts) + Modal aplicar-choque + chips header dinâmicos (FV/TV/AESP/Assist) + auto-trigger 5H/5T após AESP/Assist (250ms) | **⚠️ ALTO clínico** | 2h |
| **3.6 T2-E FAB+Eventos** | FAB Adicionar evento + EventList collapsible + EventItem tags coloridas + Toast Undo 5s pós-ação | Médio | 2h |
| **3.7 T2-F Footer** | 3 botões rodapé (Pausa/Stop/RCE) + Modal pausar/encerrar-sem-rce/confirmar-rce (3 checkboxes apoio cognitivo) | Médio | 1h |
| **3.8 T3 Pós-RCE** | Banner verde + 5 cuidados (OptionCard tone) + alerta recidiva + footer 3 ações (Finalizar/Nova PCR/Salvar paciente) | Médio | 1h |
| **3.9 T4 Salvar** | Form (Iniciais+Idade+Peso+Altura+Sexo+Desfecho+Obs) + gate iniciais ≥1 + salvarPaciente() | Baixo | 1h |
| **3.10 Histórico** | HistoryScreen + filtros desfecho + busca ≥3 + Detalhe (DetailSheet) com 5 grupos (Caso/Desfecho/Operação/Timeline/Obs) | Médio | 1h |
| **3.11 ACLS\|AHA** | 3 sub-tabs (Panfletos/Cargas e Doses/Via Aérea) + Toggle Adulto/Pediatria + cálculos pediátricos exatos + VENT_PEDIATRIA + TET_TAMANHO | **⚠️ ALTO clínico** | 3h |
| **3.12 Modais 29+4** | Em paralelo a 3.1-3.11 conforme cada tela usa | Médio | 2h |

**Total estimado:** ~19h de codar + ~10h validação clínica + iteração.

---

## 4. F-PCR-4 · Validação clínica final

Antes de cutover:

- [ ] Side-by-side iframe golden vs `?route=pcr-react` pra cada tela
- [ ] Stress test: timer rodando + clicks rápidos + tab switch
- [ ] Validação aritmética por droga:
  - Adrenalina pediátrica: `(peso × 0.01).toFixed(2)` (validar 5 pesos: 3, 10, 25, 50, 75 kg)
  - Cargas pediátricas: `round(peso × 2/4/10)` (validar mesmos 5 pesos)
  - Amiodarona pediátrica: `round(peso × 5)`
  - Lidocaína adulto: `round(peso × 1)` a `round(peso × 1.5)` · max `round(peso × 3)`
  - Peso predito ARDSnet: `round(50 + 0.91 × (altura - 152.4))` masculino · `45.5 + ...` feminino
  - TET profundidade: 3 fórmulas (tubo·altura·peso)
- [ ] Validação fluxo:
  - Janela adrenalina `[m-1, m+1]` em 3 intervalos (3/4/5)
  - Auto-cicle 15s buffer (verificar não-rotaciona antes)
  - Anti-double-tap <30s (verificar modal abre)
  - Auto-trigger 5H/5T após AESP/Assist (250ms delay)
  - TTS gated (cada warning 1×/ciclo · não-spam)
- [ ] Sign-off ponto-a-ponto Luis

---

## 5. F-PCR-5 · Cutover

Após sign-off completo:
1. `App.jsx`: adicionar case `'pcr-react'` → `<PCRFlow onBack={goHome} />`.
2. `Home.jsx`: `{ id: 'pcr', route: 'pcr-react' }` (era `'pcr'`).
3. `protocols.js`: marcar PCR como `phase: MIGRATION_PHASES.migrated`.
4. Iframe golden permanece como fallback acessível via `?route=pcr` manual (idem Sepse).
5. Atualizar `CHANGELOG.md` modo-pcr.

---

## 6. Conselho (a cada step)

### Lia (UX writer)
- Conteúdo clínico já validado por Gustavo (golden 1:1). Não inventar.
- Copy de UX (botões/hints/banners/toasts): voz combate. Imperativo. Sem fluff.
- Validar tooltips de error/disabled (B2 Sepse aprendizado).

### Rafael (DS)
- Componente novo SÓ se reuso/variante esgotada.
- Cada novo precisa de contrato + aprovação 1-a-1.
- Estender OptionCard antes de criar DecisionCard (decisão 2.6).
- Zero hardcode (regra inviolável).

### Gabriela (UI)
- Hierarquia: timer GIGANTE > ritmo COLORIDO > ação CLARA.
- Banner contextual com pulse animation respeitando `prefers-reduced-motion`.
- Touch target ≥ 48-52dp em TODOS os botões T2.

### Bruno (PO)
- Persona P3 (R1 sob stress). KPI principais:
  - Tempo até 1ª compressão: <10s desde tap "Iniciar PCR"
  - Tempo até 1º choque (chocável): <2min desde iniciar
  - Adrenalinas no ciclo correto: 100% dentro da janela [m-1, m+1]
- Sem teatro: nada na UI que não move algum desses KPIs.

### Jakob Nielsen
- Recognition > recall: mostrar, não escrever.
- Error prevention: anti-double-tap, gates clínicos, confirmação de ações destrutivas.
- Visibility of system status: timer + chips + banner sempre comunicando o estado atual.

---

## 7. Riscos (do inventário · ⚠️)

### Risco 1 · Janela adrenalina parametrizada (3/4/5 min)
- **Descrição:** janela é `[m-1, m+1]` minutos (default m=3 → 2:00–4:00). Constantes legacy `INICIO_MS=180000` / `FIM_MS=300000` existem mas NÃO são usadas no fluxo principal.
- **Risco:** dev junior hardcoda 3-5min (perde D35 Onda 2.5 — Gustavo permite escolher 3/4/5 min de intervalo).
- **Mitigação:** copiar `getAdrenalinaJanela()` 1:1 do golden. Validar com 3 valores diferentes em F-PCR-4.

### Risco 2 · Cálculos pediátricos (cargas/doses)
- **Descrição:** 9 fórmulas (ver apêndice clínico inventário). `Math.round` em 7 delas · `.toFixed(2)` em adrenalina · `.toFixed(1)` em TET profundidade.
- **Risco:** arredondamento errado = dano clínico (ex: 0.5mg adrena pediátrica em vez de 0.50, ou 200 J em pediátrico).
- **Mitigação:** extrair funções em `pcrData.js` 1:1 do golden. Validar 5 pesos em F-PCR-4 (3, 10, 25, 50, 75 kg).

### Risco 3 · TTS gated + auto-triggers
- **Descrição:** 9 mensagens TTS · 3 com flag anti-spam (`avisou30s`, `avisouAdrenJanela`, `avisouAdrenAtrasada`) · reset a cada ciclo novo · auto-trigger 5H/5T após AESP/Assist (250ms delay).
- **Risco:** sem isso, ou silencia tudo (médico perde alerta crítico) ou spamma em loop (médico desabilita áudio).
- **Mitigação:** copiar flags + estados 1:1 do golden. Test de stress em F-PCR-4.

### Risco 4 · Auto-cicle 15s buffer
- **Descrição:** após elapsed ≥ CICLO_MS, espera +15s ANTES de auto-rotacionar pra próximo ciclo. Dá tempo de leitura clínica do marco.
- **Risco:** dev junior bate 1:1 em 2:00 → rotaciona antes do médico ver "MARCO · CHECAR".
- **Mitigação:** copiar lógica `if (elapsed >= CICLO_MS + 15000 && !rce)` 1:1.

### Risco 5 · Pulse animation acessibilidade
- **Descrição:** banner `critico-marco` tem pulse animation.
- **Risco:** usuário com `prefers-reduced-motion` vê piscadas → cefaleia/distração.
- **Mitigação:** `@media (prefers-reduced-motion: reduce) { .pulse { animation: none; } }`.

---

## 8. Definition of Done por microstep

Cada microstep (3.0–3.12) só fecha quando:

- [ ] Lint verde (`npx eslint`)
- [ ] Build verde (`npm run build`)
- [ ] Render real no `?route=pcr-react` (screenshot)
- [ ] DOM measurement: touch targets ≥ 48-52dp (PCR override) onde aplicável
- [ ] Paridade clínica conferida lado-a-lado vs golden (se tocar lógica clínica)
- [ ] Sign-off Luis explícito antes do próximo step
- [ ] CHANGELOG sepse-style com `## [YYYY-MM-DD] feat | PCR step X.Y · resumo`

---

## 9. Perguntas em aberto pra Luis

1. **DecisionCard** (2.6): estender OptionCard OU criar separado? Rafael sugere estender — confirmar.
2. **ActionGrandeButton** (2.4): variant grande do Button existente OU atom novo? Avaliar Button.size atual.
3. **FAB sombra**: tem token `--sombra-elevado-2`? Se não, criar?
4. **Pulse animation**: aceitar limite `prefers-reduced-motion` (some animação)?
5. **Ordem de build T2**: começar por 3.3 (Adrenalina) ou 3.4 (Cycle-end)? Ambos clínicos críticos, dependem do mesmo timer loop.
6. **Iframe golden**: manter acessível via `?route=pcr` SEMPRE como fallback, OU remover após F-PCR-5 + 1 semana de uso?

---

## 10. Status atual

- F-PCR-1 (captura) ✅
- F-PCR-2 (contratos) ⏳ aguarda aprovação Luis · começar pelo `EventItem` (2.1, baixo risco) e progredir
- F-PCR-3..5 ⏳ depende de F-PCR-2

> **Próxima ação:** Luis aprova plano + responde 6 perguntas em aberto → começamos F-PCR-2.1 (EventItem contract).
