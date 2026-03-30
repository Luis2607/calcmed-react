---
name: figma-component-architecture
description: Build production-grade Figma component sets following the Flowbite design system pattern. Covers variant properties, component properties (Boolean/Text/Instance Swap), zero-hardcoded variable binding, and page documentation structure. Based on deep analysis of Flowbite Pro v2.10.0.
---

# Figma Component Architecture - Flowbite Pattern

## When to Use This Skill
- Creating new component sets in Figma via figma-console-mcp
- Refactoring existing components to follow design system standards
- Auditing component quality (hardcoded values, missing properties)
- Building documented component pages in a design system file

---

## 1. Component Set Structure (Flowbite Pattern)

### Anatomy of a Flowbite Component Set

Every component follows this hierarchy:

```
COMPONENT_SET "Button"
  └── COMPONENT "Color=Primary, Size=base, State=Default, Outline=False, Icon only=False"
       ├── INSTANCE "cart-plus" (left icon - swappable)
       ├── TEXT "Button text" (editable via TEXT property)
       └── INSTANCE "cart-plus" (right icon - swappable)
```

### Variant Properties (VARIANT type)

Flowbite uses consistent variant axes across ALL components:

| Eixo | Tipo | Exemplos Flowbite | Quando usar |
|------|------|-------------------|-------------|
| **Color / Theme** | VARIANT | Primary, Green, Red, Alternative, Dark | Estilo visual / cor do componente |
| **Size** | VARIANT | xs, sm, base, l, xl | Escala dimensional |
| **State** | VARIANT | Default, Hover, Focus, Disabled | Estado de interacao |
| **Dark mode** | VARIANT | False, True | Tema claro/escuro |
| **Outline** | VARIANT | False, True | Variante com borda |
| **Type** | VARIANT | Default, Icon & text, Only icon | Sub-tipo funcional |

**Ordem padrao dos eixos:** Color > Size > State > Outline > Icon only > Dark mode

**Contagem de variantes real (Flowbite):**
- **Button:** 300 variantes (6 Color x 5 Size x 3 State x 2 Outline x 2 IconOnly)
- **Input Field:** 42 variantes (3 Size x 7 State x 2 DarkMode)
- **Badge:** 64 variantes (3 Type x 2 Size x 8 Theme x 2 DarkMode)
- **Alert:** 10 variantes (5 Color x 2 DarkMode)
- **Social Button:** 16 variantes
- **Floating Label:** 72 variantes (6 State x 3 Type x 2 DarkMode x 2 Size)

### Component Properties (non-variant)

Flowbite usa 4 tipos de properties alem das variantes:

#### a) TEXT properties - conteudo editavel
```
"Button text#27:0"     → TEXT → "Button text"
"Placeholder text#34:0" → TEXT → "Input text"
"Label text#34:954"    → TEXT → "First name"
"Helper text#34:848"   → TEXT → "We'll never share..."
"Badge text#12:165"    → TEXT → "Badge"
"Body text#137:603"    → TEXT → "Alert body..."
"Heading text#137:831" → TEXT → "Alert heading"
```

#### b) BOOLEAN properties - toggle de visibilidade
```
"Show button text#26:0"    → BOOLEAN → true
"Show left icon#27:451"    → BOOLEAN → true
"Show right icon#27:1804"  → BOOLEAN → true
"Show label#34:636"        → BOOLEAN → true
"Show helper text#34:742"  → BOOLEAN → true
"Show placeholder#34:106"  → BOOLEAN → true
"Show alert heading#137:223" → BOOLEAN → true
"Show body text#137:679"   → BOOLEAN → true
"Show button#137:755"      → BOOLEAN → true
"Show close icon#12:99"    → BOOLEAN → true
```

