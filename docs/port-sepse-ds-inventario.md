# Inventário DS por feature · Port Sepse (golden → React)

> Gate (regra de governança 3 + `feedback_inspect_existing_before_building`): ANTES de
> codar, eu listo aqui **cada bloco do golden** → **qual componente DS já pronto** vai cobrir,
> com justificativa + componente alternativo descartado. Luis aprova item-a-item.
> Auditoria honesta do que JÁ tá certo no SepseFlow.jsx vs o que precisa trocar.

## Legenda
- ✅ **Mantém** — já tá usando o componente certo.
- ⚠️ **Trocar/ajustar** — escolha errada ou sub-ótima; troca pra outro componente DS.
- 🆕 **Adicionar** — bloco do golden que não foi portado / componente DS existente que eu deveria ter usado e não usei.
- ❓ **Proposta** — componente novo possível; precisa de aprovação Luis (regra de governança 3).

---

## T1 · Triagem (escores SIRS/NEWS/MEWS/SOFA + veredito)

| # | Bloco golden | Hoje em SepseFlow | Decisão | Componente DS | Por quê / alternativas descartadas |
|---|---|---|---|---|---|
| 1.1 | Wrapper visual do "subsistema escore" | Tudo solto (tabs + descritor + critérios + result em sequência sem container) | ⚠️ | `ClinicalCard variant="plain"` envolvendo tudo | Bloco visualmente coeso = ScoreCard. Não existe wrapper pronto no DS — usar ClinicalCard plain (golden `.exame-card`). Descartado criar novo wrapper (regra: reuso > criar). |
| 1.2 | 4 sub-tabs SIRS / NEWS / MEWS / SOFA | `Segmented` (4 opções) | ⚠️ | `RadioGroup variant="card" columns={2}` | **Decisão do Luis:** evitar 2 componentes (Segmented + RadioGroup) fazendo seleção exclusiva na mesma tela. RadioGroup card 2-col cabe 4 escolhas confortavelmente e usa o mesmo padrão do veredito embaixo. Descartado: Segmented (apertado pra 4 + duplica conceito), TabBar (é do shell, não de score), criar `ScoreTabs` novo (não precisa). |
| 1.3 | Descritor roxo do escore | `AlertCard level="info"` | ✅ | (mantém) | AlertCard info já é o padrão "texto explicativo c/ ícone". Cor não é roxa nativa (token info é teal-azul) — aceito drift visual. |
| 1.4 | Versão NEWS2/NEWS | `Segmented` full-width acima dos critérios | ⚠️ | `Select` (abre SelectSheet) | Golden é `<select>` discreto no header. Select trigger + SelectSheet (já usados no CAD pro K) — pequeno, embutido na linha do header da seção. Descartado: Segmented (ocupa muito), inline radio (mais ruído). |
| 1.5 | SOFA 6 critérios accordion (sistema + opções → pontos) | `ScoreCriterionGroup` (controlled expanded) | ✅ | (mantém) | Componente foi feito exatamente pra isso. |
| 1.6 | NEWS 7 critérios accordion | `ScoreCriterionGroup` | ✅ | (mantém) | Idem. Nuance: o golden tem `shouldRenderHorizontal` que renderiza Segmented horizontal pra critérios "curtos". Decisão: **pular esta nuance** (consistência > variação visual) — todos accordion. |
| 1.7 | NEWS · O₂ suplementar (binário) | `ScoreCriterionGroup` 2 opções | ⚠️ | `ScoreCriterion type="checkbox"` label "Em O₂ suplementar" points="+2" | Golden renderiza como checkbox inline (binário sim/não), não accordion. `ScoreCriterion` existe pra exatamente isso e eu **não usei**. |
| 1.8 | MEWS 5 critérios accordion | `ScoreCriterionGroup` | ✅ | (mantém) | |
| 1.9 | SIRS 4 critérios | `CheckboxGroup variant="card"` (1 col) | ✅ | (mantém) | 4 checkboxes simples; CheckboxGroup card cabe. Considerei 4× `ScoreCriterion type="checkbox"` (mostra "+1 pt" por linha) — **proposto**: mudar pra `ScoreCriterion` pra ficar consistente com NEWS o2supl e mostrar os pontos. Pergunta no fim. |
| 1.10 | ScoreResult (valor + label + risco) | `ScoreResult` | ✅ | (mantém) | |
| 1.11 | Interpretação por faixa (0..N pts → severidade) | (ausente) | 🆕 | `ScoreRangeTable` | Existia no DS, eu **não usei**. Mostra tabela "0 pts: aguardando · <2: ok · 2-5: atenção · ≥6: crítico" embaixo do ScoreResult. Por escore (SOFA/NEWS/MEWS/SIRS) tem faixas diferentes. |
| 1.12 | Alert "Sepse é diagnóstico clínico" | `AlertCard level="critical"` | ✅ | (mantém) | |
| 1.13 | Veredito (4 opções: definida/provável/possível/improvável) | `RadioGroup variant="card"` 1 col | ⚠️ (menor) | `RadioGroup variant="card" columns={2}` | Para consistência visual com 1.2 (tabs escore em 2 cols). 4 opções em 2×2 fica melhor que 4×1. |
| 1.14 | InfoButton no título da tela ("o que é sepse") | (ausente) | 🆕 | `InfoButton` ao lado do StepHeader title | Golden tem info-btn no título; eu não wirei. |
| 1.15 | InfoButtons em cada sub-seção (info dos escores SIRS/NEWS/MEWS/SOFA, info veredito) | Apenas no veredito | 🆕 | `InfoButton` na linha do tab/descritor | Hoje só veredito tem info. Falta info em "o que é SIRS/NEWS/MEWS/SOFA" via mesmo descritor (já tem texto mas sem botão de modal aprofundado). |

