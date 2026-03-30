# Guia Rapido: Construir Componentes CalcMed no Figma

## Objetivo
Criar cada componente como Component Set no Figma, pronto para montar telas.
Seguir padrao Flowbite: variantes + properties + zero hardcoded + auto-layout.

---

## Ordem de Build (prioridade para telas)

### FASE 1 — Atomos essenciais para telas
1. **Botoes** (7 variants x 3 sizes x 4 states = 84 variantes)
2. **Inputs** (3 sizes x 6 states x 2 dark = 36 variantes)
3. **Tags e Chips** (6 domains x 2 sizes x 2 dark = 24 variantes)
4. **Alertas** (5 niveis x 2 dark = 10 variantes)

### FASE 2 — Organismos para telas
5. **Cards** (4 estados: free, premium, teste, assinante x 6 domains)
6. **Bottom Nav** (5 tabs, active/inactive states)
7. **Sidebar** (web mode, com nav items)
8. **Home Header** (avatar + greeting + search + toggle + bell)

### FASE 3 — Templates para telas
9. **Auth Layout** (mobile + web split-screen)
10. **App Layout** (mobile frame + web frame)
11. **Telas completas** (usando instances dos componentes)

---

## Template de Codigo para Criar Component Set

```javascript
// === SETUP ===
const page = figma.root.children.find(p => p.name === 'NOME_PAGINA');
await figma.setCurrentPageAsync(page);

// Carregar fontes
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

// Buscar variaveis
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const primCol = cols.find(c => c.name === 'Primitivos');
const semCol = cols.find(c => c.name === 'Semanticos');

async function getVar(col, name) {
  for (const vid of col.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(vid);
    if (v && v.name === name) return v;
  }
  return null;
}

// Buscar paint/text styles CalcMed
const paintStyles = await figma.getLocalPaintStylesAsync();
const textStyles = await figma.getLocalTextStylesAsync();
const ps = (name) => paintStyles.find(s => s.name === name)?.id;
const ts = (name) => textStyles.find(s => s.name === name)?.id;

// === CRIAR VARIANTES ===
const variants = [];

// Para cada combinacao de Color x Size x State:
for (const color of ['Primary', 'Ghost', 'Danger']) {
  for (const size of ['sm', 'md', 'lg']) {
    for (const state of ['Default', 'Hover', 'Pressed', 'Disabled']) {
      const comp = figma.createComponent();
      comp.name = `Color=${color}, Size=${size}, State=${state}`;

      // Auto-layout
      comp.layoutMode = 'HORIZONTAL';
      comp.primaryAxisSizingMode = 'AUTO';
      comp.counterAxisSizingMode = 'AUTO';
      comp.primaryAxisAlignItems = 'CENTER';
      comp.counterAxisAlignItems = 'CENTER';

      // Vincular spacing (via variaveis Primitivos/espaco)
      const padV = await getVar(primCol, `espaco/${size === 'sm' ? 2 : size === 'md' ? 3 : 4}`);
      const padH = await getVar(primCol, `espaco/${size === 'sm' ? 4 : size === 'md' ? 5 : 6}`);
      const gap = await getVar(primCol, 'espaco/2');
      if (padV) { comp.setBoundVariable('paddingTop', padV); comp.setBoundVariable('paddingBottom', padV); }
      if (padH) { comp.setBoundVariable('paddingLeft', padH); comp.setBoundVariable('paddingRight', padH); }
      if (gap) comp.setBoundVariable('itemSpacing', gap);

      // Vincular radius
      // (usar variavel se existir, senao criar)
      comp.cornerRadius = 12; // r-lg

      // Vincular fill (cor de fundo) via Color Style
      const fillStyleName = color === 'Primary' ? 'CalcMed/interativo/primario'
        : color === 'Ghost' ? 'CalcMed/fundo/elevado'
        : 'CalcMed/retorno/critico';
      await comp.setFillStyleIdAsync(ps(fillStyleName));

      // Ajustar para states
      if (state === 'Disabled') comp.opacity = 0.38;
      if (state === 'Hover') comp.opacity = 0.9;
      if (state === 'Pressed') comp.opacity = 0.8;

      // Criar texto
      const text = figma.createText();
      text.characters = 'Button';
      await text.setTextStyleIdAsync(ts(
        size === 'sm' ? 'CalcMed/legenda'
        : size === 'md' ? 'CalcMed/rotulo-campo'
        : 'CalcMed/corpo'
      ));
      await text.setFillStyleIdAsync(ps(
        color === 'Primary' ? 'CalcMed/texto/sobre-destaque'
        : 'CalcMed/texto/padrao'
      ));
      comp.appendChild(text);

      variants.push(comp);
    }
  }
}

// === COMBINAR COMO VARIANTES ===
const componentSet = figma.combineAsVariants(variants, page);
componentSet.name = 'Button';

// === ADICIONAR COMPONENT PROPERTIES ===
componentSet.addComponentProperty('Label', 'TEXT', 'Button');
componentSet.addComponentProperty('Show Left Icon', 'BOOLEAN', true);
componentSet.addComponentProperty('Show Right Icon', 'BOOLEAN', false);

// === POSICIONAR ===
// (encontrar area livre na pagina)
let maxX = 0;
for (const child of page.children) {
  if (child.x + child.width > maxX) maxX = child.x + child.width;
}
componentSet.x = maxX + 100;
componentSet.y = 0;

return { id: componentSet.id, variantCount: variants.length };
```

