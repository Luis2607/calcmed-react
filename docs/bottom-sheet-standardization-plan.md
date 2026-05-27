# Plano de Padronizacao - BottomSheet CalcMed

Data: 2026-05-26  
Escopo: Central de Urgencia CalcMed em migracao incremental para React  
Status: plano operacional para execucao por paridade, sem big bang refactor

> **Execucao 2026-05-26** — Fases 1 a 5 entregues. Detalhes em [qa-report.md](./qa-report.md#bottomsheet--fases-2-5-entregues-2026-05-26). Fases 6 (clinicos complexos) e 7 (remocao de legado) pendentes — devem comecar so depois de migrar tambem o pattern `FormSheet` (Anotacao) e classificar os ~5 sheets ainda no `cad.js`.
>
> **Decisoes Rafael (DS) tomadas na execucao:**
> 1. Tones (`neutral|info|success|warning|critical`) viram `data-tone` no header e no alert — patterns nao redefinem cor inline.
> 2. Footer aceita `null` apenas em `SelectSheet` modo `immediate`; default em todos os outros patterns e ter 1 acao primaria.
> 3. `ConfirmSheet` com `destructive=true` desliga `closeOnBackdrop` — decisao destrutiva precisa ser explicita.
> 4. Late unmount via `onTransitionEnd` em vez de `setTimeout(320)` — respeita `prefers-reduced-motion` sem precisar conhecer a duracao.
> 5. `BottomSheet` recebe `footer` como objeto (`{primary, secondary?}`) em vez de `slot`/`children`; reforca que estrutura pertence ao organismo, conteudo aos patterns.

## Contexto

O prototipo validado da Central de Urgencia vive em `../calcmed/` e continua sendo o golden master funcional. A base React vive em `./` e deve se tornar o destino escalavel, mas sem reconstruir ou simplificar fluxos validados.

No estado atual, CAD e o primeiro fluxo React funcional em andamento. Sepse, PCR, AVC e SCA ainda rodam pelo HTML validado via ponte `/golden/...`, dentro do React, para preservar visual, fluxo, estado e microinteracoes ate a componentizacao real.

Durante a conversa, ficou claro que o maior ponto de dor para manutencao e o BottomSheet. Ele aparece dezenas de vezes nos protocolos e hoje mistura responsabilidades: teoria, anotacao, confirmacao, select custom, checklist clinico, calculadoras, listas, decisao critica e encerramento de fluxo. Muitas variacoes poderiam trocar apenas o conteudo, mas atualmente diferem em estrutura, footer, spacing, header, copy, estados e logica.

Este plano existe para que Codex, Claude ou outro agente siga a mesma rota: primeiro consolidar o design system minimo necessario, depois construir o organismo `BottomSheet`, depois migrar os usos reais aos poucos.

## Decisao Principal

Nao devemos esperar o design system inteiro estar 100% maduro para construir o BottomSheet. Isso criaria uma obra infinita.

Tambem nao devemos construir o BottomSheet final por cima de atomos e moleculas inconsistentes.

A decisao correta e criar uma trilha especifica do design system para BottomSheet:

1. Auditar todos os sheets existentes.
2. Fechar tokens necessarios.
3. Garantir atomos essenciais.
4. Criar moleculas do sheet.
5. Criar o organismo BottomSheet.
6. Criar patterns derivados.
7. Migrar usos reais por risco crescente.

## Visao Rafael - DS

Rafael trataria o BottomSheet como um organismo de design system, nao como um modal solto.

Principio: o BottomSheet controla a estrutura; o conteudo usa atomos e moleculas cadastrados.

Isso significa:

- O header, body, footer, backdrop, scroll, close, foco, motion e altura maxima pertencem ao organismo.
- Inputs, radios, checkboxes, botoes, alertas, cards, dividers, imagens e textos pertencem ao design system interno.
- Cada sheet especifico so escolhe conteudo e acoes, sem reinventar layout.
- Qualquer novo caso precisa caber em um tipo padronizado ou registrar gap real de DS.

## Objetivo Final

Ao final deste plano:

- Todos os BottomSheets da Central usam a mesma estrutura base.
- Header e footer sao consistentes entre CAD, Sepse, PCR, AVC e SCA.
- O body e rolavel quando necessario e pode conter texto, imagem, input, radio, checkbox, listas, alertas, calculadoras e ferramentas clinicas.
- O footer e fixo e nao some durante a rolagem.
- Tokens de cor, tipografia, spacing, radius, sombra, motion e foco sao respeitados.
- O comportamento e acessibilidade sao previsiveis: fechar, backdrop, ESC, foco, aria e scroll.
- A manutencao fica baseada em troca de conteudo, nao em duplicacao de estrutura.
- O componente fica pareavel com Figma e com o design system oficial.

## Nao Objetivos

- Nao migrar todos os protocolos de uma vez.
- Nao redesenhar a experiencia validada.
- Nao remover nuance clinica.
- Nao trocar comportamento validado por simplificacao tecnica.
- Nao criar um componente generico demais que permita qualquer bagunca interna.
- Nao inventar tokens ad hoc quando ja existe token no DS.

## Atomic Design

### Tokens

Valores fundamentais usados por todos:

- cor de overlay;
- cor de superficie;
- cor de borda;
- cor de texto primario, secundario, terciario;
- cor de retorno: info, sucesso, atencao, critico;
- spacing interno;
- radius topo do sheet;
- radius de card/input/botao;
- sombra/elevacao;
- tipografia de titulo, subtitulo, body, helper, label e numero clinico;
- motion de entrada/saida;
- foco acessivel.

### Atomos

Atomos necessarios para BottomSheet:

- `Button`
- `IconButton`
- `Icon`
- `Text`
- `Divider`
- `Badge` ou `Chip`
- `Input`
- `Textarea`
- `Radio`
- `Checkbox`

Esses atomos precisam estar pareados com o DS antes de entrarem nos sheets migrados.

### Moleculas

Moleculas especificas para o universo de sheets:

- `SheetHeader`
- `SheetBody`
- `SheetFooter`
- `SheetSection`
- `SheetOption`
- `SheetOptionList`
- `SheetMedia`
- `SheetAlert`
- `SheetFormRow`
- `SheetChecklistItem`
- `SheetCalculationBlock`

### Organismo

O organismo principal:

- `BottomSheet`

Ele deve conter:

- backdrop;
- sheet;
- handle;
- header fixo;
- body rolavel;
- footer fixo;
- controle de abertura/fechamento;
- controle de foco;
- comportamento de backdrop;
- comportamento de ESC;
- bloqueio de scroll onde necessario.

### Patterns

Patterns derivados do organismo:

- `InfoSheet`
- `SelectSheet`
- `ConfirmSheet`
- `FormSheet`
- `ChecklistSheet`
- `ToolSheet`
- `ClinicalDecisionSheet`
- `ExitProtocolSheet`
- `AnnotationSheet`

Patterns sao receitas reutilizaveis. Eles nao devem recriar a estrutura do BottomSheet.

## Anatomia Canonica

```txt
Backdrop
└── BottomSheet
    ├── Handle
    ├── Header fixo
    │   ├── Leading icon opcional
    │   ├── Titulo obrigatorio
    │   ├── Descricao opcional
    │   └── Close obrigatorio por padrao
    ├── Body rolavel
    │   ├── Texto
    │   ├── Imagem ou midia
    │   ├── Alertas
    │   ├── Inputs
    │   ├── Radios
    │   ├── Checkboxes
    │   ├── Opcoes/listas
    │   ├── Calculadoras
    │   └── Ferramentas clinicas
    └── Footer fixo
        ├── Acao primaria
        ├── Acao secundaria opcional
        └── Estado loading/disabled quando necessario
```

## Header

### Obrigatorio

- Titulo.
- Close button, exceto em sheet bloqueante muito especifico.

### Opcional

- Leading icon.
- Descricao/subtitulo.
- Badge contextual.

### Regras

- Titulo deve usar tipografia de titulo de sheet, nao H1 de tela.
- Icone so entra se comunica funcao: alerta, calculo, anotacao, decisao critica, sucesso ou informacao.
- Nao usar icone apenas decorativo.
- Close deve estar sempre no canto superior direito, com touch target adequado.

## Body

O body e o unico trecho rolavel do sheet.

### Conteudos permitidos

- Texto puro.
- Texto rico com hierarquia controlada.
- Alertas inline.
- Lista de opcoes.
- Radio group.
- Checkbox group.
- Inputs e textarea.
- Imagens, ECGs, diagramas, prints clinicos ou referencias visuais.
- Calculadoras.
- Blocos de prescricao.
- Cards de decisao.
- Ferramentas clinicas pequenas.

### Imagens e midia

Imagens sao permitidas, mas devem usar `SheetMedia`.

Regras para `SheetMedia`:

- largura 100%;
- radius por token;
- fundo neutro quando necessario;
- legenda opcional;
- alt text obrigatorio quando a imagem comunica informacao;
- nao estourar largura de 390px;
- nao substituir texto clinico critico quando o texto precisa ser copiavel/lido por leitor de tela.

## Footer

O footer e fixo e nao rola com o body.

### Decisao sobre footer sem botao

Footer com zero botao nao deve ser padrao.

Quase todo BottomSheet deve oferecer um encerramento claro:

- `Entendi`
- `Fechar`
- `Aplicar`
- `Salvar`
- `Confirmar`
- `Continuar`

Excecao permitida:

- `SelectSheet` com selecao imediata no body e close no header.

Mesmo nessa excecao, a ausencia de footer precisa ser uma decisao explicita do pattern, nao um acaso.

### Layouts de footer

- Uma acao: botao primario full width.
- Duas acoes: secundaria + primaria.
- Acao destrutiva: secundaria neutra + primaria/destrutiva com tom critico.
- Estado loading: primaria desabilitada com feedback.
- Estado disabled: primaria desabilitada com criterio claro no body.

## Tipos Padronizados

### InfoSheet

Uso:

- teoria;
- explicacao de score;
- referencia clinica;
- microcopy de orientacao.

Footer:

- `Entendi` obrigatorio.

### SelectSheet

Uso:

- substituto de select nativo;
- escolha de queixa principal;
- escolha de reperfusao;
- escolha de foco;
- escolha de ritmo ou opcoes similares.

Body:

- `SheetOptionList`.

Footer:

- pode ter `Cancelar` + `Aplicar`;
- pode nao ter footer se tocar na opcao aplica imediatamente.

### ConfirmSheet

Uso:

- sair do protocolo;
- encerrar PCR;
- limpar anotacao;
- resetar caso;
- confirmar acao de risco.

Footer:

- secundaria: `Cancelar`;
- primaria: `Confirmar`, `Sair`, `Encerrar` ou equivalente.

### FormSheet

Uso:

- anotacao;
- dados complementares;
- comentario;
- pequenos formularios.

Footer:

- `Cancelar` opcional;
- `Salvar` obrigatorio.

### ChecklistSheet

Uso:

- criterios RCE;
- edema cerebral;
- contraindicações;
- decisao por criterios.

Footer:

- `Aplicar`, `Confirmar` ou `Continuar`.

### ToolSheet

Uso:

- calculadora;
- dose;
- ventilacao;
- parametros;
- ferramenta clinica.

Footer:

- depende do fluxo, mas precisa haver acao clara para aplicar, copiar, salvar ou fechar.

## API React Proposta

```jsx
<BottomSheet
  open={open}
  onClose={handleClose}
  title="Queixa principal"
  description="Escolha o motivo dominante da avaliacao"
  leadingIcon="alert"
  tone="neutral"
  closeLabel="Fechar"
  footer={{
    primary: { label: 'Aplicar', onClick: handleApply },
    secondary: { label: 'Cancelar', onClick: handleClose },
  }}
>
  <SheetOptionList
    options={options}
    value={value}
    onChange={setValue}
  />
</BottomSheet>
```

## Props Do Organismo

| Prop | Tipo | Obrigatorio | Observacao |
|---|---|---:|---|
| `open` | boolean | sim | Controla visibilidade |
| `onClose` | function | sim | Fecha por botao, ESC ou backdrop quando permitido |
| `title` | string | sim | Titulo do header |
| `description` | string | nao | Texto curto abaixo do titulo |
| `leadingIcon` | icon id/node | nao | So quando agrega significado |
| `tone` | neutral/info/success/warning/critical | nao | Controla contexto visual |
| `closeLabel` | string | nao | Acessibilidade |
| `closeOnBackdrop` | boolean | nao | Padrao true, exceto bloqueantes |
| `footer` | object/null | nao | Obrigatorio por padrao nos patterns |
| `children` | ReactNode | sim | Conteudo do body |
| `maxHeight` | auto/tall/full | nao | Comecar com `auto` e max 85% |

## Tokens Necessarios

Antes da implementacao final, validar se ja existem:

- `--ds-fundo-sobreposicao`
- `--ds-fundo-cartao`
- `--ds-fundo-elevado`
- `--ds-borda-sutil`
- `--ds-borda-padrao`
- `--ds-texto-padrao`
- `--ds-texto-secundario`
- `--ds-texto-terciario`
- `--ds-retorno-info`
- `--ds-retorno-sucesso`
- `--ds-retorno-atencao`
- `--ds-retorno-critico`
- `--esp-2`
- `--esp-3`
- `--esp-4`
- `--esp-5`
- `--radius-card`
- `--radius-input`
- `--radius-pill`
- `--sombra-modal`
- tokens de motion de modal, se existirem.

Se algum token faltar, registrar gap antes de criar valor novo.

## Inventario Inicial A Fazer

Mapear todos os usos de bottom sheet/modal nos arquivos:

- `../calcmed/src/protocolos/cad/cad.js`
- `../calcmed/src/protocolos/cad/pediatrico.js`
- `../calcmed/src/protocolos/sepse/sepse.js`
- `../calcmed/src/protocolos/pcr/pcr.js`
- `../calcmed/src/protocolos/avc/avc.js`
- `../calcmed/src/protocolos/sca/sca.js`
- `../calcmed/src/shared/styles/components.css`
- `../calcmed/src/protocolos/*/*.css`

Classificar cada sheet por:

- protocolo;
- nome do fluxo;
- tipo padronizado;
- conteudo;
- botoes;
- se tem logica clinica;
- se tem input;
- se tem imagem/midia;
- se pode ser migrado cedo;
- risco de regressao.

## Ordem De Execucao

### Fase 0 - Congelar Referencia

Objetivo: garantir que nada sera perdido.

Tarefas:

- manter `../calcmed/` como golden master;
- manter ponte `/golden/...` funcionando;
- capturar screenshots dos sheets principais antes de migrar;
- registrar inventario inicial.

Aceite:

- HTML segue intacto;
- React segue buildando;
- sheets antigos continuam acessiveis pela ponte.

### Fase 1 - Tokens E Atomos Minimos

Objetivo: preparar a base sem auditar o DS inteiro.

Tarefas:

- validar tokens necessarios;
- revisar `Button`;
- revisar `IconButton`;
- revisar `Icon`;
- revisar `Text`;
- revisar `Divider`;
- revisar `Input`, `Textarea`, `Radio`, `Checkbox`;
- registrar gaps contra Figma/DS.

Aceite:

- atomos essenciais estao documentados;
- nao ha valor visual solto novo;
- cada atomo tem estados basicos: default, focus, disabled.

### Fase 2 - Moleculas Do Sheet

Objetivo: criar blocos reutilizaveis internos.

Tarefas:

- `SheetHeader`;
- `SheetBody`;
- `SheetFooter`;
- `SheetSection`;
- `SheetOption`;
- `SheetOptionList`;
- `SheetMedia`;
- `SheetAlert`;
- `SheetFormRow`;
- `SheetChecklistItem`.

Aceite:

- moleculas usam atomos existentes;
- moleculas nao sabem regra clinica;
- moleculas respeitam tokens.

### Fase 3 - BottomSheet Base

Objetivo: criar organismo estrutural.

Tarefas:

- backdrop confinado ao viewport;
- sheet com max-height;
- header fixo;
- body rolavel;
- footer fixo;
- close por botao;
- close por backdrop quando permitido;
- ESC;
- foco inicial;
- retorno de foco ao trigger;
- reduced motion.

Aceite:

- funciona em 390x844;
- sem overflow horizontal;
- footer nunca some;
- body rola independentemente;
- lint/build passam.

### Fase 4 - Patterns De Baixo Risco

Objetivo: validar arquitetura em casos simples.

Migrar nesta ordem:

1. `InfoSheet`
2. `SelectSheet`
3. `ConfirmSheet`

Exemplos candidatos:

- explicacao de score;
- teoria simples;
- SCA queixa principal;
- confirmacao simples de sair/fechar.

Aceite:

- visual comparado contra HTML;
- copy preservada;
- comportamento preservado;
- screenshots antes/depois aprovados.

### Fase 5 - Patterns Com Estado

Objetivo: migrar sheets com input e estado.

Migrar:

- `FormSheet`;
- `AnnotationSheet`;
- sheets com textarea;
- sheets com limpar/salvar.

Aceite:

- localStorage preservado;
- estado sobrevive refresh quando aplicavel;
- badge/feedback preservado.

### Fase 6 - Patterns Clinicos Complexos

Objetivo: migrar sem quebrar regra clinica.

Migrar:

- `ChecklistSheet`;
- `ToolSheet`;
- `ClinicalDecisionSheet`;
- calculadoras;
- criterios RCE;
- edema cerebral;
- reperfusao;
- dose/ventilacao.

Aceite:

- regra clinica coberta por checklist manual ou teste;
- estados de erro preservados;
- microcopy preservada;
- historico/timers nao quebram.

### Fase 7 - Remocao Controlada De Legado

Objetivo: reduzir duplicacao so depois de paridade.

Tarefas:

- remover apenas classes e funcoes comprovadamente substituidas;
- manter ponte HTML ate protocolo inteiro estar migrado;
- registrar cada remocao.

Aceite:

- sem regressao visual;
- sem perda de fluxo;
- diff pequeno e reversivel.

## QA Obrigatorio Por Sheet Migrado

Antes de considerar um sheet migrado:

- abre e fecha pelo trigger;
- fecha pelo botao close;
- fecha por ESC quando permitido;
- fecha por backdrop quando permitido;
- body rola sem mover footer;
- footer fica fixo;
- foco visivel funciona;
- texto nao estoura;
- botoes nao quebram em 390px;
- imagem/midia, se existir, nao estoura largura;
- estado selecionado aparece;
- estado disabled/loading aparece quando aplicavel;
- copy bate com HTML;
- screenshot mobile comparado com golden master;
- `npm run lint` passa;
- `npm run build` passa.

## Criterios De Pronto Do Projeto

O projeto so deve considerar BottomSheets padronizados quando:

- todos os sheets inventariados foram classificados;
- todos usam `BottomSheet` ou pattern derivado;
- nao existem novos sheets criados diretamente com `modal-backdrop`/HTML manual;
- a documentacao lista excecoes reais;
- React tem exemplos de `InfoSheet`, `SelectSheet`, `ConfirmSheet`, `FormSheet`, `ChecklistSheet` e `ToolSheet`;
- Figma tem componente equivalente com variantes e slots;
- QA visual mobile passou para CAD, Sepse, PCR, AVC e SCA.

## Handoff Para Claude

Se continuar por Claude, seguir esta ordem sem pular:

1. Ler este arquivo inteiro.
2. Ler `README.md`.
3. Ler `docs/parity-checklist.md`.
4. Confirmar que `../calcmed/` continua sendo golden master.
5. Nao editar HTML validado salvo se Luis pedir explicitamente.
6. Inventariar bottom sheets antes de implementar.
7. Criar ou ajustar apenas atomos necessarios ao BottomSheet.
8. Implementar o organismo de forma incremental.
9. Migrar primeiro um `InfoSheet`.
10. Validar visualmente contra `/golden/...`.
11. So depois migrar `SelectSheet`, `ConfirmSheet`, `FormSheet`, `ChecklistSheet` e `ToolSheet`.

Regra de seguranca: se houver duvida se uma variacao e inutil ou clinicamente importante, tratar como importante ate prova contraria.

## Backlog Imediato

- Criar inventario dos sheets existentes.
- Criar spec visual detalhada do `BottomSheet`.
- Validar tokens usados por modal atual.
- Revisar atomos essenciais.
- Implementar `SheetHeader`, `SheetBody`, `SheetFooter`.
- Implementar `BottomSheet` base.
- Migrar primeiro sheet informativo simples.
- Migrar primeiro select sheet simples.
- Documentar comparativo antes/depois.
