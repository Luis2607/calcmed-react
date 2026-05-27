const SCALE_STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

function makeScale(title, description, values, steps = SCALE_STEPS) {
  return {
    title,
    description,
    colors: values.map((value, index) => [`${title.toLowerCase()}/${steps[index]}`, value]),
  };
}

function makeTokenGroup(title, rows) {
  return {
    title,
    tokens: rows.map(([name, light, dark]) => ({ name, values: { Light: light, Dark: dark } })),
  };
}

export const COLOR_TOKEN_META = {
  figmaFileKey: 'zcLBv8e2kQsrsRko9FIrbZ',
  figmaPage: 'Cores',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

export const PRIMITIVE_COLOR_GROUPS = [
  {
    title: 'Brand',
    description: 'Cores institucionais do CalcMed.',
    colors: [
      ['brand/navy', '#002060'],
      ['brand/navy-dark', '#081C39'],
      ['brand/navy-deep', '#0D1B2A'],
      ['brand/red', '#CE0000'],
      ['brand/red-light', '#E80005'],
      ['brand/red-bright', '#FF3030'],
    ],
  },
  makeScale('Teal', 'Primary interactive', ['#F0FBFD', '#CCF3FA', '#99E6F4', '#5CD5EB', '#26C5DF', '#00B4D8', '#0096B7', '#007993', '#006275', '#004D5D', '#003340']),
  makeScale('Navy', 'Dark surfaces', ['#E8EEF4', '#C8D5E4', '#9FB2CC', '#708AAC', '#4B648C', '#364C72', '#2A3F5F', '#223249', '#1A2942', '#111C2E', '#0D1B2A']),
  makeScale('Slate', 'Neutrals', ['#FFFFFF', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569', '#334155', '#1E293B', '#0F172A', '#020617'], ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']),
  makeScale('Emerald', 'Success', ['#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857', '#065F46', '#064E3B', '#022C22']),
  makeScale('Red', 'Critical', ['#FEF2F2', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A']),
  makeScale('Amber', 'Warning', ['#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F', '#451A03']),
  makeScale('Blue', 'Diluicoes', ['#EFF6FF', '#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554']),
  makeScale('Purple', 'Protocolos', ['#FAF5FF', '#F3E8FF', '#E9D5FF', '#D8B4FE', '#C084FC', '#A855F7', '#9333EA', '#7E22CE', '#6B21A8', '#581C87', '#3B0764']),
  makeScale('Indigo', 'Conversores', ['#EEF2FF', '#E0E7FF', '#C7D2FE', '#A5B4FC', '#818CF8', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B']),
  makeScale('Rose', 'Urgencias', ['#FFF1F2', '#FFE4E6', '#FECDD3', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48', '#BE123C', '#9F1239', '#881337', '#4C0519']),
  makeScale('Orange', 'Calculadoras', ['#FFF7ED', '#FFEDD5', '#FED7AA', '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12', '#431407']),
  makeScale('Cyan', 'Escores', ['#ECFEFF', '#CFFAFE', '#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63', '#083344']),
];

export const SEMANTIC_COLOR_GROUPS = [
  makeTokenGroup('Superficies', [
    ['fundo/padrao', '#F8FAFC', '#0D1B2A'],
    ['fundo/superficie', '#FFFFFF', '#111C2E'],
    ['fundo/cartao', '#FFFFFF', '#1A2942'],
    ['fundo/elevado', '#F1F5F9', '#223249'],
    ['fundo/hover', '#F1F5F9', '#364C72'],
    ['fundo/sobreposicao', '#000000', '#000000'],
  ]),
  makeTokenGroup('Texto', [
    ['texto/padrao', '#0F172A', '#F1F5F9'],
    ['texto/secundario', '#475569', '#94A3B8'],
    ['texto/terciario', '#94A3B8', '#64748B'],
    ['texto/desabilitado', '#CBD5E1', '#475569'],
    ['texto/sobre-destaque', '#FFFFFF', '#FFFFFF'],
    ['texto/link', '#007993', '#00B4D8'],
    ['texto/em-fundo-saturado', '#FFFFFF', '#0F172A'],
  ]),
  makeTokenGroup('Bordas', [
    ['borda/padrao', '#E2E8F0', '#2A3F5F'],
    ['borda/sutil', '#F1F5F9', '#223249'],
    ['borda/foco', '#00B4D8', '#00B4D8'],
    ['borda/erro', '#EF4444', '#F87171'],
  ]),
  makeTokenGroup('Interativos', [
    ['interativo/primario', '#007993', '#0096B7'],
    ['interativo/primario-hover', '#006275', '#007993'],
    ['interativo/primario-ativo', '#004D5D', '#006275'],
    ['interativo/destaque', '#00B4D8', '#00B4D8'],
    ['interativo/perigo', '#DC2626', '#EF4444'],
    ['interativo/desabilitado', '#F1F5F9', '#1A2942'],
    ['interativo/desabilitado-texto', '#CBD5E1', '#475569'],
  ]),
  makeTokenGroup('Feedback', [
    ['retorno/sucesso', '#047857', '#34D399'],
    ['retorno/sucesso-fundo', '#ECFDF5', '#022C22'],
    ['retorno/sucesso-borda', '#A7F3D0', '#065F46'],
    ['retorno/critico', '#991B1B', '#FCA5A5'],
    ['retorno/critico-fundo', '#FEF2F2', '#450A0A'],
    ['retorno/critico-borda', '#FECACA', '#991B1B'],
    ['retorno/atencao', '#92400E', '#FCD34D'],
    ['retorno/atencao-fundo', '#FFFBEB', '#451A03'],
    ['retorno/atencao-borda', '#FDE68A', '#92400E'],
  ]),
  makeTokenGroup('Produto', [
    ['produto/destaque', '#A855F7', '#C084FC'],
    ['produto/destaque-fundo', '#A855F7', '#A855F7'],
    ['produto/destaque-on', '#FFFFFF', '#FFFFFF'],
    ['icone/em-fundo-claro', '#0F172A', '#0F172A'],
    ['rating/preenchido', '#F59E0B', '#FACC15'],
  ]),
];

export const DOMAIN_COLOR_GROUP = makeTokenGroup('Dominios', [
  ['dominio/urgencias', '#E11D48', '#FB7185'],
  ['dominio/urgencias-fundo', '#FFF1F2', '#4C0519'],
  ['dominio/urgencias-texto', '#E11D48', '#FDA4AF'],
  ['dominio/diluicoes', '#3B82F6', '#60A5FA'],
  ['dominio/diluicoes-fundo', '#EFF6FF', '#172554'],
  ['dominio/diluicoes-texto', '#1D4ED8', '#93C5FD'],
  ['dominio/calculadoras', '#F97316', '#FB923C'],
  ['dominio/calculadoras-fundo', '#FFF7ED', '#431407'],
  ['dominio/calculadoras-texto', '#EA580C', '#FDBA74'],
  ['dominio/protocolos', '#A855F7', '#C084FC'],
  ['dominio/protocolos-fundo', '#FAF5FF', '#3B0764'],
  ['dominio/protocolos-texto', '#9333EA', '#D8B4FE'],
  ['dominio/escores', '#06B6D4', '#22D3EE'],
  ['dominio/escores-fundo', '#ECFEFF', '#083344'],
  ['dominio/escores-texto', '#0891B2', '#67E8F9'],
  ['dominio/conversores', '#6366F1', '#818CF8'],
  ['dominio/conversores-fundo', '#EEF2FF', '#1E1B4B'],
  ['dominio/conversores-texto', '#4F46E5', '#A5B4FC'],
]);

export const COMPONENT_COLOR_GROUPS = [
  makeTokenGroup('Botao', [
    ['botao/primario-fundo', '#007993', '#0096B7'],
    ['botao/primario-hover', '#006275', '#007993'],
    ['botao/primario-ativo', '#004D5D', '#006275'],
    ['botao/primario-texto', '#FFFFFF', '#FFFFFF'],
    ['botao/secundario-fundo', '#F1F5F9', '#223249'],
    ['botao/secundario-borda', '#E2E8F0', '#2A3F5F'],
    ['botao/secundario-texto', '#0F172A', '#F1F5F9'],
    ['botao/perigo-fundo', '#DC2626', '#EF4444'],
    ['botao/perigo-texto', '#FFFFFF', '#FFFFFF'],
    ['botao/ghost-borda', '#007993', '#0096B7'],
    ['botao/ghost-texto', '#007993', '#0096B7'],
    ['botao/texto-link', '#007993', '#00B4D8'],
    ['botao/desabilitado-fundo', '#F1F5F9', '#1A2942'],
    ['botao/desabilitado-texto', '#CBD5E1', '#475569'],
  ]),
  makeTokenGroup('Input', [
    ['input/fundo', '#FFFFFF', '#1A2942'],
    ['input/borda', '#E2E8F0', '#2A3F5F'],
    ['input/borda-foco', '#00B4D8', '#00B4D8'],
    ['input/borda-erro', '#EF4444', '#F87171'],
    ['input/texto', '#0F172A', '#F1F5F9'],
    ['input/placeholder', '#64748B', '#64748B'],
    ['input/rotulo', '#475569', '#94A3B8'],
  ]),
  makeTokenGroup('Cartao', [
    ['cartao/fundo', '#FFFFFF', '#1A2942'],
    ['cartao/borda', '#E2E8F0', '#364C72'],
    ['cartao/borda-selecionado', '#00B4D8', '#00B4D8'],
    ['cartao/hover-fundo', '#F1F5F9', '#364C72'],
  ]),
  makeTokenGroup('Alerta', [
    ['alerta/info-fundo', '#F8FAFC', '#1A2942'],
    ['alerta/resultado-fundo', '#ECFDF5', '#022C22'],
    ['alerta/resultado-borda', '#047857', '#34D399'],
    ['alerta/critico-fundo', '#FEF2F2', '#450A0A'],
    ['alerta/critico-borda', '#991B1B', '#FCA5A5'],
    ['alerta/atencao-fundo', '#FFFBEB', '#451A03'],
    ['alerta/atencao-borda', '#92400E', '#FCD34D'],
  ]),
  makeTokenGroup('Navegacao', [
    ['nav/fundo', '#FFFFFF', '#111C2E'],
    ['nav/borda', '#E2E8F0', '#364C72'],
    ['nav/icone-padrao', '#64748B', '#64748B'],
    ['nav/icone-ativo', '#00B4D8', '#00B4D8'],
    ['nav/label-ativo', '#00B4D8', '#00B4D8'],
  ]),
  makeTokenGroup('Chip e toast', [
    ['chip/fundo', '#F1F5F9', '#223249'],
    ['chip/texto', '#475569', '#94A3B8'],
    ['chip/ativo-fundo', '#007993', '#00B4D8'],
    ['chip/ativo-texto', '#FFFFFF', '#FFFFFF'],
    ['toast/sucesso-fundo', '#ECFDF5', '#022C22'],
    ['toast/sucesso-texto', '#047857', '#34D399'],
    ['toast/erro-fundo', '#FEF2F2', '#450A0A'],
    ['toast/erro-texto', '#991B1B', '#FCA5A5'],
  ]),
];

export const MODE_COLOR_GROUP = {
  title: 'Modo Adulto / Pediatria',
  tokens: [
    { name: 'modo/header-accent', values: { Adulto: '#E11D48', Pediatria: '#C084FC' } },
    { name: 'modo/header-accent-bg', values: { Adulto: '#FEF2F2', Pediatria: '#FAF5FF' } },
    { name: 'modo/header-fundo', values: { Adulto: '#FFFFFF', Pediatria: '#FAF5FF' } },
    { name: 'modo/interativo-fundo', values: { Adulto: '#F1F5F9', Pediatria: '#FAF5FF' } },
    { name: 'modo/interativo-primario', values: { Adulto: '#007993', Pediatria: '#C084FC' } },
    { name: 'modo/secao-label', values: { Adulto: '#94A3B8', Pediatria: '#94A3B8' } },
    { name: 'modo/alerta-info-fundo', values: { Adulto: '#FFFFFF', Pediatria: '#F1F5F9' } },
    { name: 'modo/alerta-info-titulo', values: { Adulto: '#0F172A', Pediatria: '#475569' } },
    { name: 'modo/alerta-critico-fundo', values: { Adulto: '#FFFFFF', Pediatria: '#FEF2F2' } },
    { name: 'modo/alerta-critico-titulo', values: { Adulto: '#0F172A', Pediatria: '#991B1B' } },
    { name: 'modo/alerta-atencao-fundo', values: { Adulto: '#FFFFFF', Pediatria: '#FFFBEB' } },
    { name: 'modo/alerta-atencao-titulo', values: { Adulto: '#0F172A', Pediatria: '#92400E' } },
    { name: 'modo/alerta-resultado-fundo', values: { Adulto: '#FFFFFF', Pediatria: '#ECFDF5' } },
    { name: 'modo/alerta-resultado-titulo', values: { Adulto: '#0F172A', Pediatria: '#047857' } },
  ],
};
