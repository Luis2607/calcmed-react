# Port PCR — inventário de captura (golden → React)

> Gate de **zero perda clínica** (PCR = ACLS, vida/morte). Lido do golden
> `calcmed/src/protocolos/pcr/{pcr.html (755 linhas), pcr.js (2520 linhas), pcr.css (1360 linhas)}`,
> versão `v=2026-05-20-cargas-peso`, conteúdo clínico **já validado em produção** por Gustavo
> (cérebro `modo-pcr/01_calcmed_pcr_atual.md`). Estrutura HTML capturada 1:1; lógica clínica
> (pcr.js) extraída por tela; paridade conferida lado-a-lado vs golden **ANTES** de trocar o
> iframe (A7 — nunca aproximar dose/energia/ciclo). Mapeia cada peça → componente/template do DS
> já pronto. Voz "manual de aviação" (`modo-pcr/00_README.md`): imperativo, plain-language clínico,
> zero ornamentação. PCR override aplica: persistência radical, touch target ≥48-52dp, cronômetro
> tabular ≥32px (refinar).

> ⚠️ **CRÍTICO:** PCR é o protocolo mais sensível do CalcMed (ACLS/AHA 2025). Qualquer divergência
> de **carga (J)**, **dose adrenalina/amiodarona/lidocaína**, **janela 3-5 min**, **ritmo chocável vs não-chocável**,
> ou **timer de ciclo 2 min** pode causar dano clínico. Paridade exata exigida em **TODOS** os pontos
> marcados ⚠️ neste doc. Sign-off do Luis + leitura cruzada com `pcr.js` antes de cada commit.

---

## 1. Estrutura de abas

3 abas (refactor de 5→3 confirmado em `pcr.js` inicializar() whitelist):

| Tab | Rota interna | Padrão CalcMed | Conteúdo |
|---|---|---|---|
| **Executar** | `aba-executar` | T1→T2→T3→T4 (NÃO-linear · sem stepper · stepper removido em comentário HTML linha 92) | Cards Compressões+Adrenalina, banner contextual, FAB evento, seleção ritmo, desfibrilar, RCE, salvar |
| **Histórico** | `aba-historico` | HistoryScreen (mesmo padrão Sepse/CAD) | Empty state · busca (oculta < 3 casos) · 5 filtros desfecho · lista cards · detalhe via modal |
| **ACLS\|AHA** | `aba-teoria` | TheoryScreen **especializada** com 3 sub-tabs + toggle Adulto/Pediatria | Panfletos · Cargas e Doses · Via Aérea |

> ⚠️ **Exceção do padrão "Teoria":** a 3ª aba é **ACLS\|AHA** (não "Consulta rápida" como Sepse). Tem **3 sub-tabs internas** (`teoria-subtabs`) + **toggle Adulto/Pediatria** no header (`teoria-toggle-ap-header`). Toggle vale pras 3 sub-tabs simultaneamente.

> ⚠️ Tabs antigas `aba-cargas` e `aba-via-aerea` foram removidas — viraram sub-tabs em ACLS\|AHA. Whitelist no `inicializar()` valida `abaAtual` contra `['executar','historico','teoria']`; localStorage antigo cai pro fallback `'executar'`.

### Header (compartilhado em todas as abas)
- Wordmark **"MODO PCR"** (fixo · não tem variação de protocolo)
- "Aberto há" + `cronometro-master` (HH:MM ou MM:SS · `font-feature-settings: 'tnum'`)
- Badge "Salvo" (toast inline, auto-hide 1.8s · `mostrarBadgeSalvo`)
- 3 botões: **Áudio** (toggle TTS+metrônomo) · **Anotação** (badge se preenchido) · **Sair**
- Linha de **chips** abaixo (esconde se nenhum estado relevante):
  - `chip-ritmo` (FV/TV s.p/AESP/Assistolia · cor por ritmo · oculto se 'na' ou RCE)
  - `chip-rce` (verde · "RCE" · só se RCE confirmado)
  - `chip-ciclo` (Ciclo N · oculto se não iniciado ou RCE)
  - `chip-adrenalinas` (Adren ×N · oculto se não iniciado)

> Header **NÃO** pinta vermelho/verde no body (comentário linha 122 explicitamente desliga `.classList.remove('rce','recidiva')` no header — comunica via chips só). Header é neutro.

### TabBar bottom (3 tabs)
- Executar (`#ico-executar`) — play arrow
- Histórico (`#ico-historico`) — relógio circular
- ACLS\|AHA (`#ico-teoria`) — livro aberto

---

## 2. Estado clínico armazenado (`estadoPadrao`)

LocalStorage keys (2):
- **`pcr_protocolo_atual`** — estado do caso ativo
- **`pcr_historico`** — array de casos salvos (unshift = novo no topo)

### `estado` (objeto único · linhas 21-54 do pcr.js)

| Chave | Tipo | Default | Onde muda |
|---|---|---|---|
| `iniciadoEm` | timestamp ms\|null | `null` | `iniciarPCR()` seta `Date.now()` |
| `telaAtual` | 1\|2\|3\|4 | `1` | `irParaTela(n)` |
| `abaAtual` | str | `'executar'` | `trocarAba(aba)` (whitelist em `inicializar()`) |
| `idade` | num\|null | `null` | Cenários dev; T4 pode preencher de inputs |
| `peso` | num\|null | `null` | T4 save · Cargas/Doses input · TET peso input · sincroniza 3 inputs (`_setPesoFromInput`) |
| `altura` | num\|null | `null` | T4 · VCV adulto altura · TET altura |
| `sexo` | `'m'\|'f'\|'masc'\|'fem'\|null` | `null` | T4 chips-sexo · VCV `onVaSexo(s)` |
| `ritmo` | `'fv'\|'tv'\|'aesp'\|'assistolia'\|'na'` | `'na'` | `setRitmo(r)` |
| `desfibrilado` | bool | `false` | `registrarChoque(true)` |
| `cicloAtual` | num | `1` | Auto-incrementa em `atualizarCardCompressoes` quando elapsed ≥ CICLO_MS+15s; manual em recidiva |
| `cicloIniciadoEm` | timestamp\|null | `null` | `iniciarPCR()`, auto-restart em fim de ciclo, `registrarRecidiva()` |
| `ultimaAdrenalinaEm` | timestamp\|null | `null` | `_registrarAdrenalina()` |
| `adrenalinaCount` | num | `0` | `_registrarAdrenalina()` (++) · undo decrementa |
| `intervaloAdrenalinaMin` | 3\|4\|5 | `3` | `setIntervaloAdrenalina(min)` — Onda 2.5 D35 |
| `bpm` | 100\|105\|110\|120 | `110` | `setBPM(bpm)` — segmented control inline (3 opções: 100/110/120) + modal "metronomo" (4 opções) |
| `audioOn` | bool | `true` | `toggleAudio()` |
| `rce` | bool | `false` | Modal `confirmar-rce` acao() |
| `recidiva` | bool | `false` | `registrarRecidiva()`, `confirmarNovaPCR('recidiva')` |
| `paciente.iniciais` | str\|null | `null` | `onIniciaisInput()` (UPPER, máx 6 chars) |
| `paciente.idadeAnos` | num\|null | `null` | (Não escrito direto — T4 lê do input) |
| `paciente.idadeMeses` | num\|null | `null` | (Não escrito direto — T4 lê do input) |
| `paciente.sexo` | `'ni'\|'m'\|'f'` | `'ni'` | T4 chips-sexo onclick |
| `paciente.desfecho` | `'revertida'\|'nao-revertida'\|'obito'\|'suspensa'` | `'revertida'` | T4 chips-desfecho · `encerrarSemRCE(motivo)` pré-marca |
| `paciente.obs` | str | `''` | T4 textarea (lida só no salvar) |
| `eventos[]` | `[{hora, acao, tag}]` | `[]` | `registrarEvento()`, push direto em vários flows |
| `eventoContadores{}` | `{key:num}` | `{}` | `aplicarEvento(key)` — Onda 6 (drogas/proc/ritmos) |
| `ultimaAplicacaoEm{}` | `{key:timestamp}` | `{}` | `aplicarEvento(key)` |
| `eventosCustomizados[]` | `[{key,nome,dose,acao}]` | `[]` | `abrirEventoCustomizado()` — Onda 6.1 "Outro" |
| `anotacao` | str | `''` | `salvarAnotacao()` — FB-05 cross-protocolo |
| `anotacaoEditadaEm` | ISO date\|null | `null` | Stamp ao editar |
| `teoriaSubAtiva` | `'panfletos'\|'cargas-doses'\|'via-aerea'` | `'panfletos'` | `trocarTeoriaSub(sub)` |
| `teoriaAP` | `'adulto'\|'pediatrico'` | `'adulto'` | `setTeoriaAP(ap)` |
| `rceCriterios[]` | `['pulso','etco2','pa']` subset | `[]` | Modal `confirmar-rce` ao confirmar (marcados no checklist) |
| `iniciaisSalvas` | str\|null | `null` | (declarado mas não usado no código atual) |
| `faixaEtariaVent` | `'pre-termo'\|'termo'\|'lactente'\|'pre-escolar'\|'escolar'\|'adolescente'` | undefined→`'pre-termo'` | VCV/PCV pediátrico select |
| `tetDiametro` | num\|null | undefined | `onTETDiamInput()` |
| `avisou30s` / `avisouAdrenJanela` / `avisouAdrenAtrasada` | bool | `false` | Flags anti-spam TTS · resetam a cada ciclo novo |

