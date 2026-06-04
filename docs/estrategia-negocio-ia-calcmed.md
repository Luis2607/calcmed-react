# CalcMed IA — Documento Estratégico de Negócio

> **Para:** rodadas com investidores / parceiros · **Versão:** 1.0 · **Data:** 2026-06-04
> **Escopo:** estratégia de produto, monetização e GTM da camada "IA do CalcMed", ancorada no produto
> real (protótipo P0 do AI Response System sobre um Design System maduro e 5 centrais de urgência já em React).
> **Docs irmãos:** `prd-ia-calcmed.md` (PRD + cenários) · `ia-response-system.md` (spec técnico) · `figma-handoff-plan.md`.
> **Disciplina de dados:** números de mercado vêm com fonte; onde não há fonte, a afirmação é qualitativa
> e marcada como tal. Faixas de preço são **ancoragem estratégica, não preço validado**. Conteúdo clínico
> do produto é ilustrativo (validação final pelo time médico).

---

## 1. Sumário executivo

A **IA do CalcMed** não é "mais um chatbot médico". É uma **camada de resposta estruturada** sobre um ativo
que já existe e funciona: o CalcMed, com cinco centrais clínicas de urgência (CAD, Sepse, PCR, AVC, SCA) e um
Design System token-first maduro. O diferencial técnico — o **AI Response System** — é um contrato
`payload estruturado → blocos tipados → renderer DS`. Em vez de texto corrido, a IA devolve **dose, tabela,
checklist, alerta, stepper de protocolo, seletor de contexto e texto copiável** — escaneável, acionável e
seguro à beira-leito.

**Tese de valor.** No plantão o médico não quer ler; quer **agir**. O produto está desenhado para o gesto real:
uma mão no celular, pressa, ruído, conectividade ruim. A resposta vem em blocos que respondem "qual dose, qual
conduta, qual próximo passo", com proveniência clínica carimbada no que é copiado para prontuário/WhatsApp e com
desambiguação ativa (a IA pergunta "PCR, anafilaxia ou choque?" antes de cuspir um número perigoso).

**Por que agora.** O Brasil tem **~635 mil médicos ativos em 2025** e projeção de ~654 mil até o fim do ano, com
**~47,7 mil residentes** (CFM/USP, Demografia Médica 2025 — fontes abaixo). O regulador acabou de cravar a
doutrina certa: a **CFM Resolução 2.454/2026** estabelece IA como **ferramenta de apoio à decisão, com
"human-in-the-loop"** e autoridade clínica final do médico — exatamente o princípio "apoio, não substituição"
que o produto já encarna. O produto foi construído dentro da regra antes de a regra apertar.

**Onde está o moat.** Não na LLM (commodity). Está em: (a) **conteúdo clínico curado** das centrais já validadas;
(b) o **renderer estruturado + Design System** que transforma qualquer backend de IA em UI clínica consistente —
difícil de copiar e fácil de defender em GTM; (c) o **loop de feedback estruturado** (👍/👎 vira motivos
categorizados, não like solto) como ativo de dados; (d) **localização e tom PT-BR de plantão** que players
globais (MDCalc, UpToDate) não priorizam.

**Pedido implícito ao investidor.** Capital para (1) trocar o roteiro scriptado por NLU/backend real com
guarda-corpos clínicos, (2) plugar os deep-links para as calculadoras/protocolos que já existem (orquestração),
e (3) instrumentar telemetria + monetizar. O risco de produto-core já foi pago: a arquitetura, o DS e o conteúdo existem.

---

## 2. Por que o CalcMed IA é bom

### 2.1 Forças reais (verificadas no código, não no pitch)

- **Resposta estruturada de verdade, não markdown maquiado.** O contrato `intent → risk_level → blocks[] →
  actions[]` está implementado: 12+ tipos de bloco tipados (`dose`, `interpretation`, `checklist`, `alert`,
  `stepper`, `context_selector`, `copyable`…), cada um mapeado a um componente do DS via `AIResponseRenderer`.
  Isso é arquitetura, não wrapper de prompt.
- **Segurança desenhada no fluxo, não só em disclaimer.** A anafilaxia é rotulada **"adulto"** e teve removido
  o atalho que levava à dose de **PCR**; "não sei o diagnóstico" oferece o **diferencial** em vez de funilar para
  sepse; o matcher usa **limites de palavra** ("noradrenalina" não dispara "adrenalina"); conduta crítica vence
  marcador laboratorial isolado.
