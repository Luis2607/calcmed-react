# Status do Design System Figma — CalcMed

## Arquivo Figma
- **Nome:** Design System CalcMed
- **File key:** mUNw6d9A955Z3xay3u7SAO
- **Pagina de telas:** Telas — Auth Flow

---

## O que foi feito

### Componentes criados/atualizados no DS

| Componente | Pagina | Variantes | Properties |
|---|---|---|---|
| Brand (4 tamanhos) | Marca e Identidade | 4 | — |
| Brand Completa / Dark | Marca e Identidade | 2 | — |
| Button | Botoes | 180 | Label, Show Left/Right Icon, Icon Swap |
| Button/Google | Botoes | 4 | State, Dark mode |
| Button/Apple | Botoes | 4 | State, Dark mode |
| Input Field | Inputs | 14 | Label, Placeholder, Helper, Show icons |
| card/selecao | Cards | 24 | Tipo (Adulto/Pediatria/Ambos), State, Dark mode, Label, Icon Swap |
| card/funcionalidade | Cards | 6 | Estado (default/selecionado/teste), Dark mode, Name, Show Bookmark |
| Tag Abbr | Tags e Chips | 12 | Domain (6 dominios), Dark mode, Abbreviation |
| Carousel Dots | Controles de Selecao | 6 | Active Slide (1/2/3), Dark mode |
| Auth Hero | Headers | 6 | Active Slide, Dark mode, Headline (text) |
| icone/email | Icones | 1 | — |
| icone/usuario | Icones | 1 | — |
| icone/bebe | Icones | 1 | — |
| icone/usuarios | Icones | 1 | — |

### Telas completas (pagina "Telas — Auth Flow")

**Total: ~66 frames** (mobile + web, light + dark)

#### Fluxo de Cadastro (acima do padrao)
| Tela | Mobile L/D | Web L/D |
|---|---|---|
| Entrada (dupe) | ok | — |
| Email Cadastro | ok | — |
| Criar Conta | ok | ok |
| Verificar Email | ok | ok |

#### Fluxo Padrao (happy path login)
| Tela | Mobile L/D | Web L/D |
|---|---|---|
| Splash | ok | — (nao tem web) |
| Entrada (Welcome) | ok | ok |
| Email | ok | ok |
| Senha | ok | ok |
| Onboarding 1 | ok | ok |
| Onboarding 2 | ok | ok |

#### Fluxo de Erros
| Tela | Mobile L/D | Web L/D |
|---|---|---|
| Email (contexto) | ok | — |
| Email Invalido | ok | ok |
| Senha Erro | ok | ok |
| Conta Bloqueada | ok | ok |

#### Fluxo de Recuperar Senha
| Tela | Mobile L/D | Web L/D |
|---|---|---|
| Senha (contexto) | ok | — |
| Recuperar Senha | ok | ok |
| Nova Senha | ok | ok |
| Senha Alterada | ok | ok |

### Organizacao
- 4 fluxos separados verticalmente com labels teal
- Light em cima, Dark embaixo
- Web ao lado do mobile em cada fluxo
- Telas de contexto duplicadas onde necessario

---

## O que falta

### Prioridade Alta
- [ ] Colocar imagens medicas (slide-1/2/3.png) nos heroes mobile e web — usuario faz manual
- [ ] Corrigir text style "URGENCIA E EMERGENCIA" no Brand Completa (24 telas afetadas)
- [ ] Revisar visualmente cada tela vs localhost para garantir paridade

### Prioridade Media
- [ ] Tela RecuperarInputPage (digitar email para recuperar) — nao foi feita
- [ ] Dark mode polish nos cards web (gradient bg, border navy-600)
- [ ] Prototipar navegacao entre telas (connections no Figma)

### Prioridade Baixa
- [ ] Versao web do Onboarding com card/selecao e card/funcionalidade mais compactos
- [ ] Documentar cada componente na pagina do DS (header + showcase + when to use)
- [ ] Criar variantes de estados intermediarios (input typing, button loading)

---

## Tokens e Variaveis

### Colecoes
- **Primitivos** (157 vars): cores, espacamento (espaco/1-24), brand colors
- **Semanticos** (50 vars, Light+Dark): fundo/*, texto/*, borda/*, interativo/*, retorno/*
- **Componentes** (45 vars, Light+Dark): botao/*, input/*, cartao/*, alerta/*

### Text Styles (19)
CalcMed/titulo-pagina, titulo-secao, subtitulo, nome-droga, alerta-titulo, alerta-corpo, corpo, corpo-secundario, rotulo-campo, valor-campo, valor-mono, rotulo-nav, texto-badge, legenda, marca, dose-valor, dose-unidade, preco, valor-grande

### Grid Styles (3)
CalcMed/grid-celular (390px), grid-tablet, grid-desktop (1440px)

---

## Como continuar

### Regra principal
Sempre ler o codigo React (`calcmed-react/src/pages/*.tsx`) ANTES de criar qualquer tela no Figma. O codigo eh a fonte da verdade.

### Localhost
```bash
cd calcmed-react && npm run dev
# http://localhost:5173/app
```

### Rotas do fluxo auth
- /app — Splash + Entrada
- /login/email — Email
- /login/senha — Senha
- /login/recuperar — Recuperar (email enviado)
- /login/recuperar-email — Recuperar (digitar email)
- /login/nova-senha — Nova senha
- /login/senha-alterada — Confirmacao
- /login/bloqueada — Conta bloqueada
- /onboarding/1 — Onboarding 1
- /onboarding/2 — Onboarding 2
- /registro/criar — Criar conta
- /registro/verificar — Verificar email

### Skill de arquitetura
A skill `figma-component-architecture` em `.agents/skills/` tem todas as regras, patterns e mapeamentos codigo→figma. Sempre consultar antes de criar componentes.