### Funções que mutam estado (todas chamam `salvarEstado()` no fim)
`carregarEstado` · `salvarEstado` · `resetarEstado` · `toggleAudio` · `iniciarPCR` · `irParaTela` · `trocarAba` · `setIntervaloAdrenalina` · `trocarTeoriaSub` · `setTeoriaAP` · `_setPesoFromInput` (`onCdPesoInput`, `onCdPesoInputLido`) · `onVaAlturaInput` · `onVaSexo` · `onTETDiamInput` · `onTETAlturaInput` · `onTETPesoInput` · `registrarEvento` · `aplicarAdrenalina`/`_registrarAdrenalina` · `aplicarEvento` · `abrirEventoCustomizado` (submit) · `salvarAnotacao` · `limparAnotacao` · `registrarChoque` · `setRitmo` · `setBPM` · `acaoSelecionarRitmo` · `checarPulsoResposta` · `confirmarNovaPCR` · `encerrarSemRCE` · `registrarRecidiva` · `onIniciaisInput` · `salvarPaciente` · `preencherT4` (sync chips) · cenários dev (todos resetam + setam mock).

### Cronômetros (intervalos JS)
- **`cronoInterval`** — `setInterval(tick, 500)`. Iniciado em `iniciarPCR()` e `inicializar()` (se `iniciadoEm`). Chama `atualizarHeader` + `atualizarCardCompressoes` + `atualizarCardAdrenalina` + `atualizarHintT2` em loop.
- **`_metronomoInterval`** — `setInterval(tick, 60000/bpm)`. Web Audio API · Oscillator 1000Hz 30ms gain 0.05. Inicia em `iniciarMetronomo()`, para em `pararMetronomo()`. Reset em `setBPM` (`_reiniciarMetronomoSeAtivo`).
- **`badgeSalvoTimeout`** — timeout 1.8s pra esconder badge "Salvo".
- **`setInterval(atualizarDebug, 500)`** — só dev panel.

### Auto-incremento de ciclo (linha 416-425)
```
if (elapsed >= CICLO_MS + 15000 && !estado.rce) {
  estado.cicloAtual++; estado.cicloIniciadoEm = Date.now(); ...
  registrarEvento(`Ciclo ${estado.cicloAtual} iniciado`, ''); ...
}
```
> ⚠️ **Buffer 15s** após o marco 2:00 antes de auto-rotacionar. Dá tempo do médico ver "MARCO · CHECAR" antes da transição.

### Janela de adrenalina (linha 11-17, parametrizada)
```js
function getAdrenalinaJanela() {
  const m = estado.intervaloAdrenalinaMin || 3; // 3/4/5 min
  return {
    inicioMs: Math.max(1, m - 1) * 60 * 1000,    // intervalo-1 min
    fimMs:    (m + 1) * 60 * 1000,                // intervalo+1 min
  };
}
```
> ⚠️ Default = 3 min (intervalo ACLS mínimo). Janela é **[m-1, m+1]** — ex: intervalo 3 → janela 2:00–4:00 (window-ok), depois 4:00+ = overdue. Constantes legacy `ADRENALINA_JANELA_INICIO_MS=180000` / `FIM_MS=300000` mantidas pra retrocompat mas não usadas no fluxo principal.

---

## 3. Telas/passos do fluxo Executar (4 telas)

### T1 · Iniciar PCR (idle)
**Seção:** `#tela-1` · ativa por default.
**Conteúdo:**
- Card **Compressões** (idle · `pcr-card-grande`): label "Compressões" · meta "Aguardando" · time `00:00` · helper "Cadência alvo · 100-120/min".
- Card **Adrenalina** (idle · `pcr-card-grande`): label "Adrenalina · ×0" · meta "Aguardando 1ª dose" · time `00:00` · helper "Janela 3-5 min após o início".

**Próximo hint:** "Iniciar cronômetros e operação"

**Botões rodapé** (2-cols):
- **Sair** (`btn-fantasma`) → `sairProtocolo()`
- **Iniciar PCR** (`btn-primary`) → `iniciarPCR()`

**Gates:** Nenhum gate em T1 (input paciente foi movido pra T4). Tap único no botão inicia.

**Comportamento `iniciarPCR()` (linha 361-383):**
1. `estado.iniciadoEm = Date.now()`, `cicloIniciadoEm = Date.now()`, reset flags aviso
2. `cicloAtual = 1`
3. Push evento "PCR iniciada"
4. `irParaTela(2)`
5. `iniciarCrono()` (loop tick 500ms)
6. **G1 Gustavo (D27):** após 350ms, se `telaAtual === 2 && ritmo === 'na'`, auto-abre modal `selecionar-ritmo`. Cronômetro **já está rodando** em background.
7. Se `audioOn`: TTS "PCR iniciada. Inicie compressões." + `iniciarMetronomo()`.

### T2 · PCR Ativa (operação)
**Seção:** `#tela-2`. **A tela mais complexa.**

**Conteúdo (top-down):**

1. **Banner contextual** (`#banner-t2`) — 3 estados dinâmicos:
   - `banner-pre-compressao` (amarelo, border-left 3px) · "Mantenha compressões {BPM}/min" + "Ciclo N · {N}s até checagem."
   - `banner-critico-marco` (vermelho, border-left 6px, pulse) — 2 sub-estados:
     - 0-30s antes do marco: "{Ns} · prepare desfibrilador" + "Aproxime o monitor, mantenha compressões." (TTS 1× "Trinta segundos. Prepare o desfibrilador.")
     - elapsed ≥ 2:00: "CHECAR PULSO/RITMO" (uppercase) + "Troque o compressor · ciclo seguinte a seguir." (TTS "Checar pulso e ritmo")
   - `banner-pos-choque` (amarelo) — setado em flows mas não no tick automático.
   - Botão **X close** (`fecharBanner`)

2. **Card Compressões** (`#card-compressoes`) — estado dinâmico:
   - `pcr-card-running` (border teal 2px) — em curso normal
   - `pcr-card-cycle-end` (border vermelho, bg crítico fundo) — elapsed ≥ CICLO_MS
   - Conteúdo: label "Compressões" + meta "CICLO N" (vira "MARCO N · CHECAR" no fim) + info-btn `compressoes-qualidade` + time MM:SS · progress bar (atencao a 30s do fim, critico ≥ marco) · segmented control BPM 100/110/120 (`bpm-selector`, `data-bpm`, ativa visual).

3. **Card Adrenalina** (`#card-adrenalina`) — estado dinâmico:
   - `pcr-card-idle` se sem referência (raro)
   - `pcr-card-window-pre` (border padrão · cinza) elapsed < `inicioMs`
   - `pcr-card-window-ok` (border verde · bg fundo verde) `inicioMs ≤ elapsed < fimMs` (TTS 1× "Janela de adrenalina aberta.")
   - `pcr-card-window-overdue` (border crítico · pulse) elapsed ≥ `fimMs` (TTS 1× "Atenção. Adrenalina atrasada.")
   - Conteúdo: label "Adrenalina · ×N" + meta dinâmico ("Próxima em" / "Desde última dose" / "Desde início" + sufixo "JANELA ABERTA" / "ATRASADA") + info-btn `adrenalina` + time MM:SS · window-track com marcadores `3 min`/`5 min` em 60%/100% + window-fill (% até `fimMs`) · segmented control intervalo 3/4/5 min (`chips-intervalo-adren`) · botão **"Apliquei agora"** (`btn-aplicar-adrenalina`) → `aplicarAdrenalina()`.

4. **Linha do tempo** (`#event-list`) — `<details>` colapsável:
   - Summary: "Linha do tempo" + contador "N eventos"
   - Vazio: "Eventos vão aparecer aqui conforme você opera."
   - Itens: hora absoluta HH:MM:SS + T+offset MM:SS (mono) + ação + tag colorida (`choque` amarelo · `droga` teal · `marco` vermelho · `rce` verde)

