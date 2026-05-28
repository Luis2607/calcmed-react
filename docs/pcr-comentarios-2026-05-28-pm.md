# PCR — Comentários Luis + Gustavo (2026-05-28 PM)

> ⚠️ **Estes comentários têm PRIORIDADE sobre o golden capturado em `port-pcr-inventario.md`.** Gustavo é a fonte clínica final. Quando houver conflito golden vs estes comentários, **estes comentários vencem**. Atualizar inventário com nota "⚠️ MUDANÇA POST-CAPTURA".

---

## A · Comentários Luis (refinamentos pontuais)

### A1 · T3 (RCE) cuidado 1 · STEMI → SCA
**Onde:** lista de 5 cuidados pós-RCE, primeiro item.
**Antes:** "Crítico · ECG 12 derivações · 'Identificar **STEMI**. Cateterismo urgente se infarto.'"
**Depois:** "Crítico · ECG 12 derivações · 'Identificar **SCA**. Cateterismo urgente se infarto.'"
**Por quê:** SCA (Síndrome Coronariana Aguda) é o termo genérico que inclui STEMI/NSTEMI/angina instável. Cobre mais casos.

### A2 · Trocar todas as "NE" por "Nora" (cross-protocolo)
**Onde:** PCR T3 cuidado 4 (Volume e vasopressor) menciona "NE 0,01-1 mcg/kg/min". Possivelmente outros lugares em PCR ACLS|AHA Doses + Sepse residual.
**Antes:** "NE"
**Depois:** "Nora"
**Por quê:** termo popular, consistente com decisão Sepse anterior.
**Ação:** grep cross-protocolo + replace.

### A3 · T3 cuidado 5 · TTM → CDT
**Onde:** lista de 5 cuidados pós-RCE, último item.
**Antes:** "Info · **TTM 32-36 °C** por 24h · 'Controle térmico se paciente inconsciente.'"
**Depois:** "Info · **CDT 32-37,5 °C** por 24h · 'Controle térmico se paciente inconsciente.'"
**Por quê:** AHA 2024+ atualizou de TTM (Targeted Temperature Management) pra CDT (Controle de Temperatura Dirigido). Faixa também atualizada (37,5 substitui 36).

### A4 · T3 cuidado 2 · Remover "ETCO₂ ≥ 10 mmHg sustentado"
**Onde:** lista de 5 cuidados pós-RCE, cuidado #2.
**Antes:** "Atenção · Estabilizar via aérea · 'Confirmar IOT com capnografia. **ETCO₂ ≥ 10 mmHg sustentado.**'"
**Depois:** "Atenção · Estabilizar via aérea · 'Confirmar IOT com capnografia.'"
**Por quê:** Luis pediu remover. Possivelmente ETCO₂ ≥ 10 já é critério de RCE (no `confirmar-rce`), não cuidado pós.

### A5 · T4 Salvar · Remover campo altura
**Onde:** form T4 Salvar Paciente.
**Antes:** Linha "Peso/Altura" (2-cols): peso kg + altura cm.
**Depois:** SÓ peso kg (full-width OU 2-cols com algo no lugar de altura · decisão pendente).
**Por quê:** altura não é usada no flow PCR (só pra peso predito ARDSnet em VCV adulto, e nem todo caso usa).
**Decisão:** remover linha. Se VCV adulto precisar de altura, pede na hora (modal).

### A6 · Histórico · Adicionar campo "Início"
**Onde:** cada item da lista histórico.
**Antes:** top: iniciais bold + data (DD/MM · HH:MM) · meta: desfecho · duração · adren ×N · tag "Concluído".
**Depois:** acrescentar campo "Início" (timestamp `iniciadoEm` formatado DD/MM HH:MM:SS).
**Por quê:** distinção "início" vs "encerramento" pra rastreio temporal.
**Layout:** topo: iniciais + Início (HH:MM:SS) · meta: desfecho · duração · adren ×N · data encerramento.

### A7 · ACLS|AHA sub-tab 1 · "Panfletos" → "Fluxogramas"
**Onde:** sub-tab 1 da aba ACLS|AHA.
**Antes:** "Panfletos"
**Depois:** "Fluxogramas"
**Por quê:** "Panfletos" sugere material impresso de divulgação. "Fluxogramas" é termo médico técnico correto (algoritmo visual).

