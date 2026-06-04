# PRD — IA do CalcMed (Sistema de Respostas Clínicas)

> **Status:** protótipo P0 concluído e em validação · **Autor:** time de produto/design · **Data:** 2026-06-04
> **Destino:** Product Owner · **Plataforma:** mobile-first (frame 390px), React + Vite
> **Docs irmãos:** `docs/ia-response-system.md` (spec técnico do renderer) · `docs/figma-handoff-plan.md` (plano de passagem pro Figma)

---

## 1. Sumário executivo

A **IA do CalcMed** é um assistente clínico conversacional para uso **no plantão**. Não é um chatbot
genérico: é uma camada que transforma uma pergunta clínica (dose, conduta, interpretação de exame,
protocolo, comparação, resumo) em uma **resposta estruturada e acionável** — renderizada com os
componentes do Design System, não com texto corrido.

O diferencial é o **AI Response System**: um contrato `payload estruturado → renderer → UI` em que
cada resposta é uma lista ordenada de **blocos tipados** (dose, tabela, checklist, alerta, seletor de
contexto, etc.). Isso garante respostas consistentes, escaneáveis e seguras — com a mesma linguagem
visual do resto do app.

Neste documento: visão, escopo, requisitos, **arquitetura funcional**, e o **mapa completo de
cenários e estados** do protótipo atual (P0).

---

## 2. Problema & oportunidade

**Problema.** No plantão, o médico precisa de respostas clínicas **rápidas, confiáveis e objetivas**
(uma dose, uma conduta, a leitura de um exame). As fontes hoje são lentas (buscar em PDF/protocolo),
fragmentadas (apps separados por cálculo) ou arriscadas (chatbots genéricos que respondem texto
corrido, sem rastreabilidade e sem o tom clínico correto).

**Oportunidade.** O CalcMed já tem o conteúdo clínico (calculadoras, protocolos, escores) e um Design
System maduro. Plugar uma camada conversacional que **entende a intenção** e responde com os
**componentes clínicos já existentes** entrega velocidade + consistência + segurança — algo que um
chatbot genérico não consegue.

---

## 3. Visão do produto

> "Pergunte como você pensa no plantão; receba uma resposta que você pode **agir agora** — dose,
> conduta e o próximo passo — com a mesma confiança e linguagem do CalcMed."

Princípios:
- **Acionável, não enciclopédico.** A resposta leva à conduta, não a um textão.
- **Estruturada, não corrida.** Blocos tipados (dose, tabela, checklist) em vez de markdown solto.
- **Apoio, não substituição.** Quem decide é o médico; a IA organiza o raciocínio.
- **Mesma língua do DS.** Zero linguagem visual paralela; tudo em tokens/componentes existentes.
- **Segura por padrão.** Avisos de 1º acesso, sem dados que identifiquem o paciente, validação no
  protocolo do serviço.

---

## 4. Personas & contexto de uso

| Persona | Contexto | Necessidade central |
|---|---|---|
| **Plantonista (emergência/UTI)** | Beira-leito, paciente instável, tempo curto, uma mão no celular | Dose/conduta correta em segundos, sem navegar menus |
| **Residente** | Plantão supervisionado, dúvida pontual + vontade de entender | Resposta rápida + camada de "por quê" (aprendizado) |
| **Médico de enfermaria/PS** | Ritmo alto, muitos pacientes | Interpretar exame, resumir caso para evolução/passagem |

**Contexto físico:** mobile, uma mão, ambiente com pressa e ruído, possível baixa conectividade.
Implicações de design: alvos de toque generosos, leitura escaneável, latência percebida baixa
(streaming), estados de erro claros.

---

## 5. Objetivos & métricas de sucesso

| Objetivo | Métrica (a instrumentar) | Alvo inicial |
|---|---|---|
| Resposta rápida e acionável | Tempo até primeira resposta acionável | < 3 s percebido (streaming cobre latência) |
| Confiança/qualidade | % de respostas com 👍 / 👎 | 👍 ≥ 80% |
| Descoberta de capacidade | % de sessões que usam ≥ 1 sugestão inicial | ≥ 50% |
| Reaproveitamento | nº de cópias (dose/resumo) por sessão | crescente |
| Continuidade | profundidade média da conversa (turnos) | ≥ 2 |
| Segurança | % de 1º acesso que conclui o onboarding (CTA) | 100% (sheet bloqueante) |