5. **Acoes-row** (2-cols grid):
   - **Selecionar ritmo** (`btn-acao-grande`) → `acaoSelecionarRitmo()` — abre **`checar-pulso-ritmo`** se PCR ativa, ou **`selecionar-ritmo`** direto se T1 (D41 gate)
     - Ícone coração · texto · sub "Não avaliado" (ou label do ritmo selecionado)
   - **Desfibrilar** (`btn-acao-grande` disabled se ritmo não-chocável) → `abrirModalPCR('aplicar-choque')`
     - Ícone raio · sub "200 J · bifásico" (ou `{2J/kg} J · 2 J/kg` em pediátrico)

**Próximo hint** (dinâmico em `atualizarHintT2`):
- `ritmo === 'na'` → "Selecionar ritmo · checar monitor"
- elapsed ≥ CICLO_MS → "Checar pulso · 10 s · trocar compressor"
- adrenalina overdue → "Adrenalina ATRASADA · aplique 1 mg IV/IO agora"
- chocável → "Manter compressões · próximo choque {NJ}"
- não-chocável → "Manter compressões · 5H/5T se não-chocável"

**Botões rodapé** (3-cols · `botoes-rodape-pcr-3`):
- **Pausa** (`btn-fantasma`) → `abrirModalPCR('pausar')`
- **Stop** (`btn-fantasma btn-stop-pcr` · cor crítico) → `abrirModalPCR('encerrar-sem-rce')`
- **RCE** (`btn-primary`) → `abrirModalPCR('confirmar-rce')`

**FAB** (`fab-evento` · 56×56 círculo teal, ancorado em `.tela-acao` com `bottom:100%` + `margin-bottom:16`):
- Sempre visível em T2 · ícone "+" · `abrirModalPCR('adicionar-evento')`

**Tick (loop 500ms) chamado por `iniciarCrono`:**
- `atualizarHeader` (sempre)
- Se `telaAtual === 2 && iniciadoEm && !rce`:
  - `atualizarCardCompressoes` (timer, progress, banner dinâmico, auto-cicle)
  - `atualizarCardAdrenalina` (timer desde ref, window state, TTS gates)
  - `atualizarHintT2`

### T3 · Pós-RCE (cuidados)
**Seção:** `#tela-3`. Aberta via modal `confirmar-rce` → acao().

**Conteúdo:**
- Header row: título "RCE confirmado" + subtítulo "Foque em estabilizar. Cronômetro do caso segue rodando." + info-btn (`cuidados-pos-pcr`)
- **Banner verde** (`banner-pos-rce`): título "Decúbito lateral · SpO₂ 90-98%" + corpo "ECG urgente · estabilizar via aérea · controle térmico."
- **Lista 5 cuidados** (`cuidados-list` · cards com `status-bullet` por severidade):
  1. **Crítico** · ECG 12 derivações · "Identificar STEMI. Cateterismo urgente se infarto."
  2. **Atenção** · Estabilizar via aérea · "Confirmar IOT com capnografia. ETCO₂ ≥ 10 mmHg sustentado."
  3. **Atenção** · SpO₂ 90-98% · "Evite hiperóxia. Decúbito lateral se sem IOT."
  4. **Info** · Volume e vasopressor · "PAM ≥ 65. Cristaloide se hipovolemia. NE 0,01-1 mcg/kg/min."
  5. **Info** · TTM 32-36 °C por 24h · "Controle térmico se paciente inconsciente."
- **Alerta atenção** "Atento à recidiva" · "Se a parada voltar, toque 'Registrar nova parada'. O cronômetro do caso continua o mesmo."

**Próximo hint:** "Salvar para registrar · ou aguardar 2-4 h de observação"

**Botões rodapé** (`botoes-rodape-pos-rce` · 3 ações hierarquizadas · Lia+Jakob opção C):
- Row 1 (lado-a-lado, fill 1:1, ghost):
  - **Finalizar** → `abrirModalPCR('finalizar-sem-salvar')`
  - **Nova PCR** (`btn-secundario`) → `abrirModalPCR('nova-pcr-confirmar')`
- Row 2: **Salvar paciente** (`btn-primary btn-full`, full-width) → `irParaTela(4)`

### T4 · Salvar Paciente (form)
**Seção:** `#tela-4`. Aberta via "Salvar paciente" em T3 ou via `encerrarSemRCE`.

**Conteúdo:**
- Header row: título "Salvar paciente" + sub "Iniciais e desfecho são suficientes. Observações são livres." + info-btn (`lgpd`)
- **Iniciais** (input · obrigatório · max 6 chars · UPPER · `onIniciaisInput`) + helper "Apoio à memória. LGPD: nunca substitui prontuário."
- **Idade** (2-cols): anos (max 3) + meses (max 2)
- **Peso/Altura** (2-cols): peso kg (decimal, max 5) + altura cm (numeric, max 3)
- **Sexo** (`faixa-chips`): Não informado (default) · Masculino · Feminino — sync com `paciente.sexo` + `estado.sexo` top-level (usado por Via Aérea peso predito)
- **Desfecho** (`faixa-chips`, wrap): Revertida (default) · Não revertida · Óbito · Suspensa
- **Observações** (textarea 4 rows): "Ritmo predominante, drogas usadas, intercorrências, etc."

**Próximo hint:** "Caso vai pro Histórico deste aparelho"

**Botões rodapé** (2-cols):
- **Sair sem salvar** (`btn-fantasma`) → `abrirModalPCR('sair-sem-salvar')`
- **Salvar paciente** (`btn-primary` · disabled até `iniciais.length ≥ 1`) → `salvarPaciente()`

**Gate** (`validarSalvar`): só liberado quando `iniciais` preenchidas.

**`salvarPaciente()` (linha 2036-2066):**
- Push em `pcr_historico` (unshift no topo) com: iniciais, data ISO, duracaoMs, idade/idadeMeses, peso, altura, sexo (`paciente.sexo`), desfecho (`paciente.desfecho`), ritmoFinal, adrenalinaCount, ciclos, obs, eventos (snapshot), anonimo:false.
- `resetarEstado()` (apaga `pcr_protocolo_atual` mas mantém `pcr_historico`)
- Toast "Paciente salvo · Caso arquivado no histórico."
- `setTimeout 1500ms → window.location.href = '../../../index.html'`

---

## 4. Modais/sheets — TODOS (29 total + 4 dinâmicos custom)

> Todos via `abrirModalPCR(id)` (linha 1713). Renderiza `modal-header` (título + close) · `modal-body` (corpo) · `modal-footer` (botão primary).
> `titulo` e `corpo` podem ser **string OU função** (pra renderizar com estado atual).
> Tem `acao` opcional (callback ao confirmar).
> Sheet customizado fora do mapa: `confirmarAcao()` (modal próprio app · NÃO usar `confirm()` nativo — R7).

