# QA comportamental do protótipo — 2026-06-04

> Varredura de QA dirigida por browser (Playwright/Chromium headless, mobile 390×740),
> dividida em 5 agentes (Home+Hub, SCA, CAD, PCR, AVC+Sepse) + 1 crawler automático de
> cliques mortos. Foco: **comportamento** (cliques que não funcionam, fluxos que travam,
> cálculos, validação, persistência), não estética.
>
> **Resultado geral:** nenhum crash, **zero erros de console** em todos os fluxos, e os
> **cálculos clínicos conferidos estão corretos** (doses, escores, tempos). Os problemas
> são de *wiring* (UI sem handler), *validação de entrada*, *formatação PT-BR* e *gating*.

---

## Temas transversais (afetam vários fluxos)

| # | Tema | Onde | Severidade |
|---|------|------|------------|
| T1 | **`RadioGroup`/`ScoreCriterionGroup` não passam `value` ao `Radio`** → todo `<input radio>` sai com `value="on"`. Funciona no React (onChange pega o certo), mas quebra FormData/a11y/testes. | `RadioGroup.jsx`, `ScoreCriterionGroup.jsx` | Alto (estrutural) |
| T2 | **Sem validação de faixa nos campos numéricos** → aceita idade 999, peso negativo, etc. Gera dose/volume negativos (ex.: Sepse cristaloide **−1.500 mL**, SCA dose TNK com peso −50). AVC já trata (“Valor fora da faixa”). | SCA, CAD (parcial), Sepse | Alto (risco clínico) |
| T3 | **Formatação PT-BR inconsistente (ponto vs vírgula)** → “144**.**5”, “8**.**0”; e o `<input type=number>` **descarta vírgula** silenciosamente (campo insulina não pré-preenche). | CAD | Alto |
| T4 | **Ferramentas de dev expostas no build de produção** → DevPanel (já ajustado p/ recolhido) e botões “Pular 5 min (dev)” no CAD. | CAD, DevPanel | Médio (decisão) |
| T5 | **Radio nativo não “desmarca” ao reclicar** → a lógica de toggle (zerar item SOFA/NEWS/MEWS) nunca dispara. | Sepse (e qualquer score com toggle) | Médio |
| T6 | **Gating ausente em passos críticos** → avança sem dado obrigatório (SCA T3/T4 sem escore/troponina/antiagregante; Sepse). Pode ser “flexível by-design”, mas é risco clínico. | SCA, Sepse | Alto (risco) / decisão |
| T7 | **Stepper sem feedback** ao tocar passo futuro desabilitado (silêncio total). | SCA, CAD | Baixo |

---

## Home + Hub

**Crítico**
- **Abas “Adulto/Pediatra” na Home não fazem nada.** Botões sem `onClick`; `aria-selected` hardcoded em “Adulto”; `pediatric_mode` nunca muda. A infra existe (funciona no Hub), mas a Home não conecta. A prop `isPediatricMode` nem é passada ao `<Home>` em `App.jsx:62`. → `Home.jsx:105–111`.

**Alto**
- **Rotas duplicadas Hub × Home.** Hub abre PCR/Sepse/AVC pelo **iframe legado** (`/golden/.../*.html`); a Home abre as versões **React** (`pcr-react`/`sepse-react`/`avc-react`). O cutover foi só na Home. → `data/protocols.js`.
- **Barra inferior da Home (Início/Busca/Escala/IA/Menu): os 5 botões sem handler.** → `Home.jsx:228–239`.

**Médio**
- “Notificações” (sino) sem handler → `Home.jsx:99`.
- “Ver todas as 15 urgências” sem ação → `Home.jsx:206`.
- Cards da grade de urgências (IOT/CAD/ANA/CCV/HPG/TAQ) são `<div>` sem `onClick`; dados sem campo `route` → `Home.jsx:52–68`.
- Headers de categoria (Diluições/Calculadoras/Fluxogramas/Escores/Conversores) não clicáveis → `Home.jsx:213–225`.

**Baixo / cosmético**
- “Ver todos” (Meu Plantão) é `<span>` puro → `Home.jsx:157`.
- Ícone do toggle de tema fixo em “sol” (não vira lua) → `Home.jsx:97`.

**OK:** chips “Iniciar agora” navegam; tema claro/escuro persiste; Hub (5 protocolos + toggle pediatria) OK; botão voltar OK; **0 erros de console**.

