# CalcMed React - Central de Urgencia

Base React escalavel da Central de Urgencia. As cinco centrais (CAD, Sepse, PCR, AVC e SCA) estao componentizadas em React — o bridge para o HTML validado (golden master) foi removido e o app e 100% self-contained.

## Como rodar

```bash
npm install
npm run dev
npm run lint
npm run build
```

O `npm run build` gera uma saida estatica em `dist/` (sem dependencia de pastas externas), pronta para deploy estatico (ex.: Vercel, com preset Vite).

## Entrada do app

Ao abrir, o app mostra uma tela de selecao entre **Prototipo** (produto / Central de Urgencia) e **Design System** (documentacao viva). A escolha fica salva em `localStorage` (`app_mode`) e pode ser trocada a qualquer momento. Deep-links de QA (`?qa=...`) abrem o Design System direto, sem passar pela selecao.

## Arquitetura atual

- `src/data/protocols.js`: inventario das Centrais (rotas, dominio, fase de migracao).
- `src/features/hub/`: hub React da Central de Urgencia.
- `src/features/cad|sepse|pcr|avc|sca/`: os cinco fluxos clinicos em React.
- `src/features/entry/`: tela de selecao de visao (prototipo / Design System).
- `src/features/ds/`: documentacao viva do Design System (galerias QA + IA · Sistema de Respostas).
- `src/shared/components/`: atomos, moleculas, organismos e overlays reutilizaveis.
- `src/shared/styles/`: tokens e estilos do DS.

## Regra de qualidade por fluxo

Cada fluxo deve:

- Rodar sem erro de build e lint.
- Preservar `localStorage` e recuperacao apos refresh.
- Preservar gates clinicos, timers, historico, modais/sheets e estados vazios.
- Passar QA visual mobile.

## Design System

- Dashboard do DS: abrir a visao "Design System" na selecao, ou `?qa=colors` (qualquer categoria) durante o dev server.
- Galeria viva dos BottomSheets: `?qa=bottomsheets`.
- Galeria viva de cores do DS: `?qa=colors`.
- IA · Sistema de Respostas: `?qa=ia-respostas`.
- Relatorios e planos em `docs/` (ex.: `docs/qa-report.md`).
