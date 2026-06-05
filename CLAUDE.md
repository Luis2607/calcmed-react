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
- **Sem travessão (—).** O em-dash é "cara de IA". Prefira ponto, vírgula ou
  dois-pontos e **frases curtas**. Texto longo deve ser **quebradinho**
  (parágrafos curtos, fácil de escanear), não blocões corridos. (En-dash `–`
  em faixas numéricas clínicas, ex.: "3–5 min", é permitido.)

## 6. Entrega e verificação

- **Tudo vai direto para produção.** Política do dono (Luis): cada mudança
  concluída é mergeada em `main` (sem aprovação manual a cada ciclo) e segue
  pro deploy. Não acumular trabalho em branch esperando review.
- `npm run build` deve passar **antes** do merge.
- Após o merge, confirmar que o deploy ficou READY na Vercel e que o hash do
  bundle servido em `calcmed-react.vercel.app` bate com o `dist/` local.

## 7. Documentação viva (o "cérebro") — SEMPRE atualizar

- **🧠 Mapa de tudo:** [`docs/00-index.md`](docs/00-index.md) é a **home do wiki** (todos os docs com
  status VIVO/PROCESSO/HISTÓRICO + atalhos de navegação). Comece por lá.
- **Regra do dono (Luis):** ao mexer em **qualquer coisa** de **qualquer feature**
  (IA *ou* as 5 centrais de urgência — UI, fluxo, componente, cálculo, copy, token,
  comportamento), **atualize a documentação na mesma entrega** — nunca deixar o doc
  desatualizado. O objetivo é nunca perder info e tornar a passagem pro Figma tranquila.
- **Cérebro da IA** (em sincronia com o código):
  - `docs/prd-ia-calcmed.md` — PRD + cenários (para o P.O.).
  - `docs/figma-handoff-plan.md` — plano/inventário de passagem pro Figma.
  - `docs/ia-response-system.md` — spec técnico do AI Response System.
- **Cérebro das centrais de urgência** (um PRD por central + o plano de Figma):
  - `docs/prd-cad.md` · `docs/prd-sca.md` · `docs/prd-sepse.md` · `docs/prd-pcr.md` ·
    `docs/prd-avc.md` — PRDs (fluxo, estados, cálculos, segurança clínica).
  - `docs/figma-handoff-centrais.md` — plano/inventário de passagem pro Figma das centrais.
- Mudou um componente/cenário/cálculo/copy → reflita no(s) doc(s) da feature **antes do
  merge** (no que couber). Tratar doc desatualizado como bug.
