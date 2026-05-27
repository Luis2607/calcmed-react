# CalcMed React - Central de Urgencia

Este projeto e a base React escalavel da Central de Urgencia. A migracao e incremental: o HTML validado continua como golden master funcional ate cada fluxo React atingir paridade real.

## Fonte de verdade durante a migracao

- Golden master funcional: `../calcmed/`
- Base React escalavel: `./`
- Primeiro fluxo em migracao: CAD
- Fluxos ainda por paridade: Sepse, PCR, AVC e SCA

Nada do HTML deve ser removido, simplificado ou sobrescrito por causa da migracao. O React deve copiar comportamento validado, texto, estado, microinteracao e visual essencial antes de substituir qualquer uso diario.

## Como rodar

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Arquitetura atual

- `src/data/protocols.js`: inventario da Central inteira, rotas, estado de migracao e ponteiro para o HTML de referencia.
- `src/features/hub/`: hub React da Central de Urgencia.
- `src/features/cad/`: primeira migracao funcional por paridade.
- `src/shared/components/layout/GoldenProtocolFrame.jsx`: ponte segura para renderizar o HTML validado dentro do React enquanto um protocolo ainda nao atingiu paridade componente-a-componente.
- `src/shared/components/`: atomos, moleculas, organismos e overlays reutilizaveis.
- `src/shared/styles/`: tokens e estilos herdados do prototipo HTML/DS.

## Ponte segura para protocolos ainda nao migrados

Sepse, PCR, AVC e SCA nao devem aparecer como placeholder. Enquanto a migracao React real nao for concluida, essas rotas carregam o HTML validado por `/golden/...`, servido pelo Vite a partir de `../calcmed/`.

Isso preserva visual, fluxo, microinteracao e `localStorage` na mesma origem local. A ponte nao conta como migracao final: ela e uma protecao contra perda ate a componentizacao real ficar pronta.

## Regra de migracao por paridade

Um fluxo so muda de "Na fila" para "Migrado" quando passar estes pontos:

- Roda sem erro de build e lint.
- Preserva localStorage e recuperacao apos refresh.
- Preserva textos e microcopy do HTML ou registra divergencia aprovada.
- Preserva gates clinicos, timers, historico, modais/sheets e estados vazios.
- Passa QA visual mobile contra o HTML de referencia.

## QA atual

- Relatorio mais recente: `docs/qa-report.md`.
- Plano de padronizacao dos BottomSheets: `docs/bottom-sheet-standardization-plan.md`.
- Roadmap visual pos-BottomSheet: `docs/visual-coherence-roadmap.md`.
- Galeria viva dos BottomSheets: abrir `http://127.0.0.1:5174/?qa=bottomsheets` durante o dev server.
- Galeria viva de cores do DS: abrir `http://127.0.0.1:5174/?qa=colors` durante o dev server.

## Status de seguranca

O React pode evoluir como destino de escalabilidade, mas o uso diario e a validacao com cliente continuam no HTML enquanto a paridade nao estiver fechada para toda a Central.