- **Proveniência clínica no que sai do app.** `responseToText` carimba *"— Gerado pela IA do CalcMed. Confira no
  protocolo do seu serviço."* em todo texto copiado. Rastreabilidade é o que falta nos chatbots genéricos e o que
  o regulador valoriza.
- **Robustez de produção.** `BlockBoundary` por bloco (payload malformado falha sozinho, sem branquear a resposta),
  `rich()` type-safe, sanitização de estado efêmero, guard anti-double-tap, "parar no pensando" recuperável. Já
  passou por 3 revisões profundas (usabilidade, a11y WCAG, segurança clínica) + 2 auditorias fundacionais.
- **Desambiguação ativa como feature de segurança.** O `context_selector` faz a IA **perguntar antes de responder**
  quando a dose muda por contexto.
- **UX de plantão real.** Streaming com latência percebida baixa, "pensando" calibrado por intenção, alvos de toque
  generosos, dark mode, `prefers-reduced-motion`, copiar com confirmação só em cópia real. Mobile-first PT-BR.
- **Não parte do zero.** Senta sobre 5 centrais clínicas já em React e um DS com ~97 componentes auditados. A IA é
  a **camada de distribuição/interface** de um acervo que já existe.

### 2.2 Diferenciais defensáveis (vs. chatbot genérico e vs. concorrentes)

| Frente | Chatbot genérico (ChatGPT/Gemini) | MDCalc / UpToDate | **CalcMed IA** |
|---|---|---|---|
| Formato da resposta | Texto corrido, inconsistente | Calculadora isolada / artigo longo | **Blocos tipados acionáveis** no DS |
| Intenção de plantão | Genérica | Você precisa saber qual calc abrir | **Entende a intenção** e roteia ("hipotenso" → triagem guiada) |
| Segurança/proveniência | Frágil, sem rastreio | Forte (conteúdo), mas estático | **Carimbo de proveniência + guarda-corpos no fluxo** |
| Língua/tom | EN-first, tom de assistente | EN-first | **PT-BR clínico de plantão** |
| Continuidade | Conversa solta | — | **Ações que viram próximo passo clínico** (chips/seletores) |

O diferencial mais defensável não é a IA: é o **sistema de renderização clínica estruturada + o acervo curado**.
Qualquer um pluga uma LLM; quase ninguém tem um contrato de resposta clínica + DS + conteúdo validado + tom PT-BR
de plantão. Para grandes players de fora, **o Brasil é prioridade baixa** — janela de liderança local.

### 2.3 Fraquezas honestas (o que **não** está pronto — e isso é normal num P0)

- **O "cérebro" ainda é um roteiro.** Hoje a classificação é heurística scriptada (`matchText` + tokens) sobre um
  repertório fechado. Não há NLU/LLM real. **É o item mais caro e mais crítico do roadmap** e o maior risco técnico.
- **Repertório clínico estreito.** O grafo cobre vasopressores/choque/PCR/gaso/hipercalemia — excelente como fatia
  vertical (emergência/UTI), mas é uma fração da medicina de plantão. Escalar conteúdo = custo recorrente de curadoria.
- **Zero telemetria instrumentada.** Sem dados, não há prova de retenção/uso para investidor nem feedback loop ativo.
  **Prioridade 0 de negócio.**
- **Risco de alucinação ao abrir o repertório.** Ao trocar o roteiro por LLM, herda-se a alucinação clínica. A
  estrutura **mitiga** (LLM preenche slots de um schema, não escreve livre), mas não elimina; precisa de RAG + validação.
- **Responsabilidade clínica é risco existencial.** Errar uma dose tem consequência real: exige seguro, termos,
  validação médica por release e governança.
- **"Fabricação de dados no resumo" é um bug conhecido (M6).** O resumo pode inventar valores (PAM, lactato). Em
  produto clínico, isso é grave e precisa de fix antes de escala.
- **Sem conta/login/multiusuário/EHR.** Persistência é localStorage. Para B2B hospitalar faltam identidade, SSO,
  auditoria e integração.

> **Veredito honesto:** o **produto-interface está num nível raro de maturidade** (arquitetura, DS, segurança de
> fluxo, UX). O **produto-inteligência ainda é uma promessa scriptada.** A tese de investimento é financiar a ponte
> entre os dois — e o de-risking já feito na interface é o que torna essa ponte barata e rápida vs. começar do zero.

---

## 3. Mercado & posicionamento

