# Checklist de Paridade - Central de Urgencia

Use este checklist antes de considerar qualquer protocolo migrado para React.

## Golden master

- HTML de referencia: `../calcmed/`
- Protocolos cobertos pela Central: CAD, Sepse, PCR, AVC e SCA
- Regra: React nunca remove comportamento validado sem decisao explicita.

## Status em 2026-05-26

- Base React roda, builda e passa lint.
- Hub React reconhece a Central inteira: CAD, Sepse, PCR, AVC e SCA.
- CAD permanece como primeira migracao funcional em andamento.
- Sepse, PCR, AVC e SCA seguem em fila para componentizacao, mas renderizam o HTML validado por ponte `/golden/...` dentro do React.
- Ultimo QA documentado: `qa-report.md`.

## QA minimo por protocolo

### CAD

- Diagnostico T1 com idade, peso, glicemia, acidose e cetose.
- Modo adulto, pediatrico e pediatrico critico.
- Gate K menor que 3,5 bloqueia insulina.
- Insulina calcula dose por peso e registra inicio.
- Reavaliacao horaria com HGT/gasometria.
- Resolucao e encerramento com iniciais.
- Historico local e recuperacao apos refresh.

### Sepse

- Triagem e classificacao.
- Foco infeccioso, culturas e antibiotico.
- Ressuscitacao, vasopressores e metas.
- Anotacao, historico e teoria.
- Sheets/modais preservados.

### PCR

- Pre-inicio e PCR ativa.
- Ritmo, adrenalina, choque, RCE e fim sem RCE.
- 5H/5T, ACLS/AHA, cargas/doses e via aerea.
- Eventos customizados, anotacao e historico.
- Cronometros e toasts preservados.

### AVC

- Cincinnati/triagem e abertura de Codigo AVC.
- Janela terapeutica, NIHSS, PA, glicemia e contraindicacoes.
- Trombolise/trombectomia, desvio hemorragico e encerramento.
- Historico, busca e detalhes do caso.

### SCA

- Queixa inicial, ECG e classificacao.
- OMI/IAM, risco, troponina e gates.
- AAS/P2Y12, destino e passagem de caso.
- Historico, teoria e estados de erro amigaveis.

## Aceite visual

- Sem sobreposicao incoerente.
- Sem texto estourando card, botao ou chip.
- Header, tabbar, cards, alerts e historico usam componentes compartilhados quando ja existirem.
- Qualquer divergencia visual contra o HTML precisa estar anotada como melhoria desejada.
