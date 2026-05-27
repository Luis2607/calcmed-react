# Roadmap de Coerencia Visual - Pos-BottomSheet

Data: 2026-05-26  
Escopo: Central de Urgencia CalcMed em migracao incremental para React  
Status: diagnostico e plano para executar em paralelo/apos a padronizacao dos BottomSheets

## Contexto

O conteudo clinico do prototipo esta correto e validado. O problema principal agora nao e conteudo, e sim coerencia visual, manutencao e pareamento com o Design System.

O HTML validado em `../calcmed/` segue como golden master. A base React em `./` deve se tornar a camada escalavel, pareada com o DS do Figma, mas sem quebrar ou simplificar telas validadas.

Enquanto Claude trabalha na trilha `BottomSheet`, este documento mapeia as outras camadas visuais que precisam virar sistema:

- form controls;
- header de protocolo;
- stepper;
- action footer;
- cards clinicos;
- alertas/feedback;
- tipografia/spacing;
- icones;
- historico/listas.

Regra central: nao redesenhar conteudo clinico. Normalizar apenas estrutura visual, componentes e padroes.

## Principio De Trabalho

Cada camada visual deve seguir o mesmo metodo:

1. Inventariar usos atuais no HTML.
2. Identificar variacoes intencionais vs acidentais.
3. Escolher um padrao canonico.
4. Parear com tokens e componentes do DS.
5. Criar/ajustar componente React.
6. Migrar um caso simples.
7. Comparar contra `/golden/...`.
8. Migrar usos restantes por risco crescente.

Nao aplicar refactor global antes de provar paridade em uma instancia real.

## Achados Iniciais

### Base compartilhada existente

O arquivo `../calcmed/src/shared/styles/components.css` ja contem varios padroes compartilhados:

- `.app-header`
- `.btn-header`
- `.chip`
- `.stepper`
- `.tela-acao`
- `.proximo-hint`
- `.campo`
- `.campo-input-wrap`
- `.exame-card`
- `.faixa-chip`
- `.alert`
- `.btn`
- `.info-btn`
- `.toast`
- `.modal`

Isso e bom: existe um DS embrionario no HTML.

### Inconsistencias por protocolo

Varias telas criaram families locais que se parecem com componentes compartilhados, mas usam classes/propriedades proprias.

Sepse:

- `.score-tabs`, `.score-tab`
- `.score-descritor`
- `.score-result`
- `.risk-item`
- `.criterio-item`
- `.sofa-sistema`
- `.drug-card`
- `.alert-vaso`
- `.meta-card`
- `.criterio-toggle`

SCA:

- `.criterio-item` duplicado localmente
- `.realidade-card`
- `.clinical-timer`
- `.ecg-classe-btn`
- `.sinal-omi-card`
- `.score-panel`
- `.score-descritor`
- `.chip-manchester`
- `.campo-select`
- `.campo-select-btn`
- `.opcao-sheet`

PCR:

- `.banner-contextual`
- `.pcr-card`
- `.pcr-card-idle`
- `.pcr-card-running`
- `.pcr-card-window-*`
- `.event-item`
- `.evento-grupo-novo`
- controles especificos de ACLS/via aerea.

AVC:

- `.cincinnati-item`
- `.cincinnati-toggle`
- `.nihss-*`
- `.contra-sanfona`
- `.dose-resultado`
- `.trombo-tab`
- `.meta-card-monitor`
- `.historico-item`

Essas diferencas podem ser clinicamente justificadas em alguns casos, mas muitas sao variações acidentais de estrutura visual.

## Estado React Atual

Componentes React compartilhados ja existentes:

- `Button`
- `Checkbox`
- `Radio`
- `SectionLabel`
- `InputField`
- `ResultDisplay`
- `Stepper`
- `AlertCard`
- `HistoryView`
- `BottomSheet`

Arquivos de sheet/moleculas tambem ja apareceram no workspace, provavelmente pela execucao do plano de BottomSheet:

- `SheetHeader`
- `SheetBody`
- `SheetFooter`
- `SheetSection`
- `SheetAlert`
- `SheetOptionList`
- `InfoSheet`
- `SelectSheet`
- `ConfirmSheet`

Nao mexer nesses arquivos em paralelo sem coordenar com quem esta executando o plano do BottomSheet.

## Prioridade Geral

### P0 - BottomSheet

Status: em execucao por Claude.

Nao duplicar trabalho aqui. Acompanhar apenas para garantir que os componentes abaixo usem os mesmos atomos.