---

## T2 · Bundle 1ª hora

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| 2.1 | Paciente row (Idade + Peso) | `InputField` × 2 em row2 | ✅ | (mantém) | |
| 2.2 | Toggle "IMC ≥ 30" + label | `Toggle` dentro de `ClinicalCard plain` com `label` prop do Toggle | ⚠️ | `ToggleField` | ToggleField (label esquerda + Toggle direita) é o padrão DS pra essa linha. Cobre o golden `.toggle-row`. ClinicalCard plain volta a embrulhar SÓ se for grupo com sexo/altura/peso ajustado quando aberto. |
| 2.3 | Sexo (Masc/Fem) | `Segmented` 2 opções | ✅ | (mantém) | 2 opções = Segmented natural. |
| 2.4 | Altura input | `InputField` mono cm | ✅ | (mantém) | |
| 2.5 | Peso ajustado output | `DetailRow` | ✅ | (mantém) | |
| 2.6 | "Registrar hora do ATB" button **separado** acima do bundle | `Button` solto | ⚠️ | (remover botão; integrar no ChecklistBlock) | **Bom senso que cortei caminho.** Golden tem o item ATB do bundle ABRINDO o registro de hora (não botão separado). Decisão: remover botão; quando user marca o item "Antibiótico IV" do ChecklistBlock 1ª LINHA, chama `registrarHoraAtb()`. Item label muda pra "ATB registrado às 14:35" quando setado. |
| 2.7 | ChecklistBlock 1ª LINHA (4 items) | `ChecklistBlock tagTone="critico"` | ✅ | (mantém) | + alteração 2.6 (item ATB faz double-duty) |
| 2.8 | Cristaloide 30 mL/kg · expansível (com volume calculado dentro) | `AlertCard level="result" showValue` SEPARADO abaixo do block | ⚠️ | **Manter AlertCard separado abaixo do ChecklistBlock** (decisão consciente) | Golden é "summary expansível" do item. **Trade-off:** ChecklistBlock items são booleanos simples; embedar conteúdo expansível dentro quebra a abstração. Manter como **card de volume LOGO ABAIXO** do ChecklistBlock 1ª LINHA, com título "Volume calculado · 30 mL/kg" — fica visualmente associado ao item, sem violar o componente. Documentar este desvio. |
| 2.9 | Volume aguardando peso (estado vazio) | AlertCard info | ✅ | (mantém) | |
| 2.10 | Vasopressor label dinâmico ("PAM ≥ 60 mmHg em > 65 anos") | Item de checklist com label computado | ✅ | (mantém) | |
| 2.11 | ChecklistBlock ACOMPANHAMENTO (5 items) | `ChecklistBlock tagTone="novo"` | ✅ | (mantém) | |
| 2.12 | Progresso 0/9 + % + barra | CSS inline tokenizado (track + fill) | ✅ (com nota) | (mantém) | **Não existe componente DS Progress.** ❓ **Proposta:** criar `ProgressBar` (molecule) — útil em outros fluxos. Pergunta pendente. Por ora, mantenho inline tokenizado. |
| 2.13 | Nota PAM alvo ≥65 anos | `AlertCard level="info"` | ✅ | (mantém) | |
| 2.14 | InfoButtons (1ª hora / acompanhamento) | Wirados via `onInfo` do ChecklistBlock | ✅ | (mantém) | |
| 2.15 | InfoButton no título "Bundle da 1ª hora" | (ausente) | 🆕 | `InfoButton` ao lado do StepHeader | Golden tem; faltou. |

---