| ID | Título | Tipo | Ações principais | Notas |
|---|---|---|---|---|
| `o-que-e-pcr` | "O que é o Modo PCR" | Info | Entendi | Lista 4 features · voz combate |
| `por-que-cadastrar` | "Por que cadastrar idade e peso" | Info | Entendi | Explica adulto vs pediátrico · cargas |
| `compressoes-qualidade` | "Qualidade da RCP" | Info | Entendi | Lista: 100-120/min · profundidade · retorno · interrupções <10s · trocar 2min · FCT ≥60% |
| `adrenalina` | "Adrenalina na PCR" | Info | Entendi | 1 mg IV/IO 3-5 min · FV/TV após 2º choque · AESP/Assistolia imediato |
| `metronomo` | "Ritmo de compressões" | Decisão | Fechar | 4 chips BPM 100/105/110/120 (T2 inline tem 3: 100/110/120) |
| `selecionar-ritmo` | "Ritmo cardíaco" | Decisão (5 opts) | Fechar | 5 botões: FV [CHOCÁVEL] · TV s.p [CHOCÁVEL] · AESP [NÃO-CHOCÁVEL] · Assistolia [NÃO-CHOCÁVEL] · Não Avaliado · `setRitmo(r)` |
| `pausar` | "Pausar PCR" | Decisão | "Pausar tudo" → registra evento | "Cronômetro continua. Compressões serão interrompidas." |
| `encerrar-sem-rce` | "Encerrar sem RCE?" | Decisão (2 opts) | Cancelar | 2 cards: Óbito declarado · Suspensa por decisão clínica · `encerrarSemRCE(motivo)` |
| `confirmar-rce` | "Confirmar RCE" | Decisão | "Confirmar RCE" → acao() | 3 checkboxes: Pulso central · ETCO₂ >40 mmHg · Onda PA invasiva (apoio cognitivo, NÃO é gate · D28) |
| `aplicar-choque` | "Aplicar choque?" | Decisão (2 opts) | Fechar | "Desfibrilado" → `registrarChoque(true)` · "Não desfibrilado" → cancela |
| `checar-pulso-ritmo` | "Paciente tem pulso?" | Gate (D41) | Fechar | 2 cards: Sim → confirmar-rce · Não → selecionar-ritmo |
| `5h5t-resumo` | "Causas reversíveis · revise agora" | Info auto | Já revisei | Auto-dispara 250ms após setRitmo AESP/Assistolia. 5H+5T pills mnemônicas. |
| `nova-pcr-confirmar` | "Nova PCR · qual paciente?" | Decisão | Cancelar | Mesmo paciente (recidiva) · Outro paciente (salva atual) · `confirmarNovaPCR(tipo)` |
| `sair-modo-pcr` | "Sair do Modo PCR?" | Decisão | "Sair (PCR continua)" | D47 · push em background simulado · redirect index.html |
| `adicionar-evento` | "Adicionar evento" | Decisão | Fechar | Função render. Grupos: Drogas (Amio/Lido/Bic) · Personalizados (se customs) · Procedimento (IOT) · Ritmos atípicos (Idioventricular/Torsades) · Card "Outro" |
| `algoritmo` | "Algoritmo PCR" / "Algoritmo PCR Pediátrico" | Panfleto | Fechar | Placeholder · imagem AHA 2025 importar Figma |
| `hh-tt` | "Causas reversíveis" | Info | Fechar | 5H+5T pills mnemônicas (mesmo molde do `5h5t-resumo`) |
| `cuidados-pos-pcr` | "Cuidados pós-PCR" / "Cuidados pós-PCR Pediátrico" | Panfleto | Fechar | Placeholder |
| `qualidade-rcp` | "Qualidade RCP" / "Qualidade RCP Pediátrico" | Panfleto | Fechar | Placeholder |
| `via-aerea-vcv` | "VCV · Ventilação Controlada Volume" | Calc | Fechar | Render dinâmico (adulto/peso predito ARDSnet OU pediatria/faixa etária) |
| `via-aerea-pcv` | "PCV · Ventilação Controlada Pressão" | Calc | Fechar | Render dinâmico (adulto literal OU pediatria/faixa etária) |
| `via-aerea-tet-tamanho` | "Tamanho do Tubo (TET)" | Tabela | Fechar | Só pediatria. Tabela 6 linhas (faixas) × 3 cols (faixa/sem cuff/com cuff) |
| `via-aerea-tet-profundidade` | "Profundidade do TET" | Calc | Fechar | Só pediatria. 3 fórmulas: tubo (diam×3) · altura (alt/10+5) · peso (6+peso) |
| `cargas` | "Cargas de desfibrilação" | Info | Fechar | (legado · usado se aba antiga · prob não chamado) |
| `doses` | "Doses ACLS" | Info | Fechar | Lista: Adrena · Amio (300+150, max 2,2g/24h) · Lido (1-1,5mg/kg, max 3mg/kg) · Mg (1-2g) · Bicarbonato · Cálcio · Atropina (NÃO em PCR pós-2020) |
| `lgpd` | "LGPD · Privacidade" | Info | Entendi | Apenas neste aparelho · iniciais não nome |
| `sair-sem-salvar` | "Sair sem salvar?" | Decisão | "Sim, sair" → salva anônimo + redirect | desfecho derivado de `rce` (revertida/suspensa) |
| `finalizar-sem-salvar` | "Finalizar sem salvar?" | Decisão | "Finalizar" → idem | Reusa `sair-sem-salvar.acao()` |

### Modais dinâmicos (NÃO no map · construídos inline)
- **`confirmarAcao(opts)`** (linha 196) — confirm modal genérico (titulo, corpo, botaoConfirmar, botaoCancelar, perigo, onConfirmar). Usado em: Anti-double-tap adrenalina <30s · Nova PCR "outro paciente" salva atual · Sair pós-RCE · Excluir caso histórico · Resetar dev.
- **`abrirAnotacao()`** (linha 1749) — modal anotação. Textarea + Limpar + Salvar anotação · timestamp última edição.
- **`abrirEventoCustomizado()`** (linha 1642) — modal "Outro evento". Inputs Nome (obrigatório, max 50) + Dose (opcional, max 60). Cria card persistente em `eventosCustomizados` + aplica imediato. Enter no input submete.
- **`abrirCasoDetalhePCR(idx)`** (linha 2149) — detalhe do caso no histórico. Grupos: Caso · Desfecho clínico · Operação · Linha do tempo · Observações. Ações Excluir / Compartilhar.

### Tipos por molde (mapeio React)
- **InfoSheet** (info-only · 1 botão "Entendi"/"Fechar"): `o-que-e-pcr`, `por-que-cadastrar`, `compressoes-qualidade`, `adrenalina`, `hh-tt`, `cuidados-pos-pcr`, `qualidade-rcp`, `algoritmo`, `cargas`, `doses`, `lgpd`.
- **DecisionSheet** (2-3 opções em card): `encerrar-sem-rce`, `aplicar-choque`, `checar-pulso-ritmo`, `nova-pcr-confirmar`, `pausar`, `sair-modo-pcr`, `sair-sem-salvar`, `finalizar-sem-salvar`, `selecionar-ritmo` (5 opts), `metronomo` (chips).
- **ChecklistSheet** (info + checks): `confirmar-rce` (3 checks · não-gate).
- **CalcSheet** (input + cálculo): `via-aerea-vcv`, `via-aerea-pcv`, `via-aerea-tet-profundidade`.
- **TableSheet**: `via-aerea-tet-tamanho`.
- **CallToActionSheet** (auto-trigger): `5h5t-resumo`.
- **PanfletoSheet** (placeholder imagem AHA): `algoritmo`, `cuidados-pos-pcr`, `qualidade-rcp`.

---

## 5. Algoritmo clínico ACLS — fluxo de decisão (paridade ⚠️)

### Ritmos
| Ritmo | Label | Categoria | Desfibrilável |
|---|---|---|---|
| `fv` | FV (Fibrilação Ventricular) | **Chocável** | ✅ |
| `tv` | TV sem pulso | **Chocável** | ✅ |
| `aesp` | AESP (Atv Elétrica Sem Pulso) | **Não-chocável** | ❌ |
| `assistolia` | Assistolia | **Não-chocável** | ❌ |
| `na` | Não Avaliado | — | ❌ (botão Desfibrilar disabled) |

**Auto-trigger:** ao selecionar AESP ou Assistolia, dispara modal `5h5t-resumo` após 250ms (Onda 2.2 · D36).

### Ciclos (CICLO_MS = 2 × 60 × 1000 ms = 120s exatos)
- Cada ciclo dura **2 minutos**. Progress bar enche 0→100%.
- **30s antes do fim:** banner crítico "30s · prepare desfibrilador" + TTS "Trinta segundos. Prepare o desfibrilador." (`avisou30s` flag · 1× por ciclo)
- **No marco 2:00:** banner crítico "CHECAR PULSO/RITMO" + TTS "Checar pulso e ritmo". Card vira `pcr-card-cycle-end` (vermelho).
- **Após 15s no marco** (i.e. 2:15): auto-rotaciona pra próximo ciclo. Reset `cicloIniciadoEm`, push evento "Ciclo N iniciado", reset flags aviso.
- **Compressões:** 100-120/min (default 110). Inline segmented 100/110/120 (modal expandido tem 105 também).
- **RCP ratio:** 30:2 adulto · 15:2 pediátrico com 2 socorristas (mencionado no subtítulo Algoritmo Pediátrico em `setTeoriaAP`).

### Drogas (paridade ⚠️ exata)

| Droga | Adulto | Pediátrico (peso=X kg) | Indicação | Onde |
|---|---|---|---|---|
| **Adrenalina** | 1 mg IV/IO 3-5 min · ampola 1 mg/mL sem diluir | **0,01 mg/kg** = `(peso×0.01).toFixed(2)` mg · diluir 1mg em 10mL SF (1:10) | FV/TV após 2º choque · AESP/Assist imediato. **Sem teto fixo.** Suspender só com RCE/encerrar. | `aplicarAdrenalina` (T2 botão · ou FAB+evento) |
| **Amiodarona** | 1ª dose **300 mg bolus** · 2ª dose **150 mg** após próximo choque · diluir SG5% 20mL | **5 mg/kg bolus** = `round(peso×5)` mg · repetir até 15 mg/kg total | FV/TV refratária | FAB → Adicionar evento (drogas) |
| **Lidocaína** | 1ª dose **1-1,5 mg/kg** = `round(peso×1)-round(peso×1.5)` mg · subseqs **0,5-0,75 mg/kg** · max **3 mg/kg** total = `round(peso×3)` mg | **1 mg/kg** = peso mg bolus | Alternativa Amio em FV/TV refratária | FAB → Adicionar evento (drogas) |
| **Magnésio** | **1-2 g IV** diluído 10mL SG5% bolus | (mesma referência adulto) | **Torsades de Pointes** específico | Modal `doses` (mencionado · não na lista enxuta FAB) |
| **Bicarbonato** | **1 mEq/kg** IV | (mesma) | Hipercalemia · acidose · intox tricíclico (NÃO rotina) | FAB → Adicionar evento (drogas) |
| **Cálcio gluconato** | 1 g IV | — | Hipercalemia · hipocalcemia · bloq Ca | Modal `doses` |
| **Atropina** | NÃO em PCR pós-2020 · só bradi sintomática | — | Excluída do ACLS PCR | Modal `doses` (aviso explícito) |
| **Vasopressina** | 40 UI bolus único · pode substituir 1ª-2ª adrenalina | — | Uso limitado | Modal `doses` helper |