> Telemetria ainda **não instrumentada** no protótipo (P0). Ver §15.

---

## 6. Escopo

### 6.1 P0 — entregue no protótipo (este documento)
- Entrada direta em **nova conversa** ao abrir a IA.
- **Sugestões iniciais** curadas em faixa horizontal rolável.
- **Chat com streaming** (resposta revelada progressivamente) + **Parar** + **Continuar** + **Regenerar**.
- **Respostas estruturadas** (AI Response System) com blocos tipados.
- **Ações por mensagem:** copiar resposta, 👍/👎, regenerar.
- **Copiar por bloco** (dose, texto pronto) com micro-interação de confirmação.
- **Histórico** de conversas (acesso secundário) com composer para iniciar nova.
- **Editar/reenviar** a última pergunta.
- **Onboarding de 1º acesso** (BottomSheet bloqueante) + "rever avisos".
- **Composer multilinha** (Enter envia, Shift+Enter quebra linha).
- **Dark mode** (via escopo `.modo-escuro`), **a11y** (foco, alvos, leitor de tela), **tokens DS** (zero hardcode).

### 6.2 P1 — backlog (orquestração) — fora do P0, priorizar depois
- **Deep-link das ações** para calculadoras/protocolos reais (ex.: "Calcular dose por peso" abre a calc).
- **Contexto de paciente / memória de peso** entre turnos.
- **Classificação de intenção real** (backend de NLU no lugar do roteiro).
- **Telemetria/analytics** dos eventos de §15.

### 6.3 Fora de escopo (agora)
- Geração de conteúdo clínico livre/aberto (a IA responde dentro do repertório clínico curado).
- Integração com prontuário eletrônico (EHR).
- Multiusuário/colaboração; conta/login.

---

## 7. Arquitetura funcional — AI Response System

> Spec técnico completo em `docs/ia-response-system.md`. Resumo funcional para o P.O.:

**Pipeline:** `entrada (texto ou ação) → classificação de intenção → payload estruturado → AIResponseRenderer → UI`.

Uma **resposta** = um objeto com:
- `intent` (dose, triagem, exame, comparação, protocolo, crítico, aprendizado, resumo, operacional, ambígua)
- `risk_level` (baixo/médio/alto — afeta o realce visual)
- `title` / `context` (cabeçalho da resposta)
- `blocks[]` — **lista ordenada de blocos tipados** (o miolo)
- `actions[]` — chips de continuidade (próximo passo)

**Taxonomia de blocos (12+):**

| Bloco | Função | Componente DS |
|---|---|---|
| `primary_action` | ação/condução principal destacada | PrimaryAction |
| `dose` | dose objetiva (valor + unidade + via) | DoseBlock (+ DoseDisplay) |
| `table` | dados tabulares | Table |
| `interpretation` | tabela + leitura clínica + próximos passos | InterpretationBlock |
| `checklist` | itens acionáveis com check | ChecklistBlock |
| `alert` | risco/atenção destacado | AlertCard |
| `context_selector` | pergunta de desambiguação (ramifica a conversa) | ContextSelector |
| `copyable` | texto pronto p/ reaproveitar (evolução, WhatsApp) | CopyableBlock |
| `expandable` | detalhe opcional recolhível | ExpandableSection |
| `stepper` | protocolo passo-a-passo | ProtocolStep |
| `limitation` | nota de limitação/validação | LimitationNote |
| `chips` | sugestões de continuidade | SuggestionChips |
| `text` / `heading` / `list` / `divider` | formatação rica (negrito, hierarquia, ícone) | renderer interno |

Esta taxonomia é **a fonte de verdade** para os componentes que precisam existir no Figma (ver
`figma-handoff-plan.md`).

---

## 8. Requisitos funcionais (RF)