### 3.1 Tamanho e contexto (com fonte)

- **Brasil:** ~**635 mil médicos ativos em 2025**, projeção ~654 mil no fim do ano; **~47,7 mil residentes**; 50,9%
  mulheres; 59,1% especialistas (CFM/USP, *Demografia Médica no Brasil 2025*). Densidade subindo e **desigualdade
  regional alta** — o plantonista de cidade média/interior é mal servido por ferramentas em inglês.
- **Referência de adoção global:** o **MDCalc** roda modelo **freemium** (550–900+ ferramentas grátis, CME pago),
  é usado por "milhões de clínicos desde 2005", e **lançou uma divisão comercial de life sciences** — sinal de que
  a monetização do tráfego clínico está madura e migra para B2B farma.
- **UpToDate (Wolters Kluwer):** **3M+ profissionais**, tiers por **trainee / individual / grupo / enterprise**, e
  já lançou **"Expert AI"** (GenAI ancorada em conteúdo próprio) — confirma o vetor "decisão clínica + IA" e a
  estrutura de pricing por segmento.

**Leitura estratégica:** o comportamento de "pagar por apoio à decisão clínica" está **provado**. O CalcMed não
precisa criar o hábito — precisa **vencer localmente** com formato superior (estruturado/acionável) e língua/tom nativos.

### 3.2 Posicionamento (uma frase)

> **"O copiloto de plantão em português: pergunte como você pensa na emergência, receba dose, conduta e próximo
> passo em blocos acionáveis — não um textão de chatbot."**

- **Contra o chatbot genérico:** estruturado, seguro, rastreável, no tom certo.
- **Contra MDCalc:** não exige saber qual calculadora abrir; entende a intenção e entrega conduta, não só um número.
- **Contra UpToDate:** velocidade de beira-leito (segundos), não leitura de artigo; preço/idioma acessíveis ao BR.
- **Categoria reivindicada:** "**Clinical Copilot estruturado**" — apoio à decisão acionável no ponto de cuidado.

### 3.3 ICP (Ideal Customer Profile)

1. **Plantonista de emergência/UTI** (B2C núcleo): dor aguda, alta frequência, ROI de tempo óbvio.
2. **Residente** (entrada barata + hábito que vira LTV): aprende com a camada "por quê", trava o hábito cedo.
3. **Coordenação de residência / liga / instituição de ensino** (B2B-edu): compra em bloco, valoriza padronização.
4. **Hospital / PS / rede** (B2B alto ticket, médio prazo): padronização de protocolo, redução de erro, auditoria.
5. **Indústria farma / device** (B2B-2 longo prazo, à la MDCalc): contexto clínico qualificado — só com escala e governança.

---

## 4. Oportunidades de evolução

### 4.1 Curto prazo (0–6 meses) — "fechar o loop e provar"
- **Telemetria primeiro (P0 de negócio).** Instrumentar `ia_send{intent}`, `ia_copy{scope}`, `ia_feedback{value}`,
  `ia_regenerate`, `ia_fallback`… Sem isso não há North Star nem pitch de retenção.
- **Orquestração / deep-links (P1 do PRD).** Conectar as ações às **calculadoras e protocolos que já existem**. Ganho
  de valor mais barato: integra dois ativos prontos e torna a IA o **hub de navegação** do CalcMed.
- **Corrigir o bug de fabricação de dados no resumo (M6)** e adicionar estado de seleção visual no `ContextSelector`.
- **NLU/backend real fase 1 (LLM preenche o schema).** Manter o repertório curado, mas usar LLM para classificar
  intenção e preencher os slots dos blocos — a estrutura vira guarda-corpo anti-alucinação. Começar pela emergência/UTI.

### 4.2 Médio prazo (6–18 meses) — "ampliar repertório e ancorar B2B"
- **Expansão por verticais** (cardio, pediatria, obstetrícia, infecto/antibioticoterapia) — cada uma um pacote curado, vendável.
- **Memória de contexto do paciente** (peso/idade entre turnos, sem PII) → dose por peso ponta a ponta.
- **Conta/identidade + sincronização** → pré-requisito para B2B, histórico cross-device, personalização.
- **Painel de qualidade do feedback** (👍/👎 estruturado) → melhoria de produto **e** prova de qualidade para venda institucional.
- **Modo "passagem de plantão"/evolução** turbinado (base no `copyable`): gerador de valor e hábito diário.