### Cargas de desfibrilação (paridade ⚠️ exata · `atualizarTeoriaCargasDoses`)

| Cenário | Adulto | Pediátrico (peso=X kg) |
|---|---|---|
| 1º choque | **200 J · bifásico** | **2 J/kg** = `round(peso×2)` J |
| 2º choque | escalonar até 360 J (mantém 200 OK) | **4 J/kg** = `round(peso×4)` J |
| Subseqs | até **360 J** (max) · monofásico 360 sempre | até **10 J/kg** = `round(peso×10)` J (limite: dose adulto) |
| Repetição | após cada ciclo 2 min | idem |
| Choque ≤ 10 s | Não interromper compressões > 10s | idem |

> No card "Desfibrilar" da T2: sub é `200 J · bifásico` (adulto) ou `{round(peso×2)} J · 2 J/kg` (pediátrico < 18 anos, com peso).

### Sequência ACLS adulto (Algoritmo PCR — `setTeoriaAP('adulto')` subtitulo)
"Passo a passo · reconhecer, RCP, choque, adrenalina, reavaliar."

### Sequência ACLS pediátrico (subtitulo pediátrico)
"Passo a passo · reconhecer, RCP 30:2 (15:2 com 2 socorristas), ritmo, IV/IO."

### RCE (Retorno da Circulação Espontânea)
**Critérios (3 checkboxes apoio cognitivo · D28 NÃO é gate):**
1. Pulso central (carótida ou femoral palpável)
2. ETCO₂ > 40 mmHg (súbito e mantido)
3. Onda PA invasiva (pulsátil consistente)

**`confirmar-rce.acao()` (linha 1249):**
- `marcados` = checkboxes marcados
- `rce = true`, `recidiva = false`, `rceCriterios = marcados`
- Push evento `RCE confirmado · N/3 critérios` (tag `rce`)
- `pararMetronomo()` · TTS "Retorno da circulação espontânea confirmado. Inicie os cuidados pós-parada."
- `irParaTela(3)` → tela Pós-RCE

**Recidiva (`registrarRecidiva` / `confirmarNovaPCR('recidiva')`):**
- `rce = false`, `recidiva = true`, `cicloAtual++`, `cicloIniciadoEm = Date.now()`, reset flags aviso
- Push evento "RECIDIVA · nova parada" tag `marco` · ou "Recidiva · PCR retoma" tag `critico`
- `irParaTela(2)`

---

## 6. Timers / Cronômetros

| Timer | Duração | Display | Início | Fim | Alertas |
|---|---|---|---|---|---|
| **Master (caso)** | desde `iniciadoEm` (sem teto) | `cronometro-master` no header · MM:SS (ou HH+MM se ≥1h) | `iniciarPCR()` | Nunca para automaticamente · zera com `resetarEstado` (após save ou stop) | nenhum |
| **Ciclo compressões** | 2 min exatos (120s) | `ciclo-time` no card Compressões · MM:SS · progress fill 0-100% | `iniciarPCR()`, auto-restart no fim de ciclo, recidiva | Auto-rotaciona 15s após o marco | 30s antes → atencao (amarelo) · marco → critico (vermelho) · TTS 1× cada |
| **Adrenalina** | desde `ultimaAdrenalinaEm`\|`iniciadoEm` (progressivo · sem teto) | `adrenalina-time` no card Adren · MM:SS · window-fill 0-100% até `fimMs` | `iniciarPCR()` ou `aplicarAdrenalina` | Nunca para (até RCE) | window-pre (cinza) → window-ok (verde · TTS "janela aberta") → window-overdue (vermelho pulsante · TTS "atrasada") |
| **Metrônomo** | sub-segundos | (áudio · tick 1000Hz 30ms) | `toggleAudio` ligado + (`iniciarPCR` ou setBPM) | `pararMetronomo` (RCE confirmado · stop · áudio off) | beep cada `60000/bpm` ms |
| **Janela RCE pós-cessação** | — | — | — | — | **NÃO existe explícito.** T3 fica indefinida até user decidir. (Cérebro PCR menciona "aguardar 2-4h de observação" no hint mas não timer ativo.) |

> ⚠️ **Buffer 15s** no auto-cicle (NÃO é 0s no marco) — dá tempo de leitura. Documentar pra dev React não bater 1:1 em 2:00 se isso for pra mudar.

> ⚠️ Adrenalina conta **progressivo desde última dose** (preferência Gustavo Q15+16), NÃO regressivo até próxima dose. Janela ABERTA = visual encoraja apply (verde), não bloqueia.

---

## 7. Histórico

### Empty state (`historico-vazio`)
- Ícone histórico (relógio) 40×40
- Título: "Nenhuma PCR registrada ainda"
- Sub: "As PCRs encerradas aparecem aqui com iniciais e desfecho."
- CTA: **"Iniciar Modo PCR"** (`btn-primary`) → `trocarAba('executar'); irParaTela(1)`
- Helper LGPD: "Histórico salvo apenas neste aparelho. Não substitui prontuário oficial."

### Estado com casos
- **Busca** (`historico-busca` · `oninput="filtrarHistoricoPCR(this.value)"`) — só aparece se ≥3 casos
- **Filtros chip** (`historico-filtros` · `faixa-chips` wrap):
  - Todas (default)
  - Revertida
  - Não revertida
  - Óbito
  - Suspensa
  - → `filtrarHistoricoPCRChip(filtro)` muda `historicoFiltroChip` global
- **Lista** (`historico-lista`):
  - Cada item: `historico-item` button
    - Top: `iniciais` (bold) + `data` (`DD/MM · HH:MM`)
    - Meta: desfecho · duração mono (Nh Nmin) · Adren ×N mono
    - Tag "Concluído"
  - Onclick → `abrirCasoDetalhePCR(idx)`

### Detalhe do caso (modal)
**Header:** iniciais como título.
**Grupos (`caso-meta-grupo`):**
1. **Caso** — Encerrado em (DD/MM/YYYY · HH:MM) · Duração (mono) · Idade (Na Nm) · Peso (X kg mono)
2. **Desfecho clínico** — Desfecho · Ritmo final (FV/TV/AESP/Assistolia/NA)
3. **Operação** — Adrenalinas ×N · Ciclos N
4. **Linha do tempo** (se eventos) — Timeline com offset min (calculado: hora_evento - data_caso + duracaoMs)
5. **Observações** (se obs) — texto white-space pre-wrap
6. Helper LGPD

**Footer:**
- **Excluir** (`btn-fantasma`) → `confirmarAcao` perigo → splice + re-render + toast
- **Compartilhar** (`btn-primary`) → `navigator.share` (mobile) ou clipboard fallback. Texto:
  ```
  CalcMed · PCR encerrada
  Paciente: {iniciais}
  Desfecho: {label}
  Duração: Nh Nmin
  Ritmo final: {label}
  Adrenalinas: ×N
  Ciclos: N
  Data: {pt-BR locale}
  ```

### Salvar anônimo (sair sem salvar / finalizar)
Push em `pcr_historico` com `iniciais: '-'`, `anonimo: true`, desfecho derivado (`rce ? 'revertida' : 'suspensa'`). Sem idade/peso/altura/sexo se não setados.

---

## 8. Aba ACLS|AHA — conteúdo completo

### Layout
- Header: título "ACLS | AHA" + sub "Referência rápida ACLS / AHA 2025."
- **Toggle Adulto/Pediatria** (`teoria-toggle-ap teoria-toggle-ap-header`) — válido nas 3 sub-tabs simultaneamente.
- **Sub-tabs** (`score-tabs teoria-subtabs` role=tablist):
  - **Panfletos** (default)
  - **Cargas e Doses**
  - **Via Aérea**
- Rodapé: "Conteúdo baseado em ACLS / AHA 2025."

### Sub-tab 1 · Panfletos
4 cards (`teoria-card` · button) que abrem modais:
1. **Algoritmo PCR** — sub muda por AP:
   - Adulto: "Passo a passo · reconhecer, RCP, choque, adrenalina, reavaliar."
   - Pediátrico: "Passo a passo · reconhecer, RCP 30:2 (15:2 com 2 socorristas), ritmo, IV/IO."
2. **Causas reversíveis** — sub: "5H + 5T · ritmo não-chocável." → modal `hh-tt`
3. **Cuidados pós-PCR** — sub muda por AP:
   - Adulto: "Estabilização após RCE · via aérea, hemodinâmica, neuroproteção."
   - Pediátrico: "Estabilização após RCE · via aérea, hemodinâmica, normotermia, neuroproteção."