### 8.1 Entrada & navegação
- **RF-01** Ao abrir a aba IA, abrir **sempre em uma conversa nova** (não na última).
- **RF-02** Header da IA é variante do **ProtocolHeader** (mesmo das centrais de urgência): voltar (←) + título "IA · CalcMed" + subtítulo + ação à direita (relógio = histórico).
- **RF-03** O **histórico** é acesso secundário (ícone de relógio no header). Lista conversas (nome + data), abre uma conversa, e tem **composer próprio** para iniciar nova.
- **RF-04** Apagar conversa é **reversível** (toast "Desfazer", ~5s, restaura na posição original).

### 8.2 Composer
- **RF-05** Campo **multilinha** que cresce de 1 a ~5 linhas (depois rola). **Enter envia · Shift+Enter quebra linha** (respeita IME).
- **RF-06** Botão **enviar** habilita só com texto; ancora na base ao crescer.
- **RF-07** Durante "pensando"/streaming, o enviar vira **Parar**.

### 8.3 Sugestões iniciais
- **RF-08** No estado vazio, exibir **faixa horizontal rolável** de sugestões curadas (poucas, alto valor), cada uma com ícone do DS. Some ao iniciar a conversa.
- **RF-09** As sugestões cobrem capacidades distintas: dose · conduta · exame · comparação · protocolo · resumo.

### 8.4 Resposta & streaming
- **RF-10** A resposta é **revelada progressivamente** (streaming, efeito de digitação). Progresso é efêmero (não persiste cru).
- **RF-11** **Parar** congela a resposta no ponto atual e a marca como **"Resposta interrompida"** com ação **"Continuar"** (retoma do ponto exato).
- **RF-12** A resposta é renderizada **full-width** (variante `plain`), sem "cardzão" agrupador; os blocos internos dão a estrutura.
- **RF-13** Seletores de contexto, chips e ações **continuam a conversa** (geram novo turno).

### 8.5 Ações por mensagem
- **RF-14** Rodapé de cada resposta: **copiar resposta inteira**, **👍/👎**, **regenerar** (só na última).
- **RF-14.1** Tocar **👍/👎** abre um **BottomSheet de feedback** (DS): chips de motivo (multi-seleção; conjuntos distintos para útil/não-útil) + texto livre opcional + aviso "sem dados do paciente". O sinal binário vira retorno estruturado (não é validação clínica).
- **RF-15** **Copiar** mostra micro-interação (ícone → check → volta) e só confirma em **cópia real**.
- **RF-16** Em **bloco-card** (ex.: dose), o copiar é **flutuante no topo-direito do card** (não embaixo), com espaçamento que não quebra o conteúdo.
- **RF-17** **Editar** a última pergunta: devolve o texto ao composer e remove o último par (reformular e reenviar).

### 8.6 Onboarding & segurança
- **RF-18** No **1º acesso**, exibir BottomSheet **bloqueante** (só fecha pelo CTA) com: o que é a IA + 3 avisos (quem decide é você · confirme antes de aplicar · nada que identifique o paciente).
- **RF-19** "Sobre a IA · avisos" reabre os avisos a qualquer momento (não bloqueante).

### 8.7 Histórico & persistência
- **RF-20** Conversas persistem localmente (localStorage). Card mostra **só nome + data**.
- **RF-21** Estado efêmero (streaming/pending) **nunca** persiste; sanitização de dados legados no mount.

---

## 9. Requisitos não-funcionais (RNF)

- **RNF-01 · Design System:** 100% sobre tokens e componentes existentes. **Zero hardcode** de cor/fonte/espaçamento. Nenhum token novo para caso pontual.
- **RNF-02 · Proximidade (Gestalt):** espaçamento expressa agrupamento (par pergunta↔resposta junto; título↔conteúdo; grupos distintos respiram mais). Ver `CLAUDE.md` §1.
- **RNF-03 · App-shell:** header e composer fixos (`flex-shrink:0`); só a área de conteúdo rola.
- **RNF-04 · Acessibilidade:** alvos de toque adequados (ações 40px, destrutivo 44px); foco visível (WCAG 2.4.7); `aria-busy` no streaming (não spamma leitor de tela); `prefers-reduced-motion` respeitado.
- **RNF-05 · Dark mode:** suportado via escopo `.modo-escuro` (tokens base remapeados; cascata automática).
- **RNF-06 · Performance percebida:** streaming cobre a latência; sem thrash de localStorage (uma escrita só ao parar).
- **RNF-07 · Copy:** tom clínico, direto, humano; **não** soar como IA genérica; sem quebrar a 4ª parede.