---

## Mapeamento de Estilos CalcMed para Componentes

### Botoes
| Variante | Fill Style | Text Style | Text Color Style |
|---|---|---|---|
| Primary | interativo/primario | rotulo-campo (md) | texto/sobre-destaque |
| Ghost | fundo/elevado | rotulo-campo | texto/padrao |
| Text | (sem fill) | rotulo-campo | texto/link |
| Discrete | fundo/elevado | legenda | texto/terciario |
| Danger | retorno/critico | rotulo-campo | texto/sobre-destaque |
| Google | fundo/superficie | rotulo-campo | texto/padrao |
| Apple | fundo/padrao | rotulo-campo | texto/sobre-destaque |

### Tamanhos de Botao
| Size | Height | Padding V | Padding H | Text Style | Icon size |
|---|---|---|---|---|---|
| sm | 36px | espaco/2 (8) | espaco/3 (12) | legenda (12px) | 16px |
| md | 48px | espaco/3 (12) | espaco/5 (20) | rotulo-campo (14px) | 20px |
| lg | 56px | espaco/4 (16) | espaco/6 (24) | corpo (16px) | 24px |

### Input Fields
| Parte | Fill Style | Text Style | Border |
|---|---|---|---|
| Container | fundo/superficie | - | borda/padrao |
| Label | - | rotulo-campo | - |
| Placeholder | - | corpo (opacity 0.5) | - |
| Value | - | corpo | - |
| Helper | - | legenda | texto/terciario |
| Error state | - | legenda | retorno/critico |
| Focus state | - | - | interativo/primario |

### Cards (Feature)
| Estado | Fill Style | Border | Tag Style |
|---|---|---|---|
| Free | fundo/cartao | borda/sutil | texto-badge |
| Premium | fundo/cartao (opacity) | borda/sutil | texto-badge + lock icon |
| Teste | fundo/cartao | interativo/primario | texto-badge + "TESTE" |
| Assinante | fundo/cartao | borda/sutil | texto-badge |

### Alertas (5 niveis)
| Nivel | Fill Style | Icon | Text Color |
|---|---|---|---|
| Preto (critico) | fundo/padrao | WarningCircle | texto/sobre-destaque |
| Verde (seguro) | retorno/sucesso-fundo | CheckCircle | retorno/sucesso |
| Vermelho (perigo) | retorno/critico-fundo | XCircle | retorno/critico |
| Ambar (atencao) | retorno/atencao-fundo | Warning | retorno/atencao |
| Cinza (info) | fundo/elevado | Info | texto/secundario |

---

## IDs Rapidos (copiar/colar)

