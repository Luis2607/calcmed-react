# CalcMed — Regras de construção (permanentes)

Estas regras valem para **tudo** que for construído ou alterado neste repo —
não são pontuais. Antes de entregar qualquer UI, verifique-as.

## 1. Escala, agrupamento e proximidade (Gestalt) — SEMPRE

Espaçamento **nunca** é uniforme por padrão. A escala deve expressar a relação
entre os elementos:

- **Mesmo grupo → mais perto. Grupos distintos → mais respiro.** A distância é
  o que comunica "isto pertence a isto".
- **Hierarquia assimétrica:** um título/rótulo liga-se ao conteúdo que
  introduz → mais ar **antes** (abre a seção), menos **depois** (vincula).
  Nunca isole um título com o mesmo gap dos demais blocos.
- **Pares lógicos ficam juntos:** pergunta↔resposta, label↔campo,
  ação↔descrição. O par tem gap menor que a distância para o próximo par.
- **Separadores (divider) são régua de seção:** dão folga; evite dupla
  separação (divider + margem grande no que vem logo após).
- Aplique o mesmo princípio à tipografia (peso/tamanho marcam nível) e ao
  alinhamento (eixos comuns agrupam).

Referência viva de como aplicar: `src/shared/components/ai/AIResponse/AIResponse.module.css`
(proximidade nos blocos) e `src/features/ia/IAScreen.module.css` (par
pergunta↔resposta no thread).

## 2. Tokens do Design System — proibido hardcode

- **Sempre** usar tokens existentes em `src/shared/styles/tokens.css`:
  cores (`--ds-*`), espaçamento (`--esp-*`, base 4), tipografia composta
  (`--ds-font-*`), raios (`--radius-*` / `--ds-r-*`).
- **Nunca** hardcodar cor, tamanho de fonte ou valor de espaçamento que tenha
  token equivalente.
- **Nunca** criar tokens novos para resolver um caso pontual. Use a escala que
  já existe. (Micro-valores sub-4px que o próprio DS já usa cru são a única
  exceção tolerada.)

## 3. Composição sobre reinvenção

- Construir sobre os componentes/átomos existentes do DS (atoms → molecules →
  organisms → overlays). Não criar linguagem visual paralela.
- BottomSheet/overlays seguem o padrão existente (ex.: `InfoSheet`), não modais
  ad-hoc.
- Ícones do `Icon` atom — **não** emoji em chrome/UI (emoji só como conteúdo
  semântico quando fizer sentido editorial).

## 4. Layout

- Telas em app-shell: header e composer/rodapé fixos (`flex-shrink:0`), só a
  área de conteúdo rola. Nada de "desfixar" no scroll mobile.

## 5. Copy

- Tom clínico, direto, humano. **Não** soar como IA genérica. Auditar a copy
  antes de entregar.

## 6. Verificação

- `npm run build` deve passar. Após merge na produção, conferir que o hash do
  bundle servido em `calcmed-react.vercel.app` bate com o `dist/` local.
