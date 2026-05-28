# Port Sepse — inventário de captura (golden → React)

> Gate de zero-perda (plano A4 #2). Lido do golden `calcmed/src/protocolos/sepse/{sepse.html, sepse.js, sepse.css}`,
> **aprovado pelo Gustavo + equipe** (2026-05-27). Estrutura (HTML) capturada 1:1 aqui; a **lógica clínica
> (sepse.js)** é extraída por tela ao construir, com paridade conferida lado-a-lado vs golden ANTES de trocar
> o iframe (A7 — nunca aproximar dose/escore). Mapeia cada peça → componente/template do DS já pronto.

## Shell (= ProtocolShell)
- 3 abas: **Executar / Histórico / Teoria** (3ª título "Consulta rápida").
- Stepper 5: **Triagem · 1ª hora · ATB · Vaso · Metas** (linear, `irParaTela(n)`).
- Header: domain `sepse` · título "Modo Sepse" · "Aberto há HH:MM" · ações Anotar/Sair · chips (idade/peso quando informados).
- Histórico = **HistoryScreen** (cabeçalho + busca + empty "Sem casos" + lista + LGPD).
- Teoria = **TheoryScreen** "Consulta rápida" + `teoria-card`s (SOFA/Sepsis-3, ...) = **DisclosureCard**.

## T1 · Triagem (SOFA) → StepHeader + score subsystem + OptionCard/Radio + AlertCard
- **score-tabs** (SIRS · NEWS · MEWS · SOFA) → **Segmented** (sub-tabs de score) + descritor roxo (muda por tab) → AlertCard info.
- **SIRS**: 4 checks (temp / FC>90 / FR>20 / leuco) → contagem (≥2). [CheckboxGroup]
- **NEWS**: select versão (NEWS2/NEWS) + 7 cards expansíveis (param→pontos). [ScoreCriterionGroup/colapsável]
- **MEWS**: 5 cards expansíveis. [idem]
- **SOFA**: 6 cards colapsáveis (sistemas → pontos; ≥2 = disfunção). [ScoreCriterionGroup — existe]
- **score-result** (num + label "Total: X pontos" + risco) → **ScoreResult** (existe).
- **Alerta universal** "Sepse é diagnóstico clínico" (crítico) → AlertCard.
- **Veredito clínico** (4 radios: definida/provável/possível/improvável) → RadioGroup (card) ou OptionCard.
- Modais (info-btn): `o-que-e-sepse`, `descritor-sirs/news/mews/sofa`, `o-que-e-classificacao`.
- **Gate:** `btn-iniciar-bundle` disabled até ter escore + veredito.
- **Lógica (sepse.js):** calcularSIRS/NEWS/MEWS/SOFA (thresholds por critério), risco do score, veredito.

## T2 · Bundle 1ª hora → StepHeader + InputField + Toggle + ChecklistBlock + StatGrid + AlertCard
- **paciente-grid**: Idade (anos; ≥65 muda alvo PAM 60-65) + Peso (kg). [InputField]
- **IMC ≥ 30** toggle → revela Sexo (Segmented masc/fem) + Altura → **peso ajustado** (calc). 
- **ATB realizado** (botão registra hora) [timer/log].
- **Grupo 1ª LINHA** (tag crítico, contador 0/4): hemocultura · lactato · atb · cristaloide (expandível → volume 30 mL/kg, alerta "individualizar"). [ChecklistBlock + DisclosureCard p/ cristaloide]
- **Grupo ACOMPANHAMENTO** (contador 0/5): vasopressor (PAM≥65) · reavaliar lactato 2-4h · procalcitonina · foco · hidrocortisona. + alerts info/atenção embutidos.
- **progress-meta** 0/9 (%). [progress bar]
- Modais: `o-que-e-primeira-hora`, `o-que-e-acompanhamento`.
- **Lógica:** idade→alvo PAM; peso/IMC→peso ajustado→volume cristaloide (30 mL/kg); contadores; progresso global.

## T3 · Antibioticoterapia → StepHeader + OptionCard(foco) + CheckboxGroup(risco) + ClinicalCard(drug)
- **Foco infeccioso** (6 cards radio: PAC/urinário/abdominal/SNC/pele/desconhecido). [OptionCard single-select OU foco-card]
- **Risco MRSA** (5 checks, contador 0/5; aparece após foco) + **Risco MDR** (5 checks 0/5). [CheckboxGroup]
- **Esquema empírico** (aparece após foco): drug-padrão (por foco) + drug-mrsa (+Vancomicina) + drug-mdr (+Pip-tazo), condicionais. [ClinicalCard/drug-card] + De-escalonamento + nota CCIH (alerts).
- Modais: `o-que-e-atb/mrsa/mdr`. **Gate:** `btn-atb-prox` disabled até foco.
- **Lógica:** foco→esquema-padrão (mapa de drogas/doses por foco); MRSA risk→+Vanco; MDR risk→+Pip-tazo.

## T4 · Vasopressores → StepHeader + drug-cards ativáveis + InputField + AlertCard(prescrição)
- 5 drogas, cada uma "Inativa" com botão **+ Iniciar** → painel:
  - **Noradrenalina** (1ª linha, input dose 0,05–3,3 → prescrição BIC mL/h + próximo passo).
  - **Vasopressina** (2ª, dose fixa 0,03 U/min → prescrição fixa).
  - **Adrenalina** (3ª, input 0,01–0,5 → prescrição).
  - **Dobutamina** (disfunção cardíaca, input 2–20 → prescrição).
  - **Hidrocortisona** (choque refratário, fixa 50mg 6/6h → prescrição).
- Modais: `o-que-e-pam-alvo/ne`.
- **Lógica (CRÍTICA):** dose mcg/kg/min + peso → prescrição (ampolas + diluente + taxa BIC mL/h) por droga. Fórmulas exatas do sepse.js — paridade obrigatória.

## T5 · Metas de Ressuscitação → StepHeader + 2× ChecklistBlock + AlertCard
- **Metas** (contador 0/5): PAM≥65 · lactato em queda · débito urinário ≥0,5 mL/kg/h · enchimento capilar <3s · SpO₂ 92-96%. [ChecklistBlock]
- **Checklist ICU** (0/6): TVP · IBP · cabeceira 30° · sedação RASS -1..0 · mobilização · glicemia <180. [ChecklistBlock]
- Nota "Remoção ativa de fluido" (info). Modais: `o-que-e-metas/checklist-icu`. **Encerrar** → salvar caso.

## Modais (BottomSheet/InfoSheet) — todos via `abrirModalSepse(id)`
o-que-e-sepse · descritor-sirs/news/mews/sofa · o-que-e-classificacao · o-que-e-primeira-hora ·
o-que-e-acompanhamento · o-que-e-atb/mrsa/mdr · o-que-e-pam-alvo/ne · o-que-e-metas/checklist-icu ·
teoria-sofa (+ demais teoria-cards). → InfoSheet/DetailSheet (conteúdo a capturar do sepse.js/modais).

## Estado / persistência (a confirmar no sepse.js)
`sepse_*` (historico, caso atual, iniciado_em, tela atual, score/veredito, bundle checks, foco, riscos,
vaso ativos+doses, metas/icu checks). Preservar chaves se já existirem (não perder histórico).

## Plano de build (incremental, por tela, com paridade clínica)
1. Scaffold: `features/sepse/SepseFlow.jsx` + `hooks/useSepseState.js` compondo **ProtocolShell** (5 steps) +
   HistoryScreen + TheoryScreen. (estrutura — baixo risco)
2. Por tela (T1→T5): portar conteúdo + **ler a função clínica do sepse.js 1:1** + verificar lado-a-lado vs
   golden (escore/dose/gate idênticos) → **sign-off clínico do Luis**.
3. Trocar iframe em `App.jsx`/`protocols.js` **só após paridade total** (golden fica de fallback).

> ⚠️ Itens clínico-críticos p/ paridade exata (nunca aproximar): cálculo SOFA/SIRS/NEWS/MEWS, peso ajustado
> + volume cristaloide, esquema ATB por foco/MRSA/MDR, **prescrição de vasopressor (ampolas/diluente/BIC)**.

---

# APÊNDICE CLÍNICO — fórmulas/dados lidos do `sepse.js` 1:1 (referência de paridade)

> Toda regra abaixo foi extraída literalmente de `calcmed/src/protocolos/sepse/sepse.js` (lido inteiro,
> 2789 linhas). É a fonte de paridade: o React deve reproduzir **idêntico**, sem aproximar.

## Estado (estadoPadrao) — chaves `sepse_protocolo_atual` / `sepse_historico`
`iniciadoEm · telaAtual(1-5) · telaMaxVisitada · abaAtual('executar'|'historico'|'teoria') · idade · pam ·
lactato · peso · sofa{sistema:idx} · scoreAtivo('sirs'|'news'|'mews'|'sofa') · sirs{temp,fc,fr,leuco:bool} ·
news{versao,fr,spo2,o2supl,temp,pas,fc,consciencia:idx} · mews{pas,fc,fr,temp,consciencia:idx} ·
classificacao('definida'|'provavel'|'possivel'|'improvavel') · vereditoEm · eventos[] · bundle{} · foco ·
riscoMrsa{} · riscoMdr{} · neDose(0.10) · neAtiva · epiDose · epiAtiva · dobDose · dobAtiva · vasoAtiva ·
hidroAtiva · imcObeso · sexo('masc'|'fem') · altura · horaAtb · anotacao · anotacaoEditadaEm · iniciais`.
**Preservar `iniciadoEm` ao 1º toque** (qualquer input/score seta `iniciadoEm = Date.now()` se null).

## Escores (tabelas idx→pts — pts NEM sempre = idx!)
- **SIRS** (4 booleans, 1 pt cada): temp>38/<36 · FC>90 · FR>20(ou PaCO₂<32) · leuco>12k/<4k/bastões>10%. Soma.
- **SOFA** (6 sistemas, pts = idx 0..4): resp(PaO₂/FiO₂) · coag(plaq) · figado(bili) · cardio(PAM/drogas) ·
  neuro(Glasgow) · renal(creat/DU). ≥2 = disfunção. (níveis completos no `SOFA_SISTEMAS` do golden)
- **NEWS/NEWS2** (7 critérios, idx→pts): fr[0,1,3] · spo2[0,1,2,3] · o2supl[0,2] · temp[0,1,2,3] ·
  pas[0,1,2,3] · fc[0,1,2,3] · consciencia[0,3]. ⚠️ ex.: fr idx2 = **3 pts** (não 2). Soma dos `.pts`.
- **MEWS** (5 critérios, idx→pts): pas[0,1,2,3] · fc[0,1,2,3] · fr[0,1,2,3] · temp[0,2] · consciencia[0,1,2,3].
- **Status/risco por escore** (`statusScoreAtivo`): SIRS 0=neutro,≤1 sucesso,2 atenção,3 atenção,≥4 crítico ·
  NEWS ≤4 sucesso,≤6 atenção,≥7 crítico · MEWS ≤4 sucesso,≥5 crítico ·
  SOFA 0 neutro,<2 sucesso,<6 atenção,≥6 crítico. (mapa sev→ScoreResult risk: sucesso=baixo/atenção=moderado/crítico=alto)
- **Gate T1** (`validarTela1`): CTA liberado só se `totalScoreAtivo() > 0` **E** `classificacao` definida.

## T2 — peso ajustado + volume (fórmula confirmada c/ cliente)
- pesoIdeal = (sexo==='masc' ? **50** : **45.5**) + **0.906 × (altura_cm − 152.4)**
- pesoAjustado = pesoIdeal + **0.4 × (pesoReal − pesoIdeal)** → `Math.max(0, Math.round(...))`
- Só calcula se `imcObeso && peso && altura && sexo`; senão usa peso real.
- **Volume cristaloide** = `round(pesoUsado × 30)` mL Ringer Lactato (30 mL/kg em 1-3h). pesoUsado = pesoAj ?? peso.
- **Gate de peso**: sem peso, nada de cálculo silencioso (mostra "aguardando peso").
- PAM alvo: idade ≥65 → "PAM ≥ 60 mmHg (60-65)"; senão "PAM ≥ 65 mmHg".
- Meta DU (T5): `round(peso × 0.5)` mL/h.
- Bundle: 1ª LINHA=[hemocultura,lactato,atb,cristaloide] · ACOMP=[vasopressor,reavaliacao,procal,foco,hidrocort].
  Progresso = feitos/9. ATB realizado grava `horaAtb` + marca bundle.atb.

## T3 — ATB empírico (ESQUEMAS por foco) + MRSA/MDR
- **pac**: Ceftriaxona 1-2g IV q24h (infusão 3-4h) + Azitromicina 500mg IV/VO q24h.
- **urinario**: Ceftriaxona 2g IV q24h.
- **abdominal**: Piperacilina-tazobactam 4,5g IV q6h + Metronidazol 500mg IV q8h (se cobertura extra).
- **snc**: Ceftriaxona 2g IV q12h + Vancomicina 15-20mg/kg IV q8-12h + Ampicilina 2g IV q4h (se Listeria).
- **pele**: Cefazolina 2g IV q8h.
- **desconhecido**: Piperacilina-tazobactam 4,5g IV q6h + Vancomicina 15-20mg/kg IV q8-12h.
- **MRSA**: ≥2 fatores (de 5) → adiciona **+Vancomicina** (drug-mrsa). Contador n/5, ativo ≥2.
- **MDR**: ≥2 fatores (de 5) → adiciona **+Pip-tazo** (drug-mdr). Contador n/5, ativo ≥2.
- Gate T3: CTA liberado só com `foco` selecionado.

## T4 — vasopressores: prescrição BIC (ampolas + diluente + vazão mL/h) ⚠️ CRÍTICO
- **Noradrenalina** (1ª linha, input 0,05–3,3, default 0,10): "4 mg/4 mL" · **4 amp + 234 mL SG 5%** EV em BIC.
  Concentração 16 mg/250 mL = 64 mcg/mL. **vazão(mL/h) = mcgKg × peso × 60 / 64**. (sem peso: não calcula vazão)
  - Próximo passo: <0,25 escalonar até 0,25 antes de Vasopressina · <0,5 associar Vasopressina (0,03 U/min fixa)
    · ≥0,5 associar Adrenalina + Hidrocortisona 200 mg/dia.
- **Vasopressina** (2ª, dose fixa **0,03 U/min IV**, sem cálculo).
- **Adrenalina** (3ª, input 0,01–0,5, default 0,05): "1 mg/mL" · **12 amp + 188 mL SG 5%** = 12mg/200mL = 60 mcg/mL.
  **vazão(mL/h) = mcgKg × peso** (×60/60).
- **Dobutamina** (disfunção card., input 2–20, default 5): "250 mg/20 mL" · **4 amp + 170 mL SG 5%** =
  1000mg/250mL = 4000 mcg/mL. **vazão(mL/h) = mcgKg × peso × 0,015**.
- **Hidrocortisona** (choque refratário, fixa **200 mg/dia IV** = 50 mg 6/6h ou 8 mg/h infusão, sem cálculo).
- Formatação: dose `.toFixed(2)` (NE/Epi) / `.toFixed(1)` (Dob) · vírgula decimal · valores destacados (bold cor primária).

## Encerrar / histórico
- Encerrar → prompt iniciais (≤10, UPPER) → `sepse_historico.unshift({iniciais,data,duracaoMs,idade,peso,altura,
  sexo,imcObeso,scoreUsado,sofa,classificacao,vereditoEm,foco,horaAtb,bundleFeitos[],metasFeitas[],icuFeitas[],
  anotacao,eventos[],status:'concluido'})` → reset → toast "Caso arquivado" → volta ao hub.
- Detalhe do caso: grupos Caso / Desfecho clínico / Bundle (StatGrid/DetailRow) + Timeline (eventos) +
  "Itens cumpridos" (listas Bundle/Metas/ICU) + anotação + nota LGPD. Ações Excluir / Compartilhar.
- Labels histórico: BUNDLE_LABELS / METAS_LABELS / ICU_LABELS / CLASSIF_LABEL (no golden).

## Side-by-side (QA sem trocar iframe)
Rota React temporária `?route=sepse-react` → `<SepseFlow/>`; o card `sepse` do hub continua no iframe golden
até **sign-off de paridade**. Só então troca em `App.jsx`/`protocols.js` (golden vira fallback).