4. **Qualidade RCP** — sub muda por AP:
   - Adulto: "Frequência, profundidade ≥ 5 cm, retorno completo, interrupções."
   - Pediátrico: "Frequência, profundidade 1/3 do tórax, retorno completo, interrupções."

### Sub-tab 2 · Cargas e Doses
**Input peso topo** (`cd-peso-ped`) — visível **só em pediátrico**. Sincroniza com o input inline da Lidocaína (adulto) via `_setPesoFromInput` (handler universal · espelha valor entre os 2 inputs).

**5 cards alert** (cada um com label · cor primário valor mono · detalhe):

#### Desfibrilação ⚠️
- Adulto · "200 J · bifásico" · "Adulto · 200 J bifásico · escalonar até 360 J. Repetir após cada ciclo 2 min."
- Pediátrico (peso=X): "{round(X×2)} J · 2 J/kg" · "Pediátrico ({X} kg) · 1º choque {round(X×2)} J (2 J/kg) · 2º choque {round(X×4)} J (4 J/kg) · subsequentes até {round(X×10)} J (10 J/kg)."
- Pediátrico (sem peso): "2-4 J/kg" · "... Informe o peso na T1 pra cálculo automático."

#### Adrenalina ⚠️
- Adulto · "1 mg IV/IO" · "Bolus 1 mg IV/IO a cada 3-5 min · ampola 1 mg/mL sem diluir. FV/TV após 2º choque · AESP/Assistolia imediato."
- Pediátrico (peso=X): "{(X×0.01).toFixed(2)} mg IV/IO" · "Pediátrico ({X} kg) · 0,01 mg/kg = {dose} mg IV/IO a cada 3-5 min · diluir 1 mg em 10 mL SF (1:10)."
- Pediátrico (sem peso): "0,01 mg/kg IV/IO" · "... Informe peso pra cálculo."

#### Amiodarona ⚠️
- Adulto · "300 mg + 150 mg IV/IO" · "FV/TV refratária: 1ª dose 300 mg bolus · 2ª dose 150 mg após próximo choque. Diluir em SG 5% 20 mL."
- Pediátrico (peso=X): "{round(X×5)} mg IV/IO (5 mg/kg)" · "Pediátrico ({X} kg) · 5 mg/kg = {dose} mg em bolus · pode repetir até 15 mg/kg total."

#### Lidocaína ⚠️ (com input peso INLINE no card · adulto)
- Adulto (sem peso): "1-1,5 mg/kg IV/IO" · "Alternativa à Amiodarona em FV/TV refratária. 1ª dose 1-1,5 mg/kg · doses seguintes 0,5-0,75 mg/kg até 3 mg/kg total. Informe peso pra calcular."
- Adulto (peso=X): "{round(X×1)}-{round(X×1.5)} mg · máx {round(X×3)} mg" · "Adulto ({X} kg) · 1ª dose 1-1,5 mg/kg ({d1}-{d2} mg) · doses seguintes 0,5-0,75 mg/kg até {dmax} mg total. Alternativa à Amiodarona em FV/TV refratária."
- Pediátrico (peso=X): "{X} mg IV/IO (1 mg/kg)" · "Pediátrico ({X} kg) · 1 mg/kg = {X} mg em bolus."
- **Input inline** (`cd-card-peso-inline-lido`) — visível só em adulto. Peso kg. Border dashed top.

#### Magnésio
- Static (ambos APs): "1-2 g IV/IO" · "Indicação específica · Torsades de Pointes. Sulfato de Magnésio 1-2 g diluído em 10 mL SG 5% em bolus."

### Sub-tab 3 · Via Aérea
4 cards (`teoria-card`):

1. **Tamanho do Tubo (TET)** (`va-card-ped` · só pediatria) — "Diâmetro interno por idade · sem ou com cuff." → modal tabela (6 faixas × cuff/sem cuff). Fórmula clássica >2 anos: sem cuff = idade/4+4 · com cuff = idade/4+3,5.
2. **Profundidade do TET** (`va-card-ped` · só pediatria) — "Calcula pelo tubo, altura ou peso." → modal 3 fórmulas: tubo (diam×3) · altura (alt/10+5) · peso (6+peso). Cada uma com input independente · result alert info.
3. **VCV · Ventilação Controlada Volume** — sub muda por AP:
   - Adulto: "Volume alvo · 6-8 mL/kg peso predito."
   - Pediátrico: "Volume alvo · varia por faixa etária."
   - Modal VCV adulto: altura + sexo → peso predito ARDSnet (Devine: base 50/45.5 + 0.91×(altura-152.4)) → VC = 6-8 × pp. Empty state se faltam dados. Lista: FR 10-12 · PEEP 5 · FiO₂ 100% inicial · I:E 1:2. Helper "ventilação assíncrona 10 ipm aceitável".
   - Modal VCV pediátrico: select faixa etária → `VENT_PEDIATRIA[faixa]` (objeto com vc/fr/peep/pico/ie por faixa: pre-termo, termo, lactente, pre-escolar, escolar, adolescente).
4. **PCV · Ventilação Controlada Pressão** — sub muda por AP:
   - Adulto: "Pressão alvo · 12-20 cmH₂O inicial."
   - Pediátrico: "Pressão alvo · varia por faixa etária."
   - Modal PCV adulto: pressão pico 12-20 cmH₂O · FR 10-12 · PEEP 5 · FiO₂ 100% · I:E 1:2 · Trigger 1-3 L/min ou -1 a -3 cmH₂O.
   - Modal PCV pediátrico: select faixa etária → mesmo VENT_PEDIATRIA.

### Tabela VENT_PEDIATRIA (referência completa · linha 728-735)
| Faixa | Label | VC | FR | PEEP | Pico | I:E |
|---|---|---|---|---|---|---|
| `pre-termo` | Neonatos Pré-termo | 4-6 mL/kg | 40-60 irpm | 5-6 cmH₂O | 15-20 cmH₂O | 1:2 |
| `termo` | Neonatos a Termo | 4-6 mL/kg | 30-40 irpm | 5 cmH₂O | 15-20 cmH₂O | 1:2 |
| `lactente` | Lactente (1-12 meses) | 5-7 mL/kg | 25-30 irpm | 5 cmH₂O | 15-20 cmH₂O | 1:2 |
| `pre-escolar` | Pré-escolar (1-5 anos) | 6-8 mL/kg | 20-25 irpm | 5 cmH₂O | 18-22 cmH₂O | 1:2 |
| `escolar` | Escolar (6-11 anos) | 6-8 mL/kg | 18-22 irpm | 5 cmH₂O | 18-22 cmH₂O | 1:2 |
| `adolescente` | Adolescente (12-18 anos) | 6-8 mL/kg | 12-16 irpm | 5 cmH₂O | 20-25 cmH₂O | 1:2 |

### Tabela TET_TAMANHO (linha 876-883)
| Faixa | Sem cuff | Com cuff |
|---|---|---|
| Neonato pré-termo (<1 kg) | 2,5 mm | — |
| Neonato pré-termo (1-2 kg) | 3,0 mm | — |
| Neonato termo / até 6 m | 3,5 mm | 3,0 mm |
| 6 m – 1 ano | 4,0 mm | 3,5 mm |
| 1 – 2 anos | 4,5 mm | 4,0 mm |
| > 2 anos | idade/4 + 4 | idade/4 + 3,5 |

---

## 9. Eventos registrados na timeline (tags + estrutura)

### Estrutura do evento (`{hora, acao, tag}`)
- `hora`: timestamp ms (`Date.now()`)
- `acao`: string descritiva (impressa no card)
- `tag`: string — afeta cor/destaque do chip lateral:
  - `''` (vazio) — sem tag
  - `'droga'` — chip teal `var(--interativo-primario)`
  - `'choque'` — chip amarelo `var(--retorno-atencao)`
  - `'marco'` — chip vermelho `var(--retorno-critico)`
  - `'rce'` — chip verde `var(--retorno-sucesso)`
  - `'critico'` — sem CSS específico (cai no default · usado em encerrar/recidiva)

### Display (renderizarEventos · linha 1091)
- Ordem: **reverse** (mais novo no topo)
- Hora: HH:MM:SS bold + segunda linha "T+MM:SS" (offset desde `iniciadoEm`, mono)
- Ação: texto plain
- Tag colorido (se presente)
- Vazio: "Eventos vão aparecer aqui conforme você opera."

### Eventos disparados pelo código