### Paint Styles CalcMed
```javascript
const PS = {
  fg:        'S:36619d4c3a4028a6cfd0f2e6ccd645ee175f8e7d,',
  fg2:       'S:3e49550befef22c875cfa601aea7567a6bcd6ff9,',
  fg3:       'S:45ab52db2db3763e805e18fe1fd4026b8b82c392,',
  fgDisabled:'S:408be3a911c4cbfcc8a87a1421e90e11069abe97,',
  fgOn:      'S:0aaee254b350e63ac8bbe1b1eb79dde2297cbd7f,',
  link:      'S:b436b91bd6258d9cf1b2676452afc1ec637199a6,',
  bgPad:     'S:4a47f5a5e49a3c25671cf3f28dbedfecdd2c7b66,',
  bgSurf:    'S:97f73544dc06a54f472d7e4804d1d2cde05e1472,',
  bgCard:    'S:90a68bd114913846b6b63ea811cb66c2053b82e3,',
  bgElev:    'S:467b0b24c20d38091f461abf5f4a4d3a4882e536,',
  borda:     'S:58d8c2e9fcb7afe1c6f53e361ecfc0430a93fd6a,',
  bordaSutil:'S:93bca013068858c826e80c8fdf92605bca4ad960,',
  interativo:'S:94a0bcc65e8b9172343fe0eb2c47ae89393cea92,',
  sucesso:   'S:813d15e7839631ec62a657939a988febd93ff9f3,',
  critico:   'S:f6fb9865bc0fdb100c65b2b7a9af51a5d2225d90,',
  atencao:   'S:3d8468f1fc7405ddfd84562143419f4b6b36674c,',
};
```

### Text Styles CalcMed
```javascript
const TS = {
  titPag:     'S:93395e5cec21ad5de0740b9894013af433996abe,',
  titSecao:   'S:28e1305c888e3a3aa157b21dbffccb2db1de9b1a,',
  subtitulo:  'S:4658446f439b4d0b193a2db86c2ea66c1f4433bb,',
  nomeDroga:  'S:a4b05c2547a5e3075a510dcb8b2ebb36e11b1c95,',
  alertaTit:  'S:7b652636775e7e9d73826e3c72d3100e38024084,',
  alertaCorpo:'S:f09e9410c8c903a3ab61ad7a825964a2a7db8945,',
  corpo:      'S:c0a1f5a01d89ef55ea795dafef76ffe0b968ba10,',
  corpo2:     'S:784b8ea95e7d3aebc625d36346d3f552b644002e,',
  rotCampo:   'S:5447acd7c26145bcdb4d172f9473cc570c106948,',
  valorCampo: 'S:13dd472992c91a33b7ab625b623448bb3cb2456c,',
  valorMono:  'S:82ec1dff5efb61b2efac17972b4fdb458f9442fd,',
  rotNav:     'S:3bc30d33cc4afd9f1d0af4b4c4d74287e210fb0f,',
  badge:      'S:6d38b3b46e84b372e9db0e4b775e64d46377250e,',
  legenda:    'S:49c76c926b58ed264b63dfc2ad711b5d4557ad52,',
  marca:      'S:377b28704595702f1d231d8e12d51313aabe7822,',
  doseValor:  'S:8abefd3313238dd356dd90854f820e870ec84a17,',
  doseUnid:   'S:102253c17aac700d8e22fe7d7edad786535910c4,',
  preco:      'S:929de3bba6f6c12ec5ea0eddcaa64748078a441a,',
  valorGrande:'S:01d29baecb3dc354cbc306339f5b1b051d81aa33,',
};
```

### Semantic Variable Modes
```javascript
const SEM_COLLECTION = 'VariableCollectionId:19:923';
const LIGHT_MODE = '19:1';
const DARK_MODE = '19:2';
```

### Grid Styles
```javascript
const GS = {
  celular: 'S:39fd0180e26bc1676918b028f4fc90efca6ab0ae,',
  tablet:  'S:34297ea72f00bd8513b0004ae01d603bd04ee5c7,',
  desktop: 'S:e6226ffeb7d969cdac1586866a1aa22eafb20849,',
};
```