---

## B · Comentários Gustavo (mudanças clínicas profundas)

### B1 · ⚠️ Ícone por ritmo (FV, TV, AESP, Assistolia)
**Onde:**
- Botão "Selecionar ritmo" T2 (atualmente só ícone coração).
- Modal `selecionar-ritmo` (5 opções).
- Chip header `chip-ritmo`.
- Card desfibrilar (estado dinâmico).

**Antes:** ícone genérico de coração + label texto.
**Depois:** **cada ritmo tem seu ícone próprio** (visual reconhecível em 1 olhada).

**Decisão de design:** 5 ícones novos, com referência visual ao traçado do ritmo:
- FV (Fibrilação Ventricular) → traçado caótico irregular
- TV (Taquicardia Ventricular sem pulso) → traçado largo, monomórfico
- AESP (Atv Elétrica Sem Pulso) → traçado QRS estreito, sem pulso (ícone sutil de coração com "sem batimento")
- Assistolia → linha reta (flat-line)
- Não Avaliado → ícone "?" ou interrogação

**Riscos:** ícones precisam ser desenhados (Figma) ou usados via SVG inline. Não há ainda no DS.
**Ação:** marcar como tarefa F-PCR-DESIGN — solicitar ícones do Gustavo OU desenhar inline SVG simples até substituição final.

### B2 · ⚠️ Botão "Checar ritmo/pulso" SEMPRE visível DESDE T1
**Onde:** T1 (idle) atualmente só tem botão "Iniciar PCR" no rodapé. T2 tem "Selecionar ritmo" como botão grande.
**Antes:** "Selecionar ritmo" só aparece em T2.
**Depois:** botão "Checar ritmo/pulso" presente DESDE T1, disponível a qualquer momento.
**Por quê:** Gustavo: médico pode chegar e querer checar antes de iniciar formal o caso (avaliar se há PCR mesmo).

**Decisão de fluxo:**
- T1: botões rodapé Sair + Iniciar PCR · **acrescentar 3º botão "Checar ritmo/pulso"** (variant secondary?).
- T2: mantém "Selecionar ritmo" como botão grande.
- Click em T1 → abre modal `checar-pulso-ritmo` (gate D41 que decide RCE vs ritmo).

**Riscos:** mexe na T1 que era simples (2 botões → 3). Layout precisa caber.

### B3 · ⚠️ Compressão inicia após tap "Iniciar PCR" (confirmar)
**Onde:** T1 → T2.
**Antes (golden):** `iniciarPCR()` já seta `iniciadoEm = Date.now()` e `cicloIniciadoEm = Date.now()` ao clicar.
**Depois:** confirmar comportamento idêntico — NÃO iniciar timer no app abrir; só no tap explícito.

**Status:** ✅ comportamento já é assim no golden. Documentar pra dev não regredir.

### B4 · ⚠️⚠️ CRÍTICO · Timers NÃO reiniciam automaticamente
**Onde:** T2 ciclo compressões + ciclo adrenalina.
**Antes (golden):** auto-cicle após `elapsed ≥ CICLO_MS + 15000` (rotaciona pro próximo ciclo automaticamente após 2:15 min).
**Depois:** **NUNCA auto-rotaciona.** Timer continua avançando indefinidamente até **ação manual** (Checar pulso/ritmo / Aplicar adrenalina / etc).

**Por quê:** Gustavo: médico tem que **DECIDIR ATIVAMENTE** quando o ciclo terminou. Auto-rotaciona = perde controle, confusão de ciclo.

**Impacto técnico:**
- Remove a lógica `if (elapsed >= CICLO_MS + 15000 && !rce) { cicloAtual++; cicloIniciadoEm = Date.now(); ... }`.
- `cicloAtual` só incrementa em **eventos manuais** (Checar pulso/ritmo confirmado · Aplicar adrenalina · Aplicar choque · etc).
- Timer compressões continua avançando MAS card vira `pcr-card-cycle-end` (vermelho) após marco 2:00 e fica assim até ação.
- Banner critico-marco persiste até ação.

**Componentes afetados:** TimerCard 5 estados (mantém `cycle-end` mas SEM auto-reset), useState do ciclo, atualizarCardCompressoes.