### 4.3 Longo prazo (18+ meses) — "plataforma e dados como ativo"
- **API / white-label do AI Response System** para hospitais, healthtechs e EHRs BR — vender o **renderer estruturado** como infra.
- **Integração com prontuário eletrônico** → o ticket hospitalar de verdade.
- **Dataset proprietário de intenções/feedback de plantão BR** → ativo defensável e potencial produto B2B-2 (com governança).
- **Expansão LATAM** (ES) reaproveitando arquitetura; conteúdo local por país.

---

## 5. Monetização

**Princípio de ancoragem:** o produto economiza **tempo e erro** no plantão. Preço ancora em "**menos que um
plantão / menos que um café por dia**" no B2C e em "**redução de variabilidade e risco**" no B2B. O mercado já
aceita pagar por apoio à decisão — replicamos a estrutura **por segmento**, calibrada ao bolso BR.

> **Nota:** valores abaixo são **faixas de ancoragem estratégica**, não preços validados. Precisam de teste de
> disposição a pagar (van Westendorp / venda real).

### 5.1 Modelos viáveis (e o racional)

| Modelo | Quem paga | O que cobra | Racional / âncora |
|---|---|---|---|
| **Freemium** (topo de funil) | — | Grátis: core + N respostas/dia. Pago: ilimitado + verticais + memória + resumos | Playbook MDCalc: tráfego grátis vira hábito; monetiza o poder-usuário. |
| **B2C assinatura** (receita inicial) | Plantonista | Mensal/anual individual | Âncora: "**menos que 1 plantão/mês**". Anual trava retenção. |
| **Tier residente** (LTV longo) | Residente | Preço reduzido com comprovação | Copia o *trainee rate* da UpToDate: hábito cedo = LTV alto quando vira staff. |
| **Institucional/residência/liga** (B2B-edu) | Coordenação | Licença por bloco de usuários | Padronização + ensino; ciclo de venda mais curto que hospital. |
| **B2B hospital/PS/rede** (alto ticket) | Hospital/rede | Licença por leito/usuário + SSO/auditoria | Vende redução de variabilidade e risco; exige identidade/integração. |
| **API / white-label** (plataforma) | Healthtechs/EHRs | Licença de tecnologia + uso | Monetiza o **AI Response System** como infra. |
| **Patrocínio editorial / farma** (longo, com cautela) | Indústria | Contexto clínico qualificado, com governança | Caminho do MDCalc. **Só com escala e marca clínica impecável.** |

### 5.2 Sequência recomendada
1. **Agora:** freemium + telemetria (medir antes de cobrar).
2. **6–12m:** B2C individual + tier residente.
3. **12–18m:** institucional/residência (ticket maior, venda mais simples que hospital).
4. **18m+:** hospital/rede e API/white-label (precisam de conta, integração, governança).
5. **24m+:** farma/editorial **só** com escala e blindagem de marca clínica.

**O que NÃO cobrar cedo:** enterprise hospitalar antes de identidade/auditoria; farma antes de escala e governança.

---

## 6. Marketing / GTM

### 6.1 Mensagem
- **Headline:** "O copiloto que pensa como plantonista — em português."
- **Sub:** "Dose, conduta e próximo passo em blocos acionáveis. Sem textão. Sem sair do raciocínio clínico."
- **Prova de segurança (sempre junto):** "Apoio à decisão. Quem decide é você." — alinhado à **CFM 2.454/2026
  (human-in-the-loop)**, que vira **argumento de venda**, não obstáculo.

### 6.2 ICP → canal → mensagem

| ICP | Canal | Gancho |
|---|---|---|
| Plantonista | Instagram/TikTok médico, grupos de WhatsApp de plantão, indicação par-a-par | "Resolve a dose em segundos, no celular, com uma mão." |
| Residente | Ligas, coordenações, eventos, parceria com cursinhos (Estratégia MED, Sanar…) | "Aprenda a conduta **e o porquê** — tier de residente." |
| Coordenação/instituição | Venda direta + sociedades médicas (AMB, SBMU, SOBRATI…) | "Padronize a conduta de plantão da sua equipe." |
| Hospital/rede | Venda consultiva, pilotos em PS | "Menos variabilidade, menos erro, auditoria de conduta." |

### 6.3 Canais e táticas
- **Bottom-up médico (motor principal):** o produto é **inerentemente compartilhável** — o `copyable` para WhatsApp
  já é um vetor de distribuição (quem cola a conduta espalha a marca + o carimbo de proveniência).