---

## SCA

**Alto**
- **`value="on"`** em todos os radios (tema T1).
- **Sem validação de faixa**: idade 999, peso −50 aceitos; dose TNK calcularia com peso negativo (tema T2).
- **T3 (Estratificar) avança sem escore/troponina** (banner “Pendente” aparece mas não bloqueia). Risco clínico / possivelmente by-design.

**Médio**
- **T4 (Conduzir) avança sem antiagregante P2Y12.**
- Stepper pode ser forçado via `localStorage` (esperado em protótipo).
- `OptionCard` seleciona via `data-selected` (sem troca de classe) — diverge dos cards do RadioGroup; inconsistência p/ testes.

**Baixo**
- Sheet de Teoria usa “Entendi” vs “Fechar” (inconsistência de rótulo).
- Stepper sem feedback ao tocar passo futuro.

**OK:** progressão T1→T5, gates T1/T2 (idade/peso/queixa; ECG/STEMI/OMI), sheets (abrir/fechar/backdrop), persistência, **0 erros**.

---

## CAD

**Alto**
- **Campo “Insulina rodando agora” não pré-preenche** na reavaliação: `fmtNum` retorna “7,0” e o `<input type=number>` descarta a vírgula → vazio. → `CADFlow.jsx:166`.
- **Sódio corrigido com ponto** (“144.5”) → `cadData.js:160` (`toFixed(1)` sem `.replace('.',',')`).
- **Dose de insulina T3 com ponto** (“8.0 U/h”) → `cadData.js:207` (usar `fmtNum`).

**Médio**
- **Botão “Pular 5 min (dev)” em produção** (T2k/T3/T4) — adultera timers clínicos (tema T4).
- **Checkbox de resolução HCO₃ (T5) não auto-marca** em certa ordem de lançamento (`seedResolucao` roda 1× e não há update reativo p/ hco3).
- Recomendação de ajuste de insulina usa valor que está invisível no campo (consequência do bug acima).

**Baixo**
- Stepper futuro não navega (by-design, confirmado).
- Stepper “!” em passo incompleto sem tooltip.

**OK (conferido):** soro inicial reativo, gate de potássio (<3,5 bloqueia insulina), aguardo KCl 2h, modo pediátrico por idade, bloqueio 1h pós-fluidos, dose insulina por peso (80kg→8,0), ânion gap, alertas (hipo/implausível), persistência. **Cálculos corretos, sem NaN/crash, 0 erros.**

---

## PCR

**Médio**
- **Card “Adrenalina ATRASADA” pode ficar abaixo do fold/atrás do footer** quando o ciclo bate o marco (`cycle-end`) e a adrenalina atrasa ao mesmo tempo — exatamente o pior momento.
- **Banner “Ciclo 1 · 0s desde o início”** aparece antes de iniciar compressões (deveria ser null/diferente). → `PCRFlow.jsx:~405`.

**Baixo / Info**
- Marcadores “3 min/4 min” persistem na barra mesmo em estado overdue (visual redundante).
- Fluxogramas da aba ACLS|AHA são `PanfletoPlaceholder` (feature prevista como incompleta).

**OK:** iniciar/cronômetro, ciclos de 2 min, “Avançar/Reiniciar” (DevPanel), ritmo chocável×não-chocável, registrar choque, adrenalina (contador ×N + timer + anti-double-tap), FAB (drogas/procedimentos), áudio toggle, Histórico, ACLS|AHA (sub-abas), troca de abas preserva caso, **persistência ao recarregar**, **0 erros**.

---

## AVC

**Médio**
- **Janela >24h inacessível pelo input HH:MM**: `janelaMinDe` subtrai 24h p/ horário “futuro”, então o máximo representável é ~23h59 → o alerta “Fora de janela aguda (>24h)” nunca renderiza. → `avcData.js`.

**Baixo**
- Horário inválido “25:99” aceito silenciosamente (janela “—”, sem mensagem de erro).

**OK (conferido):** NIHSS soma certa (15 domínios), **doses TNK/Alteplase corretas com cap** (TNK 110kg=25mg; Alteplase 110kg=90mg), peso 0/negativo → “Valor fora da faixa”, elegibilidade (DOAC/PA≥185/110), janela <4,5h / estendida / só-trombectomia, gate Cincinnati, monitor de PA com validação, persistência, **0 erros**.

---

## Sepse