### B5 · Linha do tempo na Home (parte inferior)
**Onde:** Home (hub principal CalcMed) — não-PCR.
**Antes:** sem timeline na home.
**Depois:** acrescentar linha do tempo na parte inferior da Home mostrando atividade de todos os protocolos abertos/recentes.

**Status:** **FORA do escopo PCR direto.** Anotar como nova tarefa Home, executar pós-PCR.

### B6 · ⚠️⚠️ CRÍTICO · Adrenalina EXATO no tempo (não janela [m-1, m+1])
**Onde:** Card Adrenalina T2.
**Antes (golden):**
```js
function getAdrenalinaJanela() {
  const m = estado.intervaloAdrenalinaMin || 3; // 3/4/5 min
  return {
    inicioMs: Math.max(1, m - 1) * 60 * 1000,    // m-1 min
    fimMs:    (m + 1) * 60 * 1000,                // m+1 min
  };
}
```
Janela 2-4 min (default m=3) → autoriza A PARTIR DE 2 minutos.

**Depois:** **EXATO no tempo selecionado.** Se m=3, autoriza só a partir dos 3:00. Antes disso, fica `window-pre`.
**Por quê:** Gustavo: "hoje com 2 minutos ele autoriza, não pode". Adrenalina deve respeitar EXATAMENTE o intervalo escolhido (3/4/5 min).

**Impacto técnico:**
- Novo:
  ```js
  function getAdrenalinaJanela() {
    const m = estado.intervaloAdrenalinaMin || 3;
    return {
      inicioMs: m * 60 * 1000,           // EXATO no tempo selecionado
      fimMs:    (m + 1) * 60 * 1000,      // overdue após +1 min de tolerância
    };
  }
  ```
- Card `window-pre` até m min · `window-ok` entre m e m+1 min · `window-overdue` após m+1.
- Card-fill bar atualizada pra refletir essa janela mais estreita.
- TTS "Janela aberta" dispara EXATO em m min (não em m-1).

### B7 · ⚠️ Timers só resetam após ação (reforço B4)
Confirmação do B4: todo timer/ciclo só zera/incrementa por **ação manual explícita do médico**. Sem timeout, sem auto.

**Ações que resetam timers:**
- **Checar pulso/ritmo (modal `checar-pulso-ritmo`)** confirmado → reset ciclo compressões + incrementa cicloAtual + reset flag avisou30s.
- **Aplicar adrenalina** → reset timer adrenalina (`ultimaAdrenalinaEm = Date.now()`) + adrenalinaCount++.
- **Aplicar choque** → registra evento, NÃO reseta timer compressões (paradoxal: dev junior podia achar que choque reset ciclo).
- **RCE confirmado** → pararMetronomo + irParaTela(3) + para todos os timers.
- **Recidiva** → reset cicloAtual++ + cicloIniciadoEm = Date.now().
- **Encerrar PCR** → para tudo.

---

## C · Impacto no inventário e plano

### Atualizações no `port-pcr-inventario.md`:
- [ ] Seção 2 estado · adicionar nota: "⚠️ B4/B7: cicloAtual e cicloIniciadoEm só mutam por ação."
- [ ] Seção 2 cronômetros · remover lógica auto-cicle.
- [ ] Seção 2 janela adrenalina · atualizar fórmula (m até m+1, exato).
- [ ] Seção 3 T1 · adicionar 3º botão rodapé "Checar ritmo/pulso".
- [ ] Seção 3 T3 cuidados · A1 (SCA), A3 (CDT), A4 (sem ETCO₂), A2 (Nora).
- [ ] Seção 3 T4 · A5 (sem altura).
- [ ] Seção 4 modais · `selecionar-ritmo` ganha ícones B1.
- [ ] Seção 5 ciclos · remover "+15s buffer auto-rotaciona".
- [ ] Seção 5 adrenalina · atualizar fórmula B6.
- [ ] Seção 7 histórico · A6 (campo Início).
- [ ] Seção 8 ACLS|AHA · A7 (Fluxogramas em vez de Panfletos).