### P1 - Form Controls E Selection

Maior ganho visual depois do BottomSheet.

Por que:

- aparece em todos os protocolos;
- afeta calculadoras, scores, checklist, seletores e dados de paciente;
- hoje tem duplicacoes entre `.campo`, `.campo-select`, `.campo-select-btn`, `.criterio-item`, `.risk-item`, `.faixa-chip`, `.score-tab`, `.ecg-classe-btn`, `.trombo-tab`.

Componentes alvo:

- `TextInput`
- `NumberInput`
- `Textarea`
- `SelectTrigger`
- `OptionItem`
- `Checkbox`
- `Radio`
- `SegmentedControl`
- `ChoiceChip`
- `ToggleButtonGroup`

Resultado esperado:

- um unico padrao visual para input;
- um unico padrao para checkbox/radio;
- um unico padrao para trigger de select;
- um unico padrao para lista de opcoes;
- score tabs e segmented controls usando mesma familia.

### P2 - Protocol Shell

Unificar a estrutura superior e inferior das telas.

Inclui:

- header do protocolo;
- wordmark: `MODO SEPSE`, `MODO PCR`, `MODO AVC`, `MODO SCA`, `Protocolo CAD`;
- timer;
- badge salvo;
- chips contextuais;
- acoes do header;
- stepper;
- area fixa de acao da tela;
- `proximo-hint`;
- botoes de rodape.

Componentes alvo:

- `ProtocolHeader`
- `HeaderActionButton`
- `ProtocolChip`
- `ProtocolStepper`
- `ActionFooter`
- `NextHint`

Resultado esperado:

- todas as telas parecem pertencer ao mesmo produto;
- header e stepper nao variam acidentalmente;
- rodape de acao segue um padrao unico;
- microinteracoes de timer/salvo/chips sao consistentes.

### P3 - Clinical Cards

Unificar o principal bloco de conteudo clinico.

Por que:

- cards aparecem em exames, doses, metas, drogas, ECG, NIHSS, PCR, SOFA, historico;
- hoje existem muitas familias: `.exame-card`, `.pcr-card`, `.drug-card`, `.meta-card`, `.realidade-card`, `.sinal-omi-card`, `.dose-resultado`, `.cincinnati-item`, `.sofa-sistema`.

Componentes alvo:

- `ClinicalCard`
- `SelectableCard`
- `CollapsibleCard`
- `DoseCard`
- `TimerCard`
- `ResultCard`
- `ChecklistCard`
- `TheoryCard`

Resultado esperado:

- mesma base de radius, padding, borda, fundo e sombra;
- variantes por funcao, nao por protocolo;
- estados `default`, `selected`, `filled`, `critical`, `success`, `disabled`;
- cards especificos continuam possiveis, mas herdam base comum.

### P4 - Feedback System

Unificar comunicacao de estado.

Inclui:

- alert inline;
- alert hero;
- banner contextual;
- toast;
- badge salvo;
- empty state;
- erro de formulario;
- sucesso/aplicado;
- bloqueio critico.

Componentes alvo:

- `InlineAlert`
- `HeroAlert`
- `ContextBanner`
- `Toast`
- `StatusBadge`
- `EmptyState`
- `FieldError`

Resultado esperado:

- mesmo tom visual para `info`, `success`, `warning`, `critical`;
- diferenca clara entre alerta persistente, toast temporario e banner contextual;
- feedback nao compete com decisao clinica principal.

### P5 - Typography, Spacing E Icon System

Auditoria transversal.

Inclui:

- titulos de tela;
- labels;
- helpers;
- badges;
- numeros mono;
- subtitulos;
- labels de stepper;
- icones de acao;
- info buttons;
- tamanhos de touch target.

Componentes alvo:

- `Text`
- `Icon`
- `IconButton`
- `SectionLabel`
- `ValueText`
- `MonoNumber`

Resultado esperado:

- menos tamanho hardcoded;
- escala tipografica clara;
- icones com tamanhos e cor consistentes;
- touch targets acessiveis.

### P6 - Historico, Teoria E Listas

Organizar telas secundarias.

Inclui:

- historico de casos;
- busca;
- detalhe de caso;
- lista de teoria;
- cards de conteudo teorico;
- empty states.

Componentes alvo:

- `HistoryList`
- `HistoryItem`
- `SearchField`
- `TheoryList`
- `TheoryItem`
- `CaseDetail`

Resultado esperado:

- historico e teoria ficam coerentes entre protocolos;
- listas usam a mesma densidade visual;
- estados vazios e busca ficam padronizados.

## Ordem Recomendada Pos-BottomSheet

1. Form Controls E Selection.
2. Protocol Shell.
3. Clinical Cards.
4. Feedback System.
5. Typography, Spacing E Icon System.
6. Historico, Teoria E Listas.

Motivo:

- Form controls alimentam BottomSheet, scores, calculadoras e telas.
- Protocol Shell cria coerencia imediata de produto.
- Clinical Cards resolvem o miolo visual de quase todas as telas.
- Feedback System reduz confusao entre alertas, banners e toasts.
- Typography/Icon audit poliu o sistema depois da estrutura estar firme.

## Plano De Execucao Para P1 - Form Controls

### Inventario

Mapear:

- `.campo`
- `.campo-input-wrap`
- `.campo-input`
- `.campo-select`
- `.campo-select-btn`
- `.criterio-item`
- `.risk-item`
- `.faixa-chip`
- `.score-tab`
- `.ecg-classe-btn`
- `.trombo-tab`
- `.classificacao-card`
- `.cincinnati-btn`

### Componentes React

Criar ou revisar:

- `InputField`
- `TextareaField`
- `SelectTrigger`
- `OptionItem`
- `Checkbox`
- `Radio`
- `SegmentedControl`
- `ChoiceChip`

### QA

- vazio;
- preenchido;
- foco;
- erro;
- disabled;
- selecionado;
- texto longo;
- unidade;
- helper;
- 390px mobile.

## Plano De Execucao Para P2 - Protocol Shell

### Inventario

Mapear:

- `.app-header`
- `.app-header-wordmark`
- `.app-header-timer`
- `.app-header-actions`
- `.btn-header`
- `.chip`
- `.stepper`
- `.step`
- `.tela-acao`
- `.proximo-hint`

### Componentes React

Criar:

- `ProtocolHeader`
- `ProtocolTimer`
- `HeaderActionButton`
- `ProtocolChip`
- `ProtocolStepper`
- `ActionFooter`
- `NextHint`

### QA

- header sem chips;
- header com chips;
- timer normal;
- timer warning/critical;
- 2 ou 3 acoes no header;
- stepper 5 passos;
- stepper 6 passos;
- label curta/longa;
- footer com 1 botao;
- footer com 2 botoes;
- CTA disabled.

## Plano De Execucao Para P3 - Clinical Cards

### Inventario

Mapear:

- `.exame-card`
- `.pcr-card`
- `.drug-card`
- `.meta-card`
- `.realidade-card`
- `.sinal-omi-card`
- `.dose-resultado`
- `.cincinnati-item`
- `.sofa-sistema`
- `.teoria-card`

### Componentes React

Criar:

- `ClinicalCard`
- `ClinicalCardHeader`
- `ClinicalCardMeta`
- `SelectableCard`
- `CollapsibleCard`
- `DoseCard`
- `TimerCard`
- `ResultCard`

### QA

- default;
- selected;
- filled;
- critical;
- success;
- collapsible open/closed;
- texto longo;
- valor numerico grande;
- icone/info button.

## Handoff Para Claude/Codex

Se este roadmap for executado por outro agente:

1. Ler `docs/bottom-sheet-standardization-plan.md`.
2. Ler este arquivo.
3. Nao tocar nos arquivos de BottomSheet se Claude ainda estiver editando.
4. Comecar por inventario, nao implementacao.
5. Nao alterar conteudo clinico.
6. Nao remover classes antigas ate ter paridade visual.
7. Usar `/golden/...` como comparacao visual.
8. Cada componente novo precisa de caso real migrado como prova.
9. Cada camada precisa de QA mobile 390x844.

## Definicao De Pronto

Uma camada visual so fica pronta quando:

- tem inventario;
- tem componente React;
- tem equivalente planejado para Figma;
- usa tokens do DS;
- tem pelo menos um caso real migrado;
- passou lint/build;
- passou screenshot mobile;
- preservou copy, estado e microinteracao validada;
- registrou excecoes.

## Proximo Passo Recomendado

Depois que Claude fechar a primeira versao do BottomSheet:

1. Rodar QA do BottomSheet.
2. Congelar o contrato dos atomos usados por ele.
3. Comecar P1 Form Controls E Selection.

Motivo: os mesmos controles aparecem dentro dos sheets e nas telas. Resolver P1 logo depois do BottomSheet evita que o organismo fique bonito, mas o conteudo interno continue inconsistente.