---

## 10. Mapa de cenários (grafo de conversa completo)

> Fonte: roteiro `src/features/ia/iaData.js`. No P0 a classificação é **scriptada** (heurística
> `matchText` + tokens). Todos os caminhos resolvem (zero beco sem saída).

### 10.1 Pontos de entrada (sugestões iniciais)
1. **dose de adrenalina?** → `q:adrena`
2. **paciente hipotenso** → `q:hipo`
3. **interpreta uma gasometria** → `q:gaso`
4. **noradrenalina ou dobutamina?** → `q:noradobu`
5. **protocolo de PCR** → `proto:pcr`
6. **resume pra evolução** → `q:resumo`

Entrada por **texto livre** (heurística `matchText`): adrenalina→`q:adrena`; "K 7"/hipercalemia→`crit:k`;
"explica sepse"→`learn:sepse`; protocolo/ACLS/parada→`proto:pcr`; noradrenalina+dobutamina→`q:noradobu`;
gaso/pH/HCO₃/lactato/ânion→`q:gaso`; hipotensão/choque/PAM→`q:hipo`; resume/evolução→`q:resumo`;
sem match → `FALLBACK` ("Não consegui interpretar").

### 10.2 Grafo (nó → ramificações)

**A. Dose de adrenalina** — `q:adrena` *(desambiguação)*
- `→ adrena:pcr` (Adrenalina na PCR, adulto) — ações: *Ver ACLS* (`stub:tool`), *Dose pediátrica* (`adrena:ped`)
- `→ adrena:ana` (Anafilaxia **adulto**) — ação: *Refratário → infusão* (`adrena:choque`) · *(removido o atalho "Dose pediátrica" que levava à dose de PCR — correção de segurança A3)*
- `→ adrena:choque` (Infusão no choque) — ação: *Comparar com noradrenalina* (`q:noradobu`)
- `→ adrena:ped` (PCR pediátrica) — ações: *Dose adulto* (`adrena:pcr`), *Protocolo de PCR* (`proto:pcr`)

**B. Paciente hipotenso** — `q:hipo` *(triagem guiada)*
- `→ hipo:sepse` (Choque séptico provável) — ações: *Calcular dose por peso* (`stub:tool`), *Copiar conduta* (`q:resumo`)
- `→ hipo:sangramento` (Choque hemorrágico) — ações: *Calcular dose por peso* (`stub:tool`), *Copiar conduta* (`q:resumo`)
- `→ hipo:cardio` (Choque cardiogênico) — ações: *Comparar nora × dobuta* (`q:noradobu`), *Copiar conduta* (`q:resumo`)
- `→ adrena:ana` (Anafilaxia — reaproveita o nó de dose)
- `→ hipo:naosei` (sem hipótese fechada) — chips do **diferencial** (não funila mais p/ sepse · correção A4): *Séptico* (`hipo:sepse`), *Hemorrágico* (`hipo:sangramento`), *Cardiogênico* (`hipo:cardio`), *Interpretar gasometria* (`q:gaso`)