| Evento | Tag | Onde | Texto exemplo |
|---|---|---|---|
| Início | `''` | `iniciarPCR` | "PCR iniciada" |
| Ciclo novo (auto) | `''` | `atualizarCardCompressoes` (auto-rotaciona) | "Ciclo 2 iniciado" |
| Ritmo selecionado | `''` | `setRitmo` | "Ritmo: FV" / "Ritmo: AESP" etc |
| Adrenalina aplicada | `'droga'` | `_registrarAdrenalina` | "Adrenalina ×1 · 1 mg IV/IO" |
| Choque aplicado | `'choque'` | `registrarChoque(true)` | "Choque 200 J · FV" / "Choque {round(peso×2)} J (2 J/kg) · FV" |
| RCE confirmado | `'rce'` | modal `confirmar-rce.acao` | "RCE confirmado · 2/3 critérios" |
| PCR pausada | `''` | modal `pausar.acao` | "PCR pausada" |
| PCR encerrada (stop) | `'critico'` | `encerrarSemRCE` | "PCR encerrada · Óbito declarado" / "PCR encerrada · Suspensa por decisão clínica" |
| Recidiva | `'marco'` ou `'critico'` | `registrarRecidiva` (marco) / `confirmarNovaPCR('recidiva')` (critico) | "RECIDIVA · nova parada" / "Recidiva · PCR retoma" |
| App background | `''` | modal `sair-modo-pcr.acao` | "App em background · cronômetro continua" |
| Evento Adicionar (Amio/Lido/Bic/IOT/Idiov/Torsades) | `'droga'` ou `''` | `aplicarEvento(key)` | "Amiodarona aplicada" / "Amiodarona aplicada · 2ª dose" |
| Evento Custom | `'droga'` | `abrirEventoCustomizado` submit → `aplicarEvento` | "{nome} · {dose}" se dose, senão `{nome}` |
| Nota livre | `''` | `addNotaLivre` (não exposto na UI atual?) | (texto livre) |

### Anti-double-tap adrenalina
Se < 30s desde última dose, modal `confirmarAcao` perigo abre antes: "Aplicar nova dose agora? · Última dose foi há Xs. Aplicar mesmo assim?" · "Aplicar" (botão perigo).

### Toast undo (R5 · single-tap + undo 5s)
Toda ação registrável (adrena, choque, ritmo, evento, nota) mostra push toast com botão "Desfazer" 5s. Undo reverte: pop evento, restaura contadores e timestamps anteriores, mostra "X desfeito" toast 3.5s sem undo.

---

## 10. Empty states e mensagens críticas

### Empty states
- **Histórico vazio:** "Nenhuma PCR registrada ainda" + CTA "Iniciar Modo PCR".
- **Linha do tempo vazia:** "Eventos vão aparecer aqui conforme você opera."
- **VCV adulto sem altura/sexo:** alert atenção "Preencha altura e sexo · O volume corrente protetor depende do peso predito (ARDSnet)."
- **Cargas pediátrico sem peso:** texto "Informe o peso na T1 pra cálculo automático." (legacy ref — peso agora vem em Cargas/T4)
- **Adrenalina sem referência (raro):** card vira idle, time `00:00`, meta "Aguardando início".

### Alertas críticos (TTS + visual)
- **30s antes do marco 2:00:** TTS "Trinta segundos. Prepare o desfibrilador." (1× por ciclo · flag `avisou30s`)
- **No marco:** TTS "Checar pulso e ritmo." (1× quando muda pra critico-marco)
- **Janela adrenalina aberta:** TTS "Janela de adrenalina aberta." (1× · flag `avisouAdrenJanela`)
- **Adrenalina atrasada:** TTS "Atenção. Adrenalina atrasada." (1× · flag `avisouAdrenAtrasada`)
- **Aplicou adrenalina:** TTS "Adrenalina aplicada."
- **Aplicou outra droga (FAB):** TTS "{nome} aplicada"
- **Choque administrado:** TTS "Choque administrado." + push "Choque registrado · Retome compressões · NÃO checar pulso agora."
- **Ritmo chocável (FV/TV):** TTS "Ritmo chocável."
- **Ritmo não-chocável (AESP/Assist):** TTS "Ritmo não chocável." + auto-modal `5h5t-resumo` em 250ms
- **RCE confirmado:** TTS "Retorno da circulação espontânea confirmado. Inicie os cuidados pós-parada." + `pararMetronomo()` + transition T3
- **PCR encerrada:** TTS "PCR encerrada"
- **PCR iniciada:** TTS "PCR iniciada. Inicie compressões." + `iniciarMetronomo()`
- **Áudio ligado:** TTS "Áudio ligado." + `iniciarMetronomo()`

### Banners
- **Banner pre-compressao** (amarelo) — operação normal "Mantenha compressões {BPM}/min"
- **Banner critico-marco** (vermelho, pulse) — 30s antes e durante marco
- **Banner pos-choque** (amarelo) — após registrar choque (mostrado via push toast, não banner persistente)
- **Banner pos-rce** (verde) — T3 fixo "Decúbito lateral · SpO₂ 90-98%"

### Mensagens LGPD (replicadas em vários lugares)
- T4 helper "LGPD: nunca substitui prontuário."
- Histórico empty: "Histórico salvo apenas neste aparelho. Não substitui prontuário oficial."
- Detalhe caso: idem.
- Modal `lgpd`: explícito.
- Anotação: "Apoio à memória deste caso. Não substitui prontuário (LGPD)."

---

## 11. Cenários dev (não-prod · simulação)

Painel `dev-panel` à direita (fora `.viewport`, escondido em prod via classe `.dev-panel`).

### Happy path
- **`cenarioFVChocavel()`** — 62a, 80 kg, T+0:30, ciclo 1, ritmo FV
- **`cenarioPosDesfibrilado()`** — chama FV + push choque 200J + evento retomada
- **`cenarioRCE()`** — chama FV + 2 adrenalinas + 1 choque + RCE em T3

### Cenários críticos
- **`cenarioAdrenalinaOverdue()`** — 5:30 sem nova dose, ciclo 3 (overdue + atrasado)
- **`cenarioAESP()`** — 75a, 70 kg, ritmo AESP, 1 adrenalina há 30s
- **`cenarioRecidiva()`** — chama RCE + após 300ms muda pra recidiva (ciclo++)
- **`cenarioPediatrico()`** — 5 anos, 18 kg, FV (testar cargas 2-4 J/kg)
- **`cenarioBundleCompleto()`** — 3 ciclos + 2 adrenalinas + 2 choques + 1 amiodarona (estado avançado, timeline cheia)
- **`cenarioStopObito()`** — bundle + encerrar com óbito declarado em T4

### Tempo
- **`pularTempoPCR(segundos)`** — adianta `iniciadoEm`, `cicloIniciadoEm`, `ultimaAdrenalinaEm` por N segundos.

### Reset
- **`resetarProtocoloPCR()`** — confirma + apaga `pcr_protocolo_atual` + `pcr_historico` + reload.

### Debug
- **`atualizarDebug()`** — render painel com Tela / Ritmo / Ciclo / Adren / RCE / Idade / Peso / BPM. Refresh setInterval 500ms.

---

## 12. Plano de build (incremental, paridade clínica)

> Mesmo molde do port-sepse-inventario · adaptado pra PCR.

1. **Scaffold:** `features/pcr/PCRFlow.jsx` + `hooks/usePCRState.js` compondo **ProtocolShell** (3 tabs, **SEM stepper** — fluxo não-linear) + **HistoryScreen** + **ACLSScreen** (custom · 3 sub-tabs).
2. **Por tela (T1→T2→T3→T4):**
   - Portar conteúdo HTML
   - Portar lógica do pcr.js **1:1** (timers, eventos, gates, TTS, undo toast)
   - Verificar lado-a-lado vs golden (timer 2 min · adrenalina 3-5 min · cargas J · doses mg · ritmos · RCE flow)
   - Sign-off clínico do Luis (ponto a ponto · drogas/cargas/janelas)
3. **Sub-cérebro `modo-pcr/`** — atualizar `00_status_atual.md` com `[PORT REACT]` ao terminar.
4. **Trocar iframe** em `App.jsx`/`protocols.js` **só após paridade total**. Golden fica de fallback.
5. **Anti-regressão:** rota temporária `?route=pcr-react` pra QA lado-a-lado, golden no card hub.

### Itens clínico-críticos pra paridade exata (NUNCA aproximar)
- ⚠️ Cálculo dose adrenalina pediátrico (`peso × 0.01`)
- ⚠️ Cálculo carga pediátrico 2/4/10 J/kg (`round(peso × 2/4/10)`)
- ⚠️ Cálculo amiodarona pediátrico (5 mg/kg = `round(peso × 5)`)
- ⚠️ Cálculo lidocaína adulto (1-1.5 mg/kg, max 3 mg/kg)
- ⚠️ Janela adrenalina parametrizada `[m-1, m+1]` minutos
- ⚠️ Auto-cicle 15s buffer após marco 2:00
- ⚠️ Anti-double-tap adrenalina < 30s (modal confirma)
- ⚠️ Peso predito ARDSnet (Devine): base 50/45.5 + 0.91×(altura-152.4)
- ⚠️ TET profundidade (diam×3 / alt/10+5 / 6+peso)
- ⚠️ Tabela VENT_PEDIATRIA (6 faixas etárias)
- ⚠️ Tabela TET_TAMANHO (6 faixas + cuff/sem cuff)