## T3 · ATB

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| 3.1 | Foco grid (6 cards 2-col) | `OptionCard` × 6 em focoGrid (2-col) | ✅ | (mantém) | |
| 3.2 | Risco MRSA (5 checkboxes) | `CheckboxGroup` + contador "n/5" | ✅ | (mantém) | |
| 3.3 | Risco MDR (5 checkboxes) | `CheckboxGroup` + contador | ✅ | (mantém) | |
| 3.4 | Esquema empírico (drogas+doses) | `ClinicalCard plain` + `DetailRow` por droga | ✅ | (mantém) | |
| 3.5 | +Vanco / +Pip-tazo cards condicionais | `ClinicalCard plain` com `tags` | ✅ | (mantém) | |
| 3.6 | Alert CCIH/SCIH | `AlertCard level="warning"` | ✅ | (mantém) | |
| 3.7 | InfoButton no título | (ausente) | 🆕 | `InfoButton` no StepHeader | |

---

## T4 · Vasopressores

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| 4.1 | Card da droga (inativa/ativa) | `ClinicalCard state="ativo"|"inativo"` | ✅ | (mantém) | |
| 4.2 | "+ Iniciar" botão da droga inativa | `Button variant="secondary"` | ✅ | (mantém) | |
| 4.3 | Input de dose (NE/Adre/Dob) | `InputField` mono unit | ✅ | (mantém) | |
| 4.4 | Prescrição (preparo + vazão calculada) | `AlertCard level="result"` com children HTML (texto + spans destaque) | ⚠️ | **`DoseDisplay`** (vazão grande) + `AlertCard footnote` com preparo abaixo | Golden destaca a vazão em mono grande (32 Bold teal) — `DoseDisplay` foi feito exatamente pra isso. AlertCard com children texto não dá esse peso visual. Layout: DoseDisplay value=vazão unit=mL/h via=preparo + AlertCard footnote com a dose mcg/kg/min + peso. |
| 4.5 | Próximo passo NE (escalation hint) | `AlertCard level="info"` | ✅ | (mantém) | |
| 4.6 | Vasopressina fixa "0,03 U/min" | `AlertCard level="result"` texto | ⚠️ | `DoseDisplay value="0,03" unit="U/min IV" via="Dose fixa · não titular"` | DoseDisplay é o componente certo pra dose fixa apresentada com peso visual. |
| 4.7 | Hidrocortisona fixa "50 mg 6/6h" | `AlertCard level="result"` texto | ⚠️ | `DoseDisplay value="50" unit="mg IV 6/6h" via="200 mg/dia · ou 8 mg/h infusão"` | Idem. |
| 4.8 | InfoButtons (NE, hidrocortisona, PAM alvo) | (ausente) | 🆕 | `InfoButton` ao lado do título de cada drug-card / no header da tela | |

---

## T5 · Metas

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| 5.1 | ChecklistBlock Metas (5 items + DU dinâmico) | `ChecklistBlock` | ✅ | (mantém) | |
| 5.2 | ChecklistBlock ICU (6 items) | `ChecklistBlock` | ✅ | (mantém) | |
| 5.3 | Nota "Remoção ativa de fluido" | `AlertCard info` | ✅ | (mantém) | |
| 5.4 | InfoButtons (metas, checklist ICU) | Via `onInfo` do ChecklistBlock | ✅ | (mantém) | |

---

## Encerrar / Histórico

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| H.1 | Encerrar caso: prompt iniciais | `FormSheet` + InputField | ✅ | (mantém) | |
| H.2 | Toast "Caso arquivado" | (ausente) | 🆕 | `Toast` (existe) | Feedback após salvar caso. |
| H.3 | Histórico lista de casos | `HistoryScreen` + `HistoryView` (já wired) | ✅ | (mantém) | |
| H.4 | **Detalhe do caso ao clicar** (modal com Timeline + StatGrid + DetailRow + lista bundle/metas/ICU) | (ausente) | 🆕 | `PatientDetail` (organism) + `Timeline` (organism) + `StatGrid` + `DetailRow` dentro de `DetailSheet` | Golden abre modal com tudo do caso (incl. linha do tempo dos eventos). Eu não wirei. Existe `PatientDetail` (perfeito) + `Timeline` (perfeito) + `DetailSheet` (pattern). HistoryView precisa onClick por card. |
| H.5 | Excluir caso | (ausente) | 🆕 | Button danger dentro do DetailSheet + ConfirmSheet | |
| H.6 | Compartilhar caso (navigator.share / clipboard) | (ausente) | 🆕 | Button no DetailSheet + Toast "Copiado" | |

---