- **Residência como cavalo de Troia:** entrar barato no residente, virar staff pagante, puxar a instituição.
- **Sociedades médicas e ligas:** chancela = credibilidade clínica (o ativo mais escasso em healthtech).
- **Conteúdo de autoridade:** publicar a **metodologia do AI Response System** e as **revisões de segurança clínica** como prova de seriedade.

### 6.4 GTM em uma linha
**Product-led, bottom-up, médico-a-médico no plantão e na residência → upsell institucional → enterprise.** Freemium
+ compartilhamento nativo (resumo→WhatsApp) é o motor de aquisição de baixo custo.

---

## 7. Moat & riscos (incl. regulatório/responsabilidade)

### 7.1 Onde está (e onde NÃO está) o moat
- **NÃO está na LLM** — é commodity.
- **Está em 4 camadas combinadas:**
  1. **Conteúdo clínico curado e validado** (as 5 centrais + repertório) — caro de replicar, melhora com o tempo.
  2. **AI Response System + Design System** — contrato estruturado e renderer clínico = IP de produto difícil de copiar
     bem; vira **infra licenciável** (white-label) = moat que também é receita.
  3. **Loop de feedback estruturado como dado proprietário** — 👍/👎 categorizado por motivo + intenções de plantão BR
     = dataset que melhora o produto e ninguém mais tem → flywheel.
  4. **Marca clínica + tom PT-BR + distribuição médica** — confiança é o ativo mais lento de construir em saúde.
- **Lock-in:** institucional (conduta padronizada vira processo) e residência (hábito cedo) criam switching cost.

### 7.2 Riscos regulatórios e de responsabilidade
- **Enquadramento como SaMD (ANVISA RDC 657/2022).** Se a IA for interpretada como destinada a diagnóstico/terapêutica,
  pode cair na regulação de software como dispositivo médico. **Mitigação:** manter-se explicitamente como **apoio à
  decisão / referência educacional**, com o médico decidindo — fronteira que o produto já respeita por design.
  **Precisa de avaliação jurídica regulatória formal antes de escala.**
- **CFM Resolução 2.454/2026 — human-in-the-loop.** É **favorável**: consagra IA como apoio com autoridade final do
  médico. O produto já está nessa doutrina → vira **selo de conformidade e venda**, desde que a comunicação nunca
  prometa substituir o médico.
- **Responsabilidade por erro clínico (dose/conduta).** Risco existencial. Mitigações: validação médica por release,
  conselho clínico nomeado, termos claros, seguro, e o fix de fabricação de dados (M6) antes de escalar. A estrutura
  em blocos (LLM preenche schema, não escreve livre) reduz a superfície de alucinação.
- **Privacidade / LGPD.** O produto já tem por princípio "**nada que identifique o paciente**". Qualquer "memória de
  paciente" precisa ser desenhada sem PII.

### 7.3 Riscos competitivos
- **Player global lança versão BR melhor.** Mitigação: velocidade local, tom/idioma nativos, preço BR, profundidade de fluxo de plantão.
- **Comoditização por LLMs de fronteira.** Mitigação: valor é curadoria + estrutura + confiança + dados, não o texto.

---

## 8. Métricas / North Star

**North Star proposta:** **Condutas acionáveis entregues por médico ativo por semana** (resposta estruturada que o
médico **usou** — copiou, seguiu uma ação, ou avaliou positivamente). Captura valor real de plantão, não vaidade.

| Camada | Métrica | Por que importa |
|---|---|---|
| Ativação | % de sessões que usam ≥1 sugestão inicial (alvo ≥50%) | Descoberta de capacidade |
| Valor | nº de cópias (dose/resumo) por sessão (crescente); % com 👍 (alvo ≥80%) | Acionabilidade real |
| Retenção | médicos ativos semanais; profundidade média da conversa (≥2 turnos) | Hábito |
| Qualidade/segurança | taxa de 👎 por intenção; taxa de fallback | Onde o cérebro falha → backlog de conteúdo |
| Negócio | conversão free→pago; LTV/CAC; receita por segmento | Saúde do modelo |
| Conformidade | 100% conclusão do onboarding bloqueante | Trilha de segurança/regulatória |

**Crítico:** nada disso está instrumentado hoje. **Instrumentar telemetria é o item #1 de negócio.**

---

## 9. Roadmap estratégico sugerido

