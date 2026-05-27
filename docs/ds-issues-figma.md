# Problemas do DS no Figma — catálogo para o plano futuro

Registrado durante a sincronização evidencial Figma ↔ código (2026-05-26).
Estes são problemas de **modelagem no próprio Figma** (não do código). Atacar quando
o usuário decidir fazer o saneamento do DS.

## Controles de Seleção

### 1. Radio não tem variante atômica (grave)
- **Componente:** `Radio` (128:3623).
- **Problema:** o componente "Radio" é, na verdade, uma **pílula de opção com borda**
  (COMPONENT 112×48, radius 12, borda 1px #007993 quando selecionado, fill #F1F5F9).
  O círculo real é só um sub-frame interno chamado "Indicator" (24×24).
- **Consequência:** não existe um Radio **atômico** publicado (só o círculo). Quem quiser
  o radio puro não tem como reusar; e o "Radio" entrega sempre a borda/option.
- **No código:** está mais correto — `atoms/Radio` é o círculo+label puro, e a versão com
  borda existe separada no `SheetOptionList`. Ou seja, o código já separa átomo de opção.
- **Plano:** no Figma, separar `Radio` (átomo: só Indicator+label) de `Radio Option`
  (a pílula com borda). Hoje estão fundidos.

### 2. Variante "Maior" do Checkbox sem efeito mensurável
- **Componente:** `Checkbox` (128:3664), variant `Maior` (Sim/Não).
- **Problema:** medindo `Maior=Sim` vs `Maior=Não`, o **box (24×24/r4) e o label (14 Regular)
  são idênticos**. Não ficou claro o que a variante muda (hit-area? container? gap?).
- **Status no código:** não implementado (não dá pra implementar sem saber o que muda).
- **Plano:** confirmar no Figma a intenção do "Maior" (provável: touch-target/acessibilidade)
  e então modelar como `size` no código.

### 3. Drift de stroke do Radio (menor)
- Figma Radio Indicator selecionado = stroke **1.5px** #007993; código usa **2px**.
- Não corrigido: 0,5px é imperceptível e mudar gera jump de layout entre states. Aceito como
  drift menor; revisitar se padronizar tudo em 1.5px.

## Alertas

### 4. Alert Compact (toast) não tem ação "Desfazer"
- **Componente:** `Alert Compact` (131:4093). Properties: Type=Success/Error, Show dismiss, Message.
- **Problema:** o toast só tem dismiss (X). Não há slot de **ação** (ex.: "Desfazer") — padrão
  esperado de snackbar (Material) para reverter operações em Urgência (ex.: "Evento removido · Desfazer").
- **No código:** o `molecules/Toast` foi construído com a prop `onUndo` (botão Desfazer) como
  **extensão**. Funciona, mas diverge do master do Figma.
- **Plano:** no Figma, adicionar property `Show action` + slot de texto da ação ao Alert Compact.

### 5. Drift no átomo `Icon` (critico / rodape)
- **Componente:** `atoms/Icon` (código) vs `icone/*` (Figma).
- **Problema:** no Figma `icone/critico` = **octógono** e `icone/rodape` = **nota/documento**.
  No código o átomo `Icon` desenha `critico` como **círculo** e `rodape` cai no **fallback**.
- **No código:** o `AlertCard` foi corrigido com SVG próprio (não usa o átomo), então não é afetado.
  Mas qualquer consumidor de `Icon name="critico"/"rodape"` renderiza errado.
- **Plano:** corrigir o átomo `Icon` (critico→octógono, adicionar rodape→nota) com análise de
  impacto em todos os usos antes de mexer.

### 6. Alert Card — drifts deferidos (decisão Rafael)
- **Layout:** Figma é vertical (Header[ícone+título] / corpo full-width abaixo); código é horizontal
  (ícone à esquerda). Mantido horizontal (padrão de alerta consagrado, menor risco nos 7 alertas CAD).
- **Pediatria + Dark (combo):** Figma tem fill tint escuro (#223249/#022c22/#450a0a); código usa o
  tint light pois `--retorno-*-fundo` não tem variante dark. Combo raro; gap residual.
- **Show Value (Dose+Unit) / Show Chevron:** properties do Figma não portadas (Value é redundante
  com `ResultDisplay`; Chevron sem uso atual).

## Já resolvidos nesta sincronização (referência)
- Input Filled (borda escura → neutra) e Disabled (opacity → fill cinza) alinhados ao Figma.
- Input borda dupla no foco (outline interno) removida.
- Checkbox radius 6px → 4px (Figma).
- Toggle: não existia como atom no código (só inline no HubHome) → criado `atoms/Toggle`
  grounded no Figma (51×31, on #007993 / off #F1F5F9, thumb 27).
- Dark mode: escopo `.modo-escuro` criado (tokens base remapeados, grounded no Figma).

## Família ainda não componentizada (página Controles de Seleção)
Existem no Figma, ainda **ausentes** no código (gaps, não erros):
- Toggle Tab (128:3673), Toggle Segmented (128:3688), calc/segmented-control (128:3707),
  calc/radio-group (173:11246), calc/checkbox-group (901:164669), Carousel Dots (133:9766).
- O Segmented control já existe **inline** no HubHome (Adulto/Pediatra) → candidato a extrair.