#### c) INSTANCE_SWAP properties - icones trocaveis
```
"Left icon style#27:902"   → INSTANCE_SWAP → defaultComponentId
"Right icon style#27:1353" → INSTANCE_SWAP → defaultComponentId
"Icon style#29:0"          → INSTANCE_SWAP → defaultComponentId
"Right icon type#137:451"  → INSTANCE_SWAP → defaultComponentId
```

**Padrao de naming:** `{Descricao}#{nodeId}` (o sufixo #nodeId e auto-gerado pelo Figma)

### Wiring Rules (Como conectar properties aos nodes)
```javascript
// TEXT property -> wire to text node's characters
textNode.componentPropertyReferences = { characters: 'Button text#27:0' };

// BOOLEAN property -> wire to node visibility
iconNode.componentPropertyReferences = { visible: 'Show left icon#27:451' };

// INSTANCE_SWAP -> wire to instance's mainComponent
instanceNode.componentPropertyReferences = { mainComponent: 'Left icon style#27:902' };

// To find the full key after adding the property:
const propKey = Object.keys(cs.componentPropertyDefinitions)
  .find(k => k.startsWith('Label'));
```

---

## 2. Variable Collections (Flowbite Pattern)

Flowbite organiza variaveis em **5 colecoes separadas** por dominio:

### Colors (102 variaveis)
```
Naming: {escala}/{stop}
Exemplos: primary/50, primary/700, gray/500, red/200, green/600
Scopes: ALL_SCOPES
Inclui: black, white, primary/50-900, gray/50-900, red/50-900, green/50-900, etc.
```

### Border radius (8 variaveis)
```
Naming: rounded-{tamanho}
Exemplos: rounded-sm(2), rounded(4), rounded-md(6), rounded-lg(8), rounded-xl(12), rounded-2xl(16), rounded-3xl(24), rounded-full(9999)
Scopes: ["TEXT_CONTENT", "CORNER_RADIUS"]
```

### Spacing (35 variaveis)
```
Naming: {multiplicador} (segue Tailwind)
Exemplos: 0(0), px(1), 0.5(2), 1(4), 1.5(6), 2(8), 2.5(10), 3(12), 4(16), 5(20), 6(24), 8(32), 10(40), 12(48), 16(64), 20(80), 24(96)
Scopes: ["TEXT_CONTENT", "WIDTH_HEIGHT", "GAP"]
```

### Container (5 variaveis)
```
Naming: {breakpoint}
Exemplos: sm(640), md(768), lg(1024), xl(1280), 2xl(1563)
Scopes: ["TEXT_CONTENT", "WIDTH_HEIGHT"]
```

### Max-width (11 variaveis)
```
Naming: max-w-{tamanho}
Exemplos: max-w-xs(320), max-w-sm(384), max-w-7xl(1280)
Scopes: ["TEXT_CONTENT", "WIDTH_HEIGHT"]
```

**IMPORTANTE:** Flowbite NAO usa colecao separada para "Component tokens". Os componentes referenciam DIRETAMENTE as colecoes primitivas (Colors, Spacing, Border radius).

---

## 3. Como Flowbite Vincula Variaveis nos Componentes

### Exemplo real: Button Primary, base, Default

```
Fill color     → Colors/primary/700 (rgb 26,86,219)
Text color     → Colors/white
Padding top    → Spacing/2.5 (10px)
Padding bottom → Spacing/2.5 (10px)
Padding left   → Spacing/5 (20px)
Padding right  → Spacing/5 (20px)
Item spacing   → Spacing/2 (8px)
Corner radius  → Border radius/rounded-lg (8px)
Text style     → text-sm/font-medium (14px Inter Medium)
```

### Padrao de binding por tipo de prop:

| Propriedade | Colecao | Como vincular |
|-------------|---------|---------------|
| fills (bg) | Colors | `setBoundVariableForPaint(fill, 'color', variable)` |
| text fills | Colors | `setBoundVariableForPaint(fill, 'color', variable)` |
| paddingTop/Bottom | Spacing | `node.setBoundVariable('paddingTop', variable)` |
| paddingLeft/Right | Spacing | `node.setBoundVariable('paddingLeft', variable)` |
| itemSpacing (gap) | Spacing | `node.setBoundVariable('itemSpacing', variable)` |
| cornerRadius | Border radius | `node.setBoundVariable('topLeftRadius', variable)` (4x para cada canto) |

### Codigo completo para vincular um botao:
```javascript
// 1. Buscar variaveis
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const colorCol = cols.find(c => c.name === 'Colors');
const spacingCol = cols.find(c => c.name === 'Spacing');
const radiusCol = cols.find(c => c.name === 'Border radius');

async function getVar(collection, name) {
  for (const vid of collection.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(vid);
    if (v && v.name === name) return v;
  }
  return null;
}

// 2. Vincular fill (cor de fundo)
const primaryVar = await getVar(colorCol, 'primary/700');
const fills = [...comp.fills];
fills[0] = figma.variables.setBoundVariableForPaint(fills[0], 'color', primaryVar);
comp.fills = fills;

// 3. Vincular spacing
const sp2_5 = await getVar(spacingCol, '2.5');
const sp5 = await getVar(spacingCol, '5');
const sp2 = await getVar(spacingCol, '2');
comp.setBoundVariable('paddingTop', sp2_5);
comp.setBoundVariable('paddingBottom', sp2_5);
comp.setBoundVariable('paddingLeft', sp5);
comp.setBoundVariable('paddingRight', sp5);
comp.setBoundVariable('itemSpacing', sp2);

// 4. Vincular radius
const rLg = await getVar(radiusCol, 'rounded-lg');
comp.setBoundVariable('topLeftRadius', rLg);
comp.setBoundVariable('topRightRadius', rLg);
comp.setBoundVariable('bottomLeftRadius', rLg);
comp.setBoundVariable('bottomRightRadius', rLg);

// 5. Vincular cor do texto
const whiteVar = await getVar(colorCol, 'white');
const textNode = comp.findOne(n => n.type === 'TEXT');
const textFills = [...textNode.fills];
textFills[0] = figma.variables.setBoundVariableForPaint(textFills[0], 'color', whiteVar);
textNode.fills = textFills;

// 6. Aplicar text style
const textStyles = await figma.getLocalTextStylesAsync();
const smMedium = textStyles.find(s => s.name === 'text-sm/font-medium');
await textNode.setTextStyleIdAsync(smMedium.id);
```

---

## 4. AutoLayout Configuration

### Flowbite Button (padrao real)
```javascript
comp.layoutMode = 'HORIZONTAL';
comp.primaryAxisSizingMode = 'AUTO';   // width hugs content
comp.counterAxisSizingMode = 'AUTO';   // height hugs content
comp.primaryAxisAlignItems = 'CENTER'; // center horizontally
comp.counterAxisAlignItems = 'CENTER'; // center vertically
```

### Flowbite Input Field (padrao real)
```javascript
comp.layoutMode = 'VERTICAL';          // label + input + helper empilhados
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'FIXED';  // width fixa, height auto
```

### Regra geral:
- **Botoes, badges, chips:** HORIZONTAL + AUTO/AUTO (hug both axes)
- **Inputs, cards, alerts:** VERTICAL + AUTO/FIXED (fixed width, hug height)
- **Sempre CENTER/CENTER** para alinhamento interno

---

## 5. Text Styles (Flowbite Pattern)

### Naming convention: `text-{size}/font-{weight}`
```
text-xs/font-medium    → 12px Inter Medium, line-height 150%
text-sm/font-medium    → 14px Inter Medium, line-height 150%
text-sm/font-semibold  → 14px Inter Semi Bold, line-height 150%
text-base/font-normal  → 16px Inter Regular, line-height 150%
text-base/font-semibold → 16px Inter Semi Bold, line-height 150%
text-lg/font-semibold  → 18px Inter Semi Bold, line-height 150%
text-xl/font-bold      → 20px Inter Bold, line-height 150%
```

### Mapeamento Tailwind → Figma:
| Tailwind class | Font size | Figma style name |
|---|---|---|
| text-xs | 12px | text-xs/font-{weight} |
| text-sm | 14px | text-sm/font-{weight} |
| text-base | 16px | text-base/font-{weight} |
| text-lg | 18px | text-lg/font-{weight} |
| text-xl | 20px | text-xl/font-{weight} |
| text-2xl | 24px | text-2xl/font-{weight} |

**TODAS** as text styles usam Inter com line-height 150% e letter-spacing 0.

---

## 6. Dark Mode Pattern

### OBRIGATORIO: Dark mode como VARIANT + Variable Modes
- Cada componente TEM QUE TER um eixo `Dark mode: False | True`
- Isso DOBRA o numero de variantes (ex: 90 → 180)
- Nas variantes Dark mode=True, setar `setExplicitVariableModeForCollection(sem, '19:2')` (Dark)
- Nas variantes Dark mode=False, setar `setExplicitVariableModeForCollection(sem, '19:1')` (Light)
- As cores adaptam AUTOMATICAMENTE via Color Styles vinculados a variaveis semanticas
- Isso garante que o designer pode escolher Light/Dark EXPLICITAMENTE na property panel

### Como criar variantes Dark:
```javascript
// 1. Criar todas as variantes Light primeiro
// 2. Clonar cada uma e renomear
const existing = [...componentSet.children];
for (const variant of existing) {
  const darkClone = variant.clone();
  variant.name = variant.name + ', Dark mode=False';
  darkClone.name = darkClone.name.replace(/, Dark mode=False$/, '') + ', Dark mode=True';
  componentSet.appendChild(darkClone);
}
// 3. Setar variable modes
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semanticos');
for (const v of componentSet.children) {
  if (v.name.includes('Dark mode=True')) {
    v.setExplicitVariableModeForCollection(sem, '19:2');
  } else {
    v.setExplicitVariableModeForCollection(sem, '19:1');
  }
}
```

### Layout do grid com Dark mode:
- Light variants na ESQUERDA, Dark variants na DIREITA
- Mesma ordem de linhas (Color × Size)
- Gap entre blocos Light e Dark: 48px

---

## 7. Component Property Pattern por Tipo

### Button
```
VARIANT: Color(6), Size(5), State(3), Outline(2), Icon only(2)
TEXT: Button text
BOOLEAN: Show button text, Show left icon, Show right icon
INSTANCE_SWAP: Left icon style, Right icon style, Icon style
Total: 300 variantes
```

### Input Field
```
VARIANT: Size(3), State(7), Dark mode(2)
TEXT: Placeholder text, Label text, Helper text
BOOLEAN: Show placeholder, Show left icon, Show right icon, Show label, Show helper text
INSTANCE_SWAP: Left icon style, Right icon style
Total: 42 variantes
```

### Alert
```
VARIANT: Color(5), Dark mode(2)
TEXT: Heading text, Body text
BOOLEAN: Show alert heading, Show left icon, Show right icon, Show body text, Show button
INSTANCE_SWAP: Left icon style, Right icon type
Total: 10 variantes
```

### Badge
```
VARIANT: Type(3), Size(2), Theme(8), Dark mode(2)
TEXT: Badge text, Number
BOOLEAN: Show icon, Show close icon, Show text
INSTANCE_SWAP: Icon style, Close icon style
Total: 64 variantes
```

### Padrao observado:
1. **Todo texto visivel** tem uma property TEXT associada
2. **Todo elemento opcional** tem uma property BOOLEAN "Show {element}"
3. **Todo icone** tem BOOLEAN de visibilidade + INSTANCE_SWAP para trocar
4. **Dark mode** e sempre um VARIANT axis, nao variable mode
5. **State** cobre interacao (Default, Hover, Focus, Active, Disabled, Typing, etc.)

---

## 8. Scopes (Boas Praticas Flowbite)

| Tipo de variavel | Scopes corretos |
|---|---|
| Cores | `ALL_SCOPES` (flexibilidade total) |
| Border radius | `["TEXT_CONTENT", "CORNER_RADIUS"]` |
| Spacing | `["TEXT_CONTENT", "WIDTH_HEIGHT", "GAP"]` |
| Container sizes | `["TEXT_CONTENT", "WIDTH_HEIGHT"]` |
| Max-width | `["TEXT_CONTENT", "WIDTH_HEIGHT"]` |

**NUNCA** use `ALL_SCOPES` para spacing/radius — polui o picker de propriedades.

---

## 9. Aprendizados da Produção CalcMed

### Ícones dentro de instâncias
- Componentes de ícone NAO podem ter `layoutMode` ativo — impede SCALE constraints
- Setar `layoutMode = 'NONE'` + `clipsContent = true` nos ícone base
- Vetores internos precisam de `constraints = { horizontal: 'SCALE', vertical: 'SCALE' }`
- Em instâncias dentro de outros componentes, vincular `width` e `height` a variáveis de espaçamento

### Icon fills em contexto
- Ícones dentro de botões Primary/Danger devem usar `texto/sobre-destaque` (branco)
- Ícones dentro de botões Ghost/Text devem usar `texto/link` (teal)
- Ícones dentro de inputs devem usar `texto/terciario` (cinza)
- SEMPRE vincular a cor do VECTOR interno da instância, não do frame wrapper

### Frame wrapper das instâncias
- Instâncias de ícone herdam fills do componente base
- Se o componente base tinha fill, a instância mostra um quadrado colorido em volta
- SEMPRE limpar fills de instâncias: `instance.fills = []`

### Radius — CSS vs Figma
- Verificar SEMPRE os valores das variáveis de radius contra o CSS
- r-sm=4, r-md=8, r-lg=12, r-xl=16, r-pill=100
- Botões SM usam r-md, MD usam r-lg, LG usam r-xl

### Component properties em variantes clonadas
- Ao clonar variante de um component set, as property references se mantêm
- Ao criar componente FORA do set e depois appendChild, as refs NÃO funcionam
- Sempre clonar de dentro do set, nunca criar standalone e depois mover

### Título 40px das páginas de doc
- Aplicar `titulo-pagina` style e depois override `fontSize = 40`
- Esse override sempre cai na auditoria como "missing text style" — aceitar e corrigir manualmente

### Variable modes em showcase
- Painéis Light e Dark lado a lado devem usar `setExplicitVariableModeForCollection`
- Instâncias dentro de um frame com mode explícito herdam o mode automaticamente
- NAO usar cores hardcoded para simular dark — sempre variable modes

### Arquivo ativo no MCP
- Quando trabalha com Flowbite + CalcMed, o MCP pode estar no arquivo errado
- SEMPRE verificar `figma.root.name` antes de executar
- Usar `figma_navigate` para trocar entre arquivos

## 10. Processo de Construção — Microtarefas

### SEMPRE dividir qualquer página/componente em microtarefas antes de começar:

```
ETAPA 1: ANÁLISE
- Ler PDF de referência do DS React
- Identificar TODOS os component sets necessários
- Mapear variant axes (State, Type, Dark mode)
- Listar component properties (TEXT, BOOLEAN, INSTANCE_SWAP)
- Definir arquitetura atômica (átomos → moléculas)

ETAPA 2: LIMPEZA
- Verificar arquivo ativo (figma.root.name)
- Remover componentes antigos da página
- Manter apenas o que será reutilizado

ETAPA 3: ÁTOMOS PRIMEIRO
- Criar componentes base individuais (Radio Item, Toggle Tab, etc.)
- Cada átomo com todos os states + Dark mode
- Vincular TUDO a styles/variáveis
- Aplicar variable modes

ETAPA 4: MOLÉCULAS
- Compor moléculas usando INSTÂNCIAS dos átomos
- Ex: Toggle Segmented usa instâncias do Toggle Tab
- Adicionar properties na molécula (Label, Show label)

ETAPA 5: DOCUMENTAÇÃO
- Header com barra teal + nota clínica
- Quando Usar (FAÇA / NÃO FAÇA)
- Showcase com instâncias reais Light + Dark

ETAPA 6: ORGANIZAÇÃO
- Fix auto-layouts (recursivo)
- Sections: Doc + Componentes
- Restack com espaçamento

ETAPA 7: AUDITORIA (5 micro-checks)
1. Structure: variant count, axes, properties
2. Hardcoded: fills, strokes, text colors (ZERO tolerância)
3. Wiring: TEXT, BOOLEAN, INSTANCE_SWAP conectados
4. Modes: Dark=True→'19:2', False→'19:1'
5. Doc: todos textos com Text Style + Color Style
```

### Aprendizados adicionais da produção:

**Arquitetura atômica para controles compostos:**
- Toggle/Segmented: criar o Tab como átomo PRIMEIRO, depois compor
- Radio/Checkbox: o indicator (circle/box) é um frame com layers internas (outer + dot/check)
- Checkmark: usar instância do ícone real (icone/confirmacao), não texto "✓"
- Dot do Radio: ellipse branca 10x10 posicionada em x=7, y=7 dentro de frame 24x24

**Indicator pattern (Radio/Checkbox):**
```
Frame "Indicator" (24x24, no fill, clipsContent=false)
  ├── Ellipse/Rectangle "Outer" (24x24, fill ou stroke)
  └── Ellipse/Instance "Dot/Check" (10-16px, centered)
```

**fontSize override descola Text Style:**
- Aplicar setTextStyleIdAsync() e depois mudar fontSize = texto perde o style
- Solução: NÃO fazer override — usar o style como está, ou criar um novo style

**Arquivo ativo pode trocar sem aviso:**
- Sempre verificar figma.root.name no início de cada chamada
- Usar figma_navigate para garantir o arquivo correto

## 11. Checklist de Qualidade (Auditoria)

Antes de considerar um componente pronto:

- [ ] Todas as cores usam variavel da colecao Colors (zero RGB hardcoded)
- [ ] Todos os paddings usam variavel da colecao Spacing
- [ ] Todos os radius usam variavel da colecao Border radius
- [ ] Todos os textos usam Text Style aplicado
- [ ] Todo texto editavel tem property TEXT
- [ ] Todo elemento opcional tem property BOOLEAN "Show X"
- [ ] Todo icone tem INSTANCE_SWAP + BOOLEAN de visibilidade
- [ ] AutoLayout configurado (HORIZONTAL ou VERTICAL)
- [ ] primaryAxisSizingMode = 'AUTO' (NUNCA FIXED com hug content)
- [ ] States cobrem: Default, Hover, Focus (minimo)
- [ ] Dark mode como eixo VARIANT quando necessario
- [ ] Component set organizado em grid legivel (combineAsVariants)

---

## 12. Regra de Ouro — Telas Vêm do Código

### OBRIGATÓRIO: Sempre ler o código React ANTES de criar qualquer tela no Figma

As telas foram aprovadas pelo cliente no código React (`calcmed-react/src/pages/*.tsx`).
O Figma é a **documentação visual** dessas telas, não a fonte da verdade.

**Workflow para cada tela:**
1. Ler o `.tsx` da página (ex: `EntradaPage.tsx`)
2. Ler o CSS correspondente (`design-system.css`, `app.css`)
3. Identificar assets usados (`/assets/slide-*.png`, `/assets/Icone.svg`)
4. Mapear cada elemento para componente Figma existente no DS
5. O que NÃO existe → criar componente no DS primeiro
6. Só ENTÃO montar a tela usando instâncias

**Mapeamento Código → Figma:**
| Código React | Componente Figma |
|---|---|
| `<Button variant="primary">` | Button (Color=Primary) |
| `<Button variant="google">` | Button/Google |
| `<Button variant="apple">` | Button/Apple |
| `<Button variant="text">` | Button (Color=Text) |
| `<Button variant="discrete">` | Button (Color=Discrete) |
| `<InputField>` | Input Field |
| `<MobileFrame>` | Frame 390×844 com grid-celular |
| `.hero-dark` + `.carousel-bg` | Auth Hero component |
| `.bottom-sheet` | Frame com radius 28px, bg-card |
| `.sheet-header` | Frame H: icone/voltar + título |
| `.dots` | Carousel Dots component |
| `.splash-screen` | Frame com brand-navy-deep |
| `<AuthWebLayout>` | Frame 1440×900 com split layout |

**Tokens CSS → Variáveis Figma:**
| CSS Variable | Figma Variable |
|---|---|
| `--brand-navy-deep` | Primitivos/brand/navy-deep |
| `--bg-card` | Semânticos/fundo/cartao |
| `--bg-surface` | Semânticos/fundo/superficie |
| `--fg` | Semânticos/texto/padrao |
| `--fg-2` | Semânticos/texto/secundario |
| `--fg-3` | Semânticos/texto/terciario |
| `--fg-link` | Semânticos/texto/link |
| `--sp-N` | Primitivos/espaco/N |
| `--r-lg` | 12px, `--r-xl` | 16px |

**Regras de tamanho (do código):**
- Bottom sheet radius: **28px** (não 24)
- Bottom sheet gap compact: `--sp-3` (12px)
- Brand icon no hero: **72px** (não 48)
- Brand icon no splash: **96px**
- Buttons no mobile: tamanho **LG** (não MD)
- Buttons no web: tamanho **MD**
- Slide images: `/assets/slide-1.png`, `slide-2.png`, `slide-3.png`

**NUNCA:**
- Inventar layout — copiar do código
- Hardcodar cores — usar variáveis semânticas
- Criar texto sem text style — sempre vincular
- Esquecer auto-layout — TUDO deve ter auto-layout

---

## 10. Mapeamento CalcMed ↔ Flowbite

### Colecoes CalcMed vs Flowbite
| CalcMed | Flowbite | Notas |
|---|---|---|
| Primitivos (140 cores) | Colors (102 cores) | CalcMed tem mais escalas (12 vs ~8) |
| Semanticos (50 cores, 2 modes) | NAO existe | CalcMed tem variable modes Light/Dark, Flowbite usa variant |
| espaco/* (12 vars) | Spacing (35 vars) | Flowbite segue Tailwind completo |
| Border radius (via CSS) | Border radius (8 vars) | CalcMed precisa criar colecao separada |

### Estrategia recomendada para CalcMed:
1. **Manter** variable modes Light/Dark nos Semanticos (melhor que variant)
2. **Criar** colecao "Componentes" com variantes especificas de botoes, inputs, etc.
3. **Usar** colecao Primitivos para cores diretas (como Flowbite faz)
4. **Aplicar** Text Styles + Color Styles (CalcMed ja tem ambos)
5. **Seguir** padrao de properties Flowbite: TEXT + BOOLEAN + INSTANCE_SWAP

### Mapeamento de Button CalcMed
```
CalcMed Button variants:
  Color: Primary, Ghost, Text, Discrete, Google, Apple, Danger (7)
  Size: sm(36px), md(48px), lg(56px) (3)
  State: Default, Hover, Pressed, Disabled (4)

Properties:
  Label (TEXT): "Button text"
  Show Left Icon (BOOLEAN): true/false
  Show Right Icon (BOOLEAN): true/false
  Left Icon (INSTANCE_SWAP): Phosphor icon
  Right Icon (INSTANCE_SWAP): Phosphor icon
  Loading (BOOLEAN): show spinner
  Full Width (BOOLEAN): fill container
```