### Componentes DS necessários (mapeio prévio)

| Componente | Status DS | Uso PCR |
|---|---|---|
| **ProtocolShell** | ✅ existe (Sepse/CAD usam) | Wrapper 3-tabs |
| **AppHeader** com chips | ⚠️ existe mas chips dinâmicos por estado precisam variant | Header + chips ritmo/RCE/ciclo/adren |
| **TimerCard** (5 estados) | ✅ existe (`idle/running/cycle-end/window-ok/window-overdue`) | Compressões + Adrenalina |
| **BannerContextual** (4 tons) | ⚠️ provavelmente novo (banner-pre-compressao/critico-marco/pos-choque/pos-rce) | T2 banner dinâmico + T3 RCE |
| **SegmentedControl** | ✅ existe | BPM 100/110/120 inline · Intervalo adren 3/4/5 · Sub-tabs ACLS · Toggle Adulto/Pediatria |
| **EventList** (details/summary collapsible) | ⚠️ provavelmente novo molde | Linha do tempo T2 |
| **EventItem** (hora + ação + tag colorida) | ⚠️ novo molde com tags droga/choque/marco/rce | Itens da timeline |
| **ActionGrandeButton** (icon + label + sub) | ⚠️ próximo do `ActionTile` mas com sub | Selecionar ritmo / Desfibrilar T2 |
| **FAB** (floating action button) | ⚠️ provavelmente novo | Adicionar evento T2 |
| **BottomSheet** (header+body+footer) | ✅ existe (Sepse usa) | Todos os 29 modais |
| **DecisionCard** (titulo + sub · clicável) | ⚠️ usado em modais (encerrar-motivo-card / checar-pulso-opcoes / encerrar-motivos / nova-pcr) | Encerrar/Aplicar choque/Checar pulso/Nova PCR |
| **InfoSheet** (corpo + 1 botão) | ✅ existe | Modais info |
| **OptionCard** com tone | ✅ existe (5 tones) | Cuidados pós-PCR cards |
| **AlertCard** com slot | ✅ existe | Cargas e Doses cards · alertas T3 |
| **EventoCardNovo** (nome + dose + contador + [+]) | ⚠️ novo molde | Modal Adicionar Evento |
| **ChipsRow** (faixa-chips) | ✅ existe | Sexo / Desfecho / Filtros histórico |
| **InputField + Unit** (kg, cm, mm) | ✅ existe | T4 + Cargas peso + VCV altura + TET inputs |
| **HHTTPills** (5H 5T mnemônicos) | ⚠️ novo molde · letra colorida + termo | Modal hh-tt + 5h5t-resumo |
| **PanfletoPlaceholder** | ⚠️ novo · frame dashed cinza com label "será importado no Figma" | Modais algoritmo/cuidados/qualidade-rcp |
| **TETTabela** | ⚠️ novo · tabela 3-col responsiva | Modal via-aerea-tet-tamanho |
| **TimelineDetalhe** (caso histórico · bolas + linhas + offset) | ⚠️ novo molde (ver Sepse?) | Detalhe do caso · grupo timeline |
| **PushToast** (com Undo + Close) | ⚠️ provavelmente existe (Sepse?) ou novo | Toast undo R5 + toast info |
| **ConfirmarAcaoModal** | ⚠️ wrapper genérico | confirmarAcao (anti-double-tap, sair, excluir, reset) |
| **AnotacaoModal** | ⚠️ FB-05 cross-protocolo (Sepse tem?) | Anotação botão header |
| **HistoryEmptyState** + **HistoryItem** | ✅ existe (Sepse pattern) | Aba Histórico |
| **CasoDetalheGrupos** + **DetailRow/StatGrid** | ✅ existe | Detalhe modal: Caso · Desfecho · Operação |

---

## 13. APÊNDICE CLÍNICO — fórmulas/dados lidos do `pcr.js` 1:1 (referência de paridade)

### Constantes (linha 6-19)
```
STORAGE_KEY = 'pcr_protocolo_atual'
HISTORICO_KEY = 'pcr_historico'
CICLO_MS = 2 * 60 * 1000 = 120000  // 2 min exatos
ADRENALINA_JANELA_INICIO_MS = 180000  // 3 min (legacy retrocompat)
ADRENALINA_JANELA_FIM_MS = 300000     // 5 min (legacy retrocompat)
```

### Janela adrenalina parametrizada
```js
function getAdrenalinaJanela() {
  const m = estado.intervaloAdrenalinaMin || 3;
  return {
    inicioMs: Math.max(1, m - 1) * 60 * 1000,
    fimMs: (m + 1) * 60 * 1000,
  };
}
```
- Default m=3 → janela [120000, 240000] ms = 2:00–4:00
- m=4 → [180000, 300000] = 3:00–5:00
- m=5 → [240000, 360000] = 4:00–6:00

### Pediatria — cargas/doses (linha 612-697 `atualizarTeoriaCargasDoses`)
```
desfibPed = {
  dose1: round(peso * 2),
  dose2: round(peso * 4),
  doseMax: round(peso * 10),
}
adrenPed = (peso * 0.01).toFixed(2)
amioPed = round(peso * 5)
lidoPedAdulto = {
  d1: round(peso * 1),
  d2: round(peso * 1.5),
  dmax: round(peso * 3),
}
lidoPed = peso  // 1 mg/kg = peso mg
```

### Peso predito ARDSnet (linha 720)
```js
function calcularPesoPreditoARDSnet(altura, sexo) {
  const isFem = sexo === 'fem' || sexo === 'f';
  const base = isFem ? 45.5 : 50;
  return Math.round(base + 0.91 * (altura - 152.4));
}
```
- VC alvo (mL): 6×pp até 8×pp

### TET profundidade (linha 908-913)
```
profTubo = (diam_mm * 3).toFixed(1)
profAltura = (altura_cm / 10 + 5).toFixed(1)
profPeso = (6 + peso).toFixed(0)
```

### Auto-cicle (linha 416)
```js
if (elapsed >= CICLO_MS + 15000 && !estado.rce) { cicloAtual++; ... }
```

### Estado-da-arte de carga T2 (linha 992-996)
```js
if (idade != null && idade < 18 && peso) {
  cargaSub = `${round(peso * 2)} J · 2 J/kg`;
} else {
  cargaSub = '200 J · bifásico';
}
```

### Mapas de label
```js
ritmoLabels = { fv: 'FV', tv: 'TV s/p', aesp: 'AESP', assistolia: 'Assistolia', na: 'Não Avaliado' }
ritmoLabelsModal = { fv: 'FV · chocável', tv: 'TV sem pulso · chocável', aesp: 'AESP · não-chocável', assistolia: 'Assistolia · não-chocável', na: 'Não avaliado' }
DESFECHO_LABEL = { revertida: 'Revertida', 'nao-revertida': 'Não revertida', obito: 'Óbito', suspensa: 'Suspensa' }
```

### Estrutura caso salvo no histórico
```js
{
  iniciais, data: ISO,
  duracaoMs, idade, idadeMeses, peso, altura, sexo,
  desfecho, ritmoFinal, adrenalinaCount, ciclos,
  obs, eventos: snapshot,
  anonimo: boolean,
}
```

### Side-by-side (QA sem trocar iframe)
Rota React temporária `?route=pcr-react` → `<PCRFlow/>`; o card `pcr` do hub continua no iframe golden até **sign-off de paridade**. Só então troca em `App.jsx`/`protocols.js` (golden vira fallback).

---

## 14. Voz e princípios (cérebro `modo-pcr/`)

- **Manual de aviação.** Imperativo. Plain language clínico. Sem floreio. Sem ambiguidade.
- **Voz combate** no app (curta · direta). Voz consultiva nos docs.
- **Persistência radical:** info não some sozinha. Toast undo OK, mas timeline e cards persistem.
- **Zero ornamentação:** glassmorphism, blur, sombra decorativa, animação distrativa MORTOS.
- **Contraste APCA + WCAG AAA.**
- **Touch target ≥ 48-52dp.**
- **Cronômetro tabular ≥ 32px** (refinar com tnum no React).
- **Vocabulário canônico:** RCE (não ROSC), Adrena (informal), Compressões, ACLS|AHA, Chocável/Não-chocável, FV/TV/AESP/Assistolia, Modo PCR, Marco, Ciclo.
- **Sem emoji** em UI (apenas em prints de cérebro em raríssimo caso).
- **Sem travessão "—"** em conteúdo do cliente (usar "·" como separador).