| Horizonte | Produto | Monetização | GTM | Regulatório |
|---|---|---|---|---|
| **Q0–Q2** | Telemetria; deep-links; fix M6; NLU fase 1 (LLM preenche schema) na emergência | Freemium ligado; medir DAP | Bottom-up plantonista + residência; resumo→WhatsApp | Parecer SaMD; alinhar copy à CFM 2.454/2026 |
| **Q3–Q4** | Conta/identidade; memória de contexto (sem PII); +1–2 verticais | B2C individual + tier residente | Sociedades médicas, ligas, cursinhos | Conselho clínico; validação por release |
| **Ano 2** | Painel de qualidade; mais verticais; modo passagem de plantão | Institucional/residência | Venda institucional; pilotos em PS | LGPD by design; seguro de responsabilidade |
| **Ano 2–3** | API/white-label; integração EHR | Hospital/rede + licença de tecnologia | Venda consultiva enterprise | Trilha enterprise (auditoria, SSO) |
| **Ano 3+** | Dataset proprietário; expansão LATAM | Farma/editorial com governança; LATAM | Parcerias regionais | Conformidade por país |

---

## 10. Riscos & mitigação (consolidado)

| # | Risco | Severidade | Mitigação |
|---|---|---|---|
| R1 | "Cérebro" ainda scriptado; NLU real é caro | Alta | Faseado: LLM preenche schema; começar pela vertical coberta |
| R2 | Alucinação clínica ao abrir repertório | Alta | RAG sobre conteúdo próprio; resposta por slots; validação por release |
| R3 | Responsabilidade por erro de dose/conduta | Existencial | Conselho clínico, validação, termos, seguro, fix M6, human-in-the-loop |
| R4 | Enquadramento como SaMD (ANVISA) | Alta | Parecer regulatório; posicionar como apoio/educação; proveniência |
| R5 | Sem telemetria → sem dados/prova | Alta (negócio) | Instrumentar imediatamente |
| R6 | Repertório estreito limita TAM | Média | Expansão por verticais; priorizar por uso real |
| R7 | Player global lança BR | Média | Velocidade/idioma/preço locais; flywheel de dados |
| R8 | Comoditização por LLMs | Média | Moat = curadoria + estrutura + confiança + dados |
| R9 | B2B exige identidade/integração inexistentes | Média | Conta/SSO no roadmap antes de vender enterprise |
| R10 | Queima de marca clínica (farma cedo / erro público) | Alta | Governança rígida; farma só com escala; QA clínico contínuo |

---

## 11. Conclusão estratégica

O CalcMed IA está numa posição incomum: **a parte difícil e cara de construir bem — a interface clínica estruturada,
o Design System, a segurança de fluxo, o tom de plantão e o acervo das centrais — já existe e está em nível de
produção.** O que falta é a **inteligência real e a monetização** — ambas alavancáveis sobre uma fundação já
de-riscada, dentro de uma doutrina regulatória (CFM 2.454/2026, human-in-the-loop) que o produto já encarna.

A tese para investidor/parceiro é direta: **não estamos pedindo capital para descobrir se um copiloto de plantão
estruturado funciona — a arquitetura e o conteúdo provam que sim. Estamos pedindo capital para trocar o motor
scriptado por inteligência real, ligar os ativos que já temos (orquestração), instrumentar o valor e capturá-lo** —
num mercado de ~635 mil médicos BR, com comportamento de pagar por apoio à decisão já provado globalmente, e onde
os incumbentes não jogam em português de plantão.

---

## Fontes

- CFM / FM-USP — *Demografia Médica no Brasil 2025* (~635 mil médicos ativos; ~47,7 mil residentes; 50,9% mulheres;
  59,1% especialistas): med.estrategia.com (resumo Demografia Médica 2025); portal.cfm.org.br; agenciabrasil.ebc.com.br.
- MDCalc — freemium, 550–900+ ferramentas, divisão de life sciences: pharmexec.com; pharmaceuticalcommerce.com; App Store.
- UpToDate (Wolters Kluwer) — 3M+ profissionais, tiers trainee/individual/grupo/enterprise, "Expert AI": wolterskluwer.com.
- Regulação BR — ANVISA RDC 657/2022 (SaMD) e CFM Resolução 2.454/2026 (human-in-the-loop): ibanet.org; medtechinnovate.io; practiceguides.chambers.com.

> Faixas de preço e modelos de receita são **ancoragem estratégica** (a validar com disposição a pagar), não dados de mercado.
