export const TYPOGRAPHY_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Tipografia',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

export const TYPOGRAPHY_TOKEN_GROUPS = [
  {
    title: 'Titulos',
    description: 'Estilos para titulos de paginas, secoes e subtitulos clinicos.',
    tokens: [
      {
        name: 'titulo-pagina',
        figmaStyleName: 'CalcMed/titulo-pagina',
        figmaId: 'S:dc5148215887f2fcf9b5bbaf6976ba56a583dce6,',
        cssAlias: '--ds-font-tit-pag',
        values: { size: '24px', weight: '700', lineHeight: '32px', family: 'var(--fonte-base)' }
      },
      {
        name: 'titulo-secao',
        figmaStyleName: 'CalcMed/titulo-secao',
        figmaId: 'S:bc6b650c0860a44562b00229b9da314b89813c67,',
        cssAlias: '--ds-font-tit-secao',
        values: { size: '20px', weight: '700', lineHeight: '28px', family: 'var(--fonte-base)' }
      },
      {
        name: 'subtitulo',
        figmaStyleName: 'CalcMed/subtitulo',
        figmaId: 'S:c4589e4e26255a86ff22eeb171d24ae1616b6877,',
        cssAlias: '--ds-font-subtitulo',
        values: { size: '18px', weight: '600', lineHeight: '24px', family: 'var(--fonte-base)' }
      },
      {
        name: 'nome-droga',
        figmaStyleName: 'CalcMed/nome-droga',
        figmaId: 'S:cfa5dad2e29aff0d925708ac15386e384faf5012,',
        cssAlias: '--ds-font-nome-droga',
        values: { size: '18px', weight: '600', lineHeight: '24px', family: 'var(--fonte-base)' }
      }
    ]
  },
  {
    title: 'Corpo e Auxiliares',
    description: 'Textos de leitura, descricoes clinicas, legendas e badges.',
    tokens: [
      {
        name: 'corpo',
        figmaStyleName: 'CalcMed/corpo',
        figmaId: 'S:cbe56f533d8aa672f640a53958b6094610c17182,',
        cssAlias: '--ds-font-corpo',
        values: { size: '16px', weight: '400', lineHeight: '24px', family: 'var(--fonte-base)' }
      },
      {
        name: 'corpo-secundario',
        figmaStyleName: 'CalcMed/corpo-secundario',
        figmaId: 'S:024364bb8ec0f69b4c2f5871ab004ef7ec4dbec5,',
        cssAlias: '--ds-font-corpo-2',
        values: { size: '14px', weight: '400', lineHeight: '22px', family: 'var(--fonte-base)' }
      },
      {
        name: 'legenda',
        figmaStyleName: 'CalcMed/legenda',
        figmaId: 'S:d1cce095a9bb1d14ca01bd420d269a29aeda2fc3,',
        cssAlias: '--ds-font-legenda',
        values: { size: '12px', weight: '400', lineHeight: '16px', family: 'var(--fonte-base)' }
      },
      {
        name: 'texto-badge',
        figmaStyleName: 'CalcMed/texto-badge',
        figmaId: 'S:f0d9b69f6110e6f2817753a0a39107556dd0666d,',
        cssAlias: '--ds-font-badge',
        values: { size: '11px', weight: '600', lineHeight: '14px', family: 'var(--fonte-base)' }
      }
    ]
  },
  {
    title: 'Formularios e Navbar',
    description: 'Estilos para rotulos de inputs, textos digitados e navegacao.',
    tokens: [
      {
        name: 'rotulo-campo',
        figmaStyleName: 'CalcMed/rotulo-campo',
        figmaId: 'S:d16c8446013f7db5db847409042263ad32118c2b,',
        cssAlias: '--ds-font-rot-campo',
        values: { size: '14px', weight: '500', lineHeight: '20px', family: 'var(--fonte-base)' }
      },
      {
        name: 'valor-campo',
        figmaStyleName: 'CalcMed/valor-campo',
        figmaId: 'S:a77a13ce3dc3615e494bc0ddd4f65e5f200ff1ce,',
        cssAlias: '--ds-font-valor-campo',
        values: { size: '16px', weight: '400', lineHeight: '24px', family: 'var(--fonte-base)' }
      },
      {
        name: 'valor-campo-mono',
        figmaStyleName: 'CalcMed/valor-campo-mono',
        figmaId: 'S:fa5a270e41b0087d7d9f7cdc3ffd30bd7fe5639a,',
        cssAlias: '--ds-font-valor-mono',
        values: { size: '16px', weight: '400', lineHeight: '24px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'rotulo-nav',
        figmaStyleName: 'CalcMed/rotulo-nav',
        figmaId: 'S:42df3ee86e89dd760a01dc7719e59ddbfddc2a45,',
        cssAlias: '--ds-font-rot-nav',
        values: { size: '12px', weight: '500', lineHeight: '16px', family: 'var(--fonte-base)' }
      },
      {
        name: 'nav-label',
        figmaStyleName: 'CalcMed/nav-label',
        figmaId: 'S:325757f4300e31a358f74650d0c8426eb03f6043,',
        cssAlias: '--ds-font-nav-label',
        values: { size: '11px', weight: '500', lineHeight: '14px', family: 'var(--fonte-base)' }
      }
    ]
  },
  {
    title: 'Botoes',
    description: 'Tamanhos de tipografia para botoes em diferentes dimensoes.',
    tokens: [
      {
        name: 'botao-sm',
        figmaStyleName: 'CalcMed/botao-sm',
        figmaId: 'S:e1f8af9886efe17bbce11a72677c1c1c506d2ceb,',
        cssAlias: '--ds-font-botao-sm',
        values: { size: '12px', weight: '600', lineHeight: '16px', family: 'var(--fonte-base)' }
      },
      {
        name: 'botao-md',
        figmaStyleName: 'CalcMed/botao-md',
        figmaId: 'S:8b0c8d869951feabcb5f6cd92d000bb14132575e,',
        cssAlias: '--ds-font-botao-md',
        values: { size: '14px', weight: '600', lineHeight: '20px', family: 'var(--fonte-base)' }
      },
      {
        name: 'botao-lg',
        figmaStyleName: 'CalcMed/botao-lg',
        figmaId: 'S:3c5c989a3c0ef0ce27c294975a8bc91fda8280b6,',
        cssAlias: '--ds-font-botao-lg',
        values: { size: '16px', weight: '600', lineHeight: '24px', family: 'var(--fonte-base)' }
      }
    ]
  },
  {
    title: 'Alertas e Conteudo Clinico',
    description: 'Mensagens de alerta, doses de medicamentos e valores tabulares de exames.',
    tokens: [
      {
        name: 'alerta-titulo',
        figmaStyleName: 'CalcMed/alerta-titulo',
        figmaId: 'S:cab4629dc5b4551a26079332f70757ba7408730d,',
        cssAlias: '--ds-font-alerta-tit',
        values: { size: '14px', weight: '700', lineHeight: '20px', family: 'var(--fonte-base)' }
      },
      {
        name: 'alerta-corpo',
        figmaStyleName: 'CalcMed/alerta-corpo',
        figmaId: 'S:3a359dd697fca863383a2206ff8f6b085160916c,',
        cssAlias: '--ds-font-alerta-corpo',
        values: { size: '14px', weight: '400', lineHeight: '20px', family: 'var(--fonte-base)' }
      },
      {
        name: 'dose-valor',
        figmaStyleName: 'CalcMed/dose-valor',
        figmaId: 'S:86fb9b0a15ec483a55267054d7e653d9e4de2c8c,',
        cssAlias: '--ds-font-dose-valor',
        values: { size: '32px', weight: '700', lineHeight: '40px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'dose-unidade',
        figmaStyleName: 'CalcMed/dose-unidade',
        figmaId: 'S:7fcbc7d75cf923753fe37809a93ff176f392c2e7,',
        cssAlias: '--ds-font-dose-unid',
        values: { size: '20px', weight: '500', lineHeight: '26px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'valor-grande',
        figmaStyleName: 'CalcMed/valor-grande',
        figmaId: 'S:815aa51023befe2247dedeb28e2e9c1617c21c69,',
        cssAlias: '--ds-font-valor-grande',
        values: { size: '32px', weight: '700', lineHeight: '40px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'numero-tabular-md',
        figmaStyleName: 'CalcMed/numero-tabular-md',
        figmaId: 'S:44b05f1cf6c05dd25c3e9e71bdf9ba630c23247a,',
        cssAlias: '--ds-font-num-tab-md',
        values: { size: '16px', weight: '500', lineHeight: '24px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'numero-tabular-sm',
        figmaStyleName: 'CalcMed/numero-tabular-sm',
        figmaId: 'S:48497d8d77335160c185492478091e3cd999e7e0,',
        cssAlias: '--ds-font-num-tab-sm',
        values: { size: '13px', weight: '500', lineHeight: '18px', family: 'var(--fonte-mono)' }
      }
    ]
  },
  {
    title: 'Especiais e Modo PCR',
    description: 'Cronometros e CTAs gigantes para fluxo de parada cardiorrespiratoria.',
    tokens: [
      {
        name: 'cronometro-mestre',
        figmaStyleName: 'CalcMed/cronometro-mestre',
        figmaId: 'S:126dfca4e9a2a798c8c6a93d56b4e2f3abd8a354,',
        cssAlias: '--ds-font-crono-mestre',
        values: { size: '56px', weight: '700', lineHeight: '64px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'cronometro-card',
        figmaStyleName: 'CalcMed/cronometro-card',
        figmaId: 'S:f48f4e36f924bb966cc1087d12b0f218281602ac,',
        cssAlias: '--ds-font-crono-card',
        values: { size: '32px', weight: '700', lineHeight: '40px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'cronometro-secondary',
        figmaStyleName: 'CalcMed/cronometro-secondary',
        figmaId: 'S:f4c77df5141c3093f2ca0a81eff965b884361790,',
        cssAlias: '--ds-font-crono-sec',
        values: { size: '22px', weight: '700', lineHeight: '28px', family: 'var(--fonte-mono)' }
      },
      {
        name: 'cta-emergencia-xl',
        figmaStyleName: 'CalcMed/cta-emergencia-xl',
        figmaId: 'S:419ccb0ab34146bebc7f54ec328bd95327b98899,',
        cssAlias: '--ds-font-cta-emerg-xl',
        values: { size: '18px', weight: '600', lineHeight: '24px', family: 'var(--fonte-base)' }
      }
    ]
  }
];
