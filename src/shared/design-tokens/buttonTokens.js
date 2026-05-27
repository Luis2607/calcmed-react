export const BUTTON_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Botões',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

export const BUTTON_TOKEN_GROUPS = [
  {
    title: 'Mapeamento de Tamanhos (Sizes)',
    description: 'Compara a especificação de paddings e alturas do Figma contra o código real.',
    tokens: [
      {
        size: 'SM',
        figmaHeight: '32px',
        figmaPaddingV: '8px',
        figmaPaddingH: '12px',
        figmaText: 'botao-sm (12px SemiBold)',
        codeHeight: '32px',
        codePaddingH: '12px',
        codeText: '12px Regular/SemiBold',
      },
      {
        size: 'MD',
        figmaHeight: '44px',
        figmaPaddingV: '12px',
        figmaPaddingH: '24px',
        figmaText: 'botao-md (14px SemiBold)',
        codeHeight: '44px',
        codePaddingH: '24px',
        codeText: '14px Regular/SemiBold',
      },
      {
        size: 'LG',
        figmaHeight: '56px',
        figmaPaddingV: '16px',
        figmaPaddingH: '24px',
        figmaText: 'botao-lg (16px SemiBold)',
        codeHeight: '56px',
        codePaddingH: '24px',
        codeText: '16px Regular/SemiBold',
      }
    ]
  },
  {
    title: 'Variantes e Estilos Visuais',
    description: 'Mapeamento de cores de fundos, bordas e textos por variante nos modos Light e Dark.',
    tokens: [
      {
        variant: 'primary',
        description: 'Botão principal de ação.',
        colors: {
          Light: { bg: '#007993', text: '#FFFFFF', border: 'transparent' },
          Dark: { bg: '#0096B7', text: '#FFFFFF', border: 'transparent' },
        }
      },
      {
        variant: 'secondary',
        description: 'Botão de apoio ou alternativo.',
        colors: {
          Light: { bg: '#F1F5F9', text: '#0F172A', border: '#E2E8F0' },
          Dark: { bg: '#223249', text: '#F1F5F9', border: '#2A3F5F' },
        }
      },
      {
        variant: 'danger',
        description: 'Ação crítica ou destrutiva.',
        colors: {
          Light: { bg: '#DC2626', text: '#FFFFFF', border: 'transparent' },
          Dark: { bg: '#EF4444', text: '#FFFFFF', border: 'transparent' },
        }
      },
      {
        variant: 'ghost',
        description: 'Bordas e textos com fundo transparente.',
        colors: {
          Light: { bg: 'transparent', text: '#007993', border: '#007993' },
          Dark: { bg: 'transparent', text: '#00B4D8', border: '#0096B7' },
        }
      },
      {
        variant: 'text-link',
        description: 'Texto puro atuando como link ou botão discreto.',
        colors: {
          Light: { bg: 'transparent', text: '#007993', border: 'transparent' },
          Dark: { bg: 'transparent', text: '#00B4D8', border: 'transparent' },
        }
      }
    ]
  }
];