**C. Gasometria** — `q:gaso` *(interpretação)* — chips: *Calcular Winter*/*Ânion gap* (`stub:tool`), *Relacionar com sepse* (`hipo:sepse`)

**D. Noradrenalina × Dobutamina** — `q:noradobu` *(comparação · tabela)* — ações: *Paciente em choque* (`q:hipo`), *Resumir conduta* (`q:resumo`)

**E. Resumo** — `q:resumo` *(texto pronto · copyable, variações de formato)* — ações: *Conduta no choque* (`q:hipo`), *Interpretar gasometria* (`q:gaso`)

**F. Hipercalemia crítica** — `crit:k` *(crítico · alerta)* — ações: *Doses por peso* (`stub:tool`), *Copiar conduta* (`q:resumo`)

**G. Protocolo PCR** — `proto:pcr` *(desambiguação de ritmo)*
- `→ proto:pcr:choca` (FV/TV sem pulso) — ação: *Dose de adrenalina* (`adrena:pcr`)
- `→ proto:pcr:naochoca` (AESP/Assistolia) — ação: *Dose de adrenalina* (`adrena:pcr`)

**H. Aprendizado** — `learn:sepse` *(camadas, headings com ícone)* — chips: *Conduta no plantão* (`hipo:sepse`), *Comparar vasopressores* (`q:noradobu`)

**Especiais:**
- `stub:tool` → **TOOL_STUB** ("Cálculo por peso") → chips: sugestões iniciais. *(No produto P1, abre a calculadora real.)*
- sem match → **FALLBACK** ("Não consegui interpretar") → chips: sugestões iniciais.

### 10.3 Cobertura de blocos por cenário (amostra)
| Cenário | Blocos exercitados |
|---|---|
| `adrena:pcr` | heading/text, **dose**, alert, chips |
| `q:hipo` / `hipo:naosei` | **context_selector**, text |
| `hipo:sepse` | **checklist**, text, actions |
| `q:gaso` | **interpretation** (table + leitura + chips), limitation |
| `q:noradobu` | **table**, text |
| `q:resumo` | **copyable** (variações), limitation |
| `crit:k` | **alert** (critical), checklist, actions |
| `proto:pcr:*` | **stepper**, text, actions |
| `learn:sepse` | heading(ícone), text, divider, list, **expandable**, chips, limitation |

→ O protótipo exercita **todos** os tipos de bloco — base de evidência para o inventário de componentes do Figma.

---

## 11. Mapa de estados & micro-interações

### Tela CHAT
| Estado | Gatilho | Feedback / saída |
|---|---|---|
| Vazio | abrir IA / nova conversa | saudação contextual + faixa de sugestões |
| Digitando | texto no composer | enviar habilita; textarea cresce |
| Pensando | enviar | "digitando…" (3 pontos) + botão **Parar** |
| Streaming | resposta chega | revela progressivo; **Parar** disponível; `aria-busy` |
| Interrompida | Parar no meio | marca "Resposta interrompida" + **Continuar** |
| Cancelada | Parar no "pensando" | marca "Geração cancelada" + **Tentar de novo** |
| Concluída | fim do stream | ações da mensagem (copiar/👍/👎/regenerar) |
| Conversa longa | scroll p/ cima | botão flutuante **descer** |
| Copiado | clicar copiar | ícone → **check** → volta (cópia real) |
| Erro de cópia | clipboard falha | **sem** check (não mente sucesso); toast de erro disponível |

### Tela HISTÓRICO
| Estado | Gatilho | Feedback / saída |
|---|---|---|
| Vazio | sem conversas | empty state + composer "começar" |
| Com conversas | — | lista (nome + data) + composer |
| Apagando | lixeira | remove + toast **Desfazer** (~5s) |
| Sobre a IA | link no rodapé | reabre avisos (não bloqueante) |

### Onboarding
| Estado | Comportamento |
|---|---|
| 1º acesso | BottomSheet **bloqueante** (só fecha pelo CTA "Entendi, começar") |
| Rever avisos | mesmo conteúdo, **dispensável** (X/backdrop) |

### Micro-interações catalogadas
- Copiar → check → volta (cross-fade + pop; `prefers-reduced-motion` desativa o pop).
- Streaming (reveal por unidades: palavras em texto, itens em lista, 1 por bloco).
- Reveal escalonado dos blocos na variante `plain` (sensação de "montar" a resposta).
- Chips/seletor com estado de toque; sugestão com `:active`.
- Toast com entrada suave; "Desfazer" com janela estendida.

---

## 12. UX writing & tom de voz

- **Tom:** clínico, direto, humano. Frases curtas. Sem "calor" artificial de assistente.
- **Exemplos vigentes:** saudação "Bom dia/tarde/noite/madrugada" + "Como posso ajudar no plantão?"; placeholder "Dose, conduta, exame…"; feedback "Anotado."; erro/ambíguo título "Não consegui interpretar" + "Reformule em uma linha. Funciono melhor com dose, conduta, exame, protocolo ou resumo — por exemplo:".
- **Proibições:** quebrar a 4ª parede ("este é um sistema de demonstração…"), prometer o que não cumpre, jargão de IA genérica.
- **Nota de limitação:** curta e não repetida verbatim em toda resposta ("Confira no protocolo do seu serviço.").

---

## 13. Edge cases & tratamento de erro

- **Sem match de intenção** → FALLBACK gracioso (não erro técnico).
- **Sair da conversa durante o streaming** → encerra o streaming visual; a resposta reaparece completa (sem travar o app).
- **Parar durante "pensando"** (antes do 1º token) → cancela a geração; sem resposta órfã.
- **Apagar conversa ativa** → volta para "nova conversa".
- **Clipboard indisponível** (contexto não-seguro) → não confirma cópia; toast de erro disponível.
- **Dados legados** (pending de versões antigas) → sanitizados no mount.
- **Duplo-envio/spam** → bloqueado por `busy` (exceto iniciar **nova** conversa pelo histórico).

---

## 14. Decisões de produto registradas
- Resposta no chat é **full-width** (`plain`), não encaixotada — evita o anti-pattern do "cardzão".
- Balão do usuário **cinza sóbrio** (não cor de destaque).
- Ações **abaixo** da resposta (não ao lado).
- Sugestões em **faixa horizontal** (não chips empilhados que quebram).
- Onboarding como **BottomSheet do DS** (não modal ad-hoc), com **ícones** (não emoji).
- **Badge de intenção é interno** (taxonomia nossa) — não aparece na UI do chat; só na galeria do DS (`card`).
- **Ícone da IA** = sparkle (`ia`); o glyph anterior era um sol, idêntico ao modo-claro.
- **Streaming pausado** (~2–3s "pensando" + revelação gradual ~48ms) — sensação de raciocínio; dose/crítico mais rápidos.
- **Feedback do 👍/👎** vira BottomSheet de motivos (não é validação clínica).
- **Correções de segurança clínica** (revisões 3-óticas): anafilaxia rotulada **adulto** + remoção do atalho para dose de **PCR** (A3); "não sei" oferece o **diferencial** em vez de funilar para sepse (A4).

> **Revisões de QA realizadas:** 3 revisões profundas (usabilidade · acessibilidade WCAG ·
> segurança clínica) + 2 auditorias fundacionais (categorização/contrato · renderer/componentes).
> **Correções aplicadas (P0→P2):** render robusto (ErrorBoundary por bloco, `rich()` type-safe),
> cópia clínica (ressalva + rótulos), categorização (word-boundary, conduta>laboratório, hipercalemia),
> grafo sem becos, guard anti-double-tap, "parar no pensando" recuperável, delay por intenção com rótulo
> de estado, e a11y (contraste AA dos cinzas, alvo 44px da lixeira, "Parar" no dark, live-region de
> "Copiado", reduced-motion). Pendências menores conhecidas: ContextSelector sem estado de seleção
> visual, fabricação de dados no resumo (M6) — backlog.

---

## 15. Telemetria a instrumentar (P1)
Eventos sugeridos: `ia_open`, `ia_starter_tap{label}`, `ia_send{intent}`, `ia_stream_stop`,
`ia_continue`, `ia_regenerate`, `ia_copy{scope}`, `ia_feedback{value}`, `ia_edit`, `ia_history_open`,
`ia_conv_delete`/`ia_conv_undo`, `ia_onboarding_complete`, `ia_fallback`.

---

## 16. Backlog P1 — orquestração (resumo)
1. **Deep-link de ações** → calculadoras/protocolos reais.
2. **Contexto de paciente** (peso/idade) com memória entre turnos.
3. **Classificação de intenção real** (NLU/backend) substituindo o roteiro.
4. **Telemetria** (§15) + painel de qualidade (👍/👎).

---

## 17. Glossário
- **AI Response System:** contrato payload→renderer→UI com blocos tipados.
- **Bloco:** unidade tipada de uma resposta (dose, tabela, checklist…).
- **Intent:** intenção classificada da pergunta (dose, exame, protocolo…).
- **Starter:** sugestão inicial curada.
- **Plain vs card:** variante de resposta (chat full-width vs. exemplo encaixotado na doc do DS).