**Médio**
- **Toggle-deselect SOFA/NEWS/MEWS não funciona** (radio nativo não dispara onChange ao reclicar) → não dá pra zerar um item isolado. → `useSepseState.js:126` (lógica existe, mas nunca é acionada). Tema T5.
- **Peso negativo → volume de cristaloide negativo** (“−1.500 mL”) → `sepseData.js:404` sem guard `>0`. Tema T2.
- **T3 (ATB) fica inacessível pelo footer** quando ATB já foi marcado em T2 (atalho “Vasopressores” pula T3 e o step “ATB/Vaso” fica disabled). → `SepseFlow.jsx:825–828`.

**OK (conferido):** SOFA/NEWS somam certo, gate T1 (precisa score>0 + veredito), volume cristaloide (peso normal = 2.100 mL), noradrenalina (fórmula + escalação Vaso/Adrena+Hidro), MRSA/MDR gating, ATB re-registro com ConfirmSheet, progresso do bundle, persistência, **0 erros**.

---

## ✅ Status — corrigido em 2026-06-04 (P0+P1+P2)

Dono optou por **corrigir tudo** com postura **bloquear + validar faixa**. Implementado e
verificado (build + Playwright + crawler de regressão = 0 erros de console). Commits:
`4301525` (radio value/deselect), `27b534a` (Home/Hub), `39a613e` (CAD), `3e94e80` (SCA),
`9804da4` (Sepse), `7d906dd` (AVC), `1842cdd` (PCR).

- ✅ Radio `value` + deselect de escore (T1, T5).
- ✅ Validação de faixa idade/peso + bloqueio (SCA/CAD/Sepse/AVC); sem dose/volume negativos (T2).
- ✅ Formatação PT-BR + pré-preenche insulina + HCO₃ T5 (CAD · T3).
- ✅ Gating SCA T3 (escore+troponina) e T4 (P2Y12) (T6).
- ✅ Home: abas Adulto/Pediatra, barra inferior e cards (navegam ou “Em breve”); Hub→React.
- ✅ Sepse: T3 (ATB) acessível pelo stepper.
- ✅ PCR: banner “0s” e card de adrenalina atrasada visível.
- ✅ AVC: janela >24h (seletor de dia) + horário inválido com erro.
- ↔ Ferramentas de dev (DevPanel + “Pular 5 min” CAD): **mantidas** no deploy p/ teste (decisão).

> Pendências menores remanescentes (cosméticas / falsos-positivos do harness): rótulo
> “Entendi vs Fechar” em sheet de Teoria SCA; tooltip de passo desabilitado no stepper.

---

## Backlog priorizado de correções (proposta original)

**P0 — bugs claros, baixo risco, alto valor (corrigir já):**
1. Passar `value={opt.value}` em `RadioGroup` e `ScoreCriterionGroup` (T1).
2. CAD: formatar com `fmtNum` o sódio corrigido e a dose de insulina; corrigir pré-preenchimento do campo insulina (ponto/vírgula) (T3).
3. Guardas `>0` em peso/idade nos cálculos que geram dose/volume (impede negativos) (T2).
4. Home: ligar as abas **Adulto/Pediatra** ao `pediatric_mode` (crítico).

**P1 — comportamento/UX (provável fix):**
5. Home: barra inferior e botões (Notificações/Ver todas/cards de urgência) — ligar ou marcar como “em breve” explicitamente.
6. Sepse: permitir desmarcar item de score (toggle) e bloquear volume com peso inválido.
7. Sepse: acesso à T3 (ATB) pelo stepper quando pulada.
8. PCR: garantir que o card de adrenalina atrasada fique visível (layout) + banner “0s”.

**P2 — decisões de produto (precisa sua diretriz):**
9. Gating de obrigatórios (SCA T3/T4, Sepse): bloquear ou só alertar? (risco clínico × fluxo flexível)
10. Validação de faixa clínica (idade ≤130, peso plausível): bloquear, alertar ou aceitar?
11. Rotas duplicadas Hub (legado) × Home (React): unificar tudo no React?
12. Ferramentas de dev (DevPanel + “Pular 5 min”) no deploy: manter p/ teste ou esconder em produção?
13. AVC: representar janela >24h; horário inválido com mensagem.

> Itens marcados “OK” foram exercitados e confirmados funcionando. Screenshots e scripts
> de teste ficaram em `_qa/` e `/tmp/qa-*.png` (efêmeros, gitignored).