### Atualizações no `port-pcr-plano-migracao.md`:
- [ ] Step 3.3 (T2-B Adrenalina) · janela EXATA (B6).
- [ ] Step 3.4 (T2-C Cycle-end) · SEM auto-reset (B4/B7) · card vira cycle-end e fica assim.
- [ ] Step 3.5 (T2-D Ritmo) · ícones por ritmo (B1) · checar pulso desde T1 (B2).
- [ ] Step 3.8 (T3 Pós-RCE) · 4 fixes (A1/A2/A3/A4).
- [ ] Step 3.9 (T4) · sem altura (A5).
- [ ] Step 3.10 (Histórico) · campo Início (A6).
- [ ] Step 3.11 (ACLS|AHA) · Fluxogramas (A7).
- [ ] Riscos: atualizar Risco 1 (era "janela parametrizada", agora "exato no tempo") + Risco 4 (era "buffer 15s", agora "remover auto-reset").

### Pendência design (ícones):
- 5 ícones SVG inline pra ritmos (FV/TV/AESP/Assistolia/NA). Decisão imediata: começar com placeholders SVG simples; substituir por ícones definitivos quando Gustavo entregar OU desenharmos em Figma.

---

## D · Itens não-aplicados imediatamente (fora escopo)

- B5 (Linha do tempo Home) → pós-PCR · sub-tarefa Home.

---

## E · F01–F14 (vídeo Gustavo 2026-05-27) — aplicação no React

> Lote SEGUINTE de feedback (vídeo de revisão do protótipo `?route=pcr-react`). Fonte canônica: `wiki/decisoes/2026-05-27-pcr-feedback-gustavo-video-prototipo.md`. Aplicado em 6 microsteps (lint + build verdes cada · token-only · ajuste em nível de componente DS).

| # | Item | Estado | Commit |
|---|---|---|---|
| F01 | Botão Iniciar pulsante (urgência visual) | ✅ Feito (MS-4) | de348f4 |
| F02 | Ícone após iniciar | ✅ OK (não-bloqueador) | — |
| F03 | Notif adulto×pediatria | 🔒 Bloqueado (Guilherme) | — |
| F04 | Timer ciclo só após ação explícita | ✅ Feito (MS-2) | fa48887 |
| F05 | Label "Checar Ritmo/Pulso" | ✅ Feito | — |
| F06 | Adrenalina padrão 3 min / mín 3 | ✅ Feito (prévio · B6) | — |
| F07 | 1ª adrenalina zerada | ✅ Feito (MS-1) | fa48887 |
| F08 | Linha do tempo · horário dispositivo | ✅ Feito (EventList) | — |
| F09 | Alerta 30s antes do ciclo | ✅ Feito (sugestão >30s não aplicada) | — |
| F10 | Timer ciclo não para na checagem | ✅ Feito (B4/B7) | — |
| F11 | Fluxo ramificação ritmo (seleção direta) | ✅ Feito (MS-3) | bd3d611 |
| F12 | Notif antecipada próx. medicação | ✅ Feito parcial (casos ACLS · MS-5) | 19c8dd2 |
| F13 | Adrenalina atrasada · timer cresce | ✅ Feito (window-overdue) | — |
| F14 | RCE gatilho ritmo organizado + pulso | ✅ Feito (MS-3) | bd3d611 |

**MS-5 / F12 — escopo aplicado (casos ACLS óbvios):**
- Amiodarona 300 mg após o 3º choque (FV/TV refratária) — banner `warning` derivado, visível 30s + TTS.
- "Prepare adrenalina 1 mg" 30s antes da janela de adrenalina abrir — banner derivado + TTS.
- Banner DERIVADO (sem setState/timer; auto-some pela janela de tempo). `choqueCount` derivado da timeline (tag `choque`, undo-consistente). Voz 1×/marco via flags anti-spam (`avisouAmiodarona`/`avisouAdrenPreparar`), gated por `audioOn`.
- Demais notificações (2ª dose amiodarona 150 mg, lidocaína, mapa por ritmo/tempo adulto×pediatria) marcadas `// TODO F03 Guilherme` em `PCRFlow.jsx`.

**Verificação live (`?route=pcr-react`):** banner amiodarona pós-3º-choque (screenshot + DOM) · banner adrenalina pré-janela (DOM) · F13 "ATRASADA" com timer crescente · F06 segmented 3/4/5 min · F09 banner crítico-marco. Lint + build verdes por microstep.

**Pendente (desbloqueia F03 + completa F12):** mapa de notificações do Guilherme (adulto + pediatria, momentos de disparo).
