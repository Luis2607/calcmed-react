# Índice da documentação (o "cérebro" do CalcMed)

> Mapa único dos docs. **Status:** `VIVO` (fonte da verdade, em sincronia com o código) ·
> `PROCESSO` (regras/templates/planos de trabalho) · `HISTÓRICO` (registro de uma fase já
> superada — **não** usar como verdade atual).
>
> Regra (CLAUDE.md §7): ao mexer em qualquer feature, atualize o doc `VIVO` correspondente na
> mesma entrega. Doc desatualizado = bug.

## Cérebro vivo — features (PRD por feature)
| Doc | Feature | Status |
|---|---|---|
| `prd-ia-calcmed.md` | IA (AI Response System) | VIVO |
| `ia-response-system.md` | IA — spec técnico do renderer | VIVO |
| `prd-cad.md` | Central CAD (cetoacidose) | VIVO |
| `prd-sca.md` | Central SCA (IAM) | VIVO |
| `prd-sepse.md` | Central Sepse | VIVO |
| `prd-pcr.md` | Central PCR (ACLS) | VIVO |
| `prd-avc.md` | Central AVC | VIVO |

## Cérebro vivo — passagem pro Figma
| Doc | Escopo | Status |
|---|---|---|
| `figma-handoff-plan.md` | Plano de Figma da IA | VIVO |
| `figma-handoff-centrais.md` | Plano de Figma das 5 centrais | VIVO |
| `figma-sync-ledger.md` | Ledger de divergências código→Figma (item a item) | VIVO |
| `ds-issues-figma.md` | Problemas de modelagem do próprio Figma | VIVO |
| `decisoes-figma.md` | Decisões pendentes do DS/Figma (ADR-lite, fonte única) | VIVO |
| `estrategia-negocio-ia-calcmed.md` | Estratégia de negócio da IA (P.O./investidor) | VIVO |

## Processo (regras, templates, checklists)
| Doc | Uso | Status |
|---|---|---|
| `CLAUDE.md` (raiz) | Regras permanentes de construção | PROCESSO |
| `00-index.md` (este) | Mapa dos docs | PROCESSO |
| `checklist-nova-feature.md` | Gate repetível por feature (build/lint/tokens/PRD/ledger) | PROCESSO |
| `_templates/PRD.md` | Molde de PRD | PROCESSO |
| `regras-componentes-selecao.md` | Critérios de seleção de componentes | PROCESSO |
| `catalogo-componentes-padronizacao.md` | Catálogo de componentes | PROCESSO |
| `bottom-sheet-standardization-plan.md` | Plano de padronização dos sheets | PROCESSO |
| `visual-coherence-roadmap.md` | Roadmap de coerência visual | PROCESSO |

## Histórico (fase superada — não é verdade atual)
> Estes docs descrevem o protótipo numa fase anterior (iframe golden / não-portado / pré-git).
> Hoje as 5 centrais são **React nativo** e tudo está versionado. Mantidos como registro.

| Doc | Por que é histórico |
|---|---|
| `parity-checklist.md` | Trata centrais como iframe golden / não-portado |
| `qa-report.md` | QA da fase de port (2026-05) |
| `componentizacao-status.md` | "só CAD é React" — superado (as 5 são React) |
| `kit-central-urgencia.md` | "SCA/Sepse/PCR/AVC ~0% React" — superado |
| `baseline-pre-padronizacao.md` | "protótipo não-rastreado pelo git" — superado |
| `shell-estrutura-5-fluxos.md` | já auto-rotulado HISTÓRICO |
| `audit-central-urgencia-componentizacao.md` | auditoria da fase de componentização |
| `sca-iam-code-first.md` | nota de migração do SCA |
| `pcr-comentarios-2026-05-28-pm.md` | comentários pontuais de revisão |
| `port-pcr-inventario.md` · `port-pcr-plano-migracao.md` | inventário/plano do port do PCR |
| `port-sepse-inventario.md` · `port-sepse-ds-inventario.md` | inventário do port da Sepse |