## Header / Modais / Anotação

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| M.1 | Header: cronômetro "Aberto há HH:MM" (subtitle) | `ProtocolHeader subtitle` | ✅ | (mantém) | |
| M.2 | Header chips (idade, peso, Sepse, bundle %) | `ProtocolHeader chips` | ✅ | (mantém) | + adicionar chip "Choque" quando PAM<65 + lactato≥2 (golden faz, mas pam/lactato não têm input — fica latente). |
| M.3 | Header actions: Anotar (badge se há texto) + Sair | `actions` (Anotar) + `onBack` (Sair) | ⚠️ (menor) | (mantém) + `active` no Anotar quando há texto | Golden tem badge visual no botão Anotar quando há anotação. ProtocolHeader já suporta `actions[].active`. Setar quando `s.anotacao` não vazia. |
| M.4 | Modais info/teoria (27 modais) | `InfoSheet` + `SepseModalBody` | ✅ | (mantém) | |
| M.5 | Anotação sheet | `AnnotationSheet` (FormSheet + SheetTextarea) — só Salvar | ⚠️ | `AnnotationSheet` + adicionar botão "Limpar" | Golden tem 2 botões (Salvar + Limpar). AnnotationSheet só suporta Salvar/Cancelar. **Decisão**: estender AnnotationSheet pra suportar Limpar opcional (prop `onClear`), OU usar FormSheet direto + render custom. Estender é melhor (1 vez, todos os fluxos ganham). ⚠️ **mudança no DS** — exige aprovação. |
| M.6 | Sair confirm | `ConfirmSheet` | ✅ | (mantém) | |

---

## Teoria

| # | Bloco golden | Hoje | Decisão | Componente DS | Por quê |
|---|---|---|---|---|---|
| TE.1 | "Consulta rápida" título | `TheoryScreen title` | ✅ | (mantém) | |
| TE.2 | Cards de teoria | `DisclosureCard` (via TheoryScreen items) | ✅ | (mantém) | |
| TE.3 | Abrir InfoSheet com conteúdo | `InfoSheet` + `SepseModalBody` | ✅ | (mantém) | |

---

## Modificações no DS pedidas (precisam aprovação separada — regra de governança 3)

| # | Mudança | Tipo | Por quê | Status |
|---|---|---|---|---|
| DS.1 | `AnnotationSheet`: adicionar prop `onClear` (botão Limpar) | Extender existente | Golden tem; CAD e Sepse precisam. Cobre todos os fluxos de anotação. | ❓ pedido |
| DS.2 | `HistoryView`: adicionar `onCaseClick(case)` opcional, item de caso vira botão | Extender existente | Necessário pra abrir detalhe. Aditivo (se ausente, comportamento atual). | ❓ pedido |
| DS.3 | `ProgressBar` (novo molecule) | NOVO | Bundle progress (T2) + outros fluxos. Hoje fica inline tokenizado. **Opcional** — posso seguir sem. | ❓ pedido |

---

## Resumo numérico (auditoria honesta)

- ✅ Mantém certo: **30 itens**
- ⚠️ Trocar/ajustar: **10 itens** (4 estruturais T1, 2 bom-senso T2, 3 DoseDisplay T4, 1 RadioGroup veredito)
- 🆕 Adicionar (existia DS e eu não usei): **9 itens** (ScoreCriterion o2supl, ScoreRangeTable, 4 InfoButtons título, Toast, PatientDetail + Timeline detalhe histórico, Excluir/Compartilhar)
- ❓ Mudança no DS pedida: **3 itens** (AnnotationSheet onClear, HistoryView onCaseClick, ProgressBar)

**Cortes que admito ter feito por bom senso e voltar atrás:**
1. ATB realizado como botão separado (era pra ser dentro do item do bundle).
2. Cristaloide volume como card separado (era summary expansível — mantenho separado mas documento).
3. Não usei `ScoreCriterion` pro o2supl binário.
4. Não usei `ScoreRangeTable` pra interpretação.
5. Não usei `PatientDetail`/`Timeline` pro detalhe do histórico.
6. Não tem `Toast` no encerrar/excluir.
7. InfoButtons faltando em vários títulos de seção.

---

## Próximos passos (após você aprovar)
1. Aplicar varredura T1 (itens 1.1 a 1.15) — screenshot antes/depois.
2. Aplicar T2 (itens 2.2, 2.6, 2.8 esclarecido, 2.15) — screenshot.
3. Aplicar T3 (item 3.7).
4. Aplicar T4 (itens 4.4, 4.6, 4.7, 4.8) — screenshot prescrição com DoseDisplay.
5. Aplicar Histórico (H.2 toast, H.4 detalhe completo, H.5 excluir, H.6 compartilhar).
6. Modificações DS aprovadas (DS.1 AnnotationSheet onClear, DS.2 HistoryView onCaseClick, DS.3 ProgressBar se aprovado).
7. Build verde + lint + screenshots completos T1-T5 + sign-off clínico do Luis.
8. SÓ depois: trocar iframe sepse → React.
