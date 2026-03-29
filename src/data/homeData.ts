export type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
export type Status = 'free' | 'premium' | 'teste' | 'assinante'

export interface Feature {
  abbr: string
  domain: Domain
  name: string
  status: Status
}

export const favorites: Feature[] = [
  { abbr: 'IOT', domain: 'urg', name: 'Intubação', status: 'free' },
  { abbr: 'DVA', domain: 'dil', name: 'Drogas Vasoativas', status: 'free' },
  { abbr: 'CrCl', domain: 'calc', name: 'Clearance de Creatinina', status: 'free' },
  { abbr: 'VM', domain: 'urg', name: 'Ventilação Mecânica', status: 'free' },
]

export const recents = [
  { name: 'Clearance de Creatinina', time: '2 min' },
  { name: 'Noradrenalina', time: '15 min' },
]

export interface Category {
  icon: string
  domain: Domain
  name: string
  count: number
  defaultOpen?: boolean
  items: Feature[]
}

export const categories: Category[] = [
  {
    icon: 'siren', domain: 'urg', name: 'Urgências', count: 15, defaultOpen: true,
    items: [
      { abbr: 'IOT', domain: 'urg', name: 'Intubação', status: 'free' },
      { abbr: 'PCR', domain: 'urg', name: 'Parada Cardíaca', status: 'free' },
      { abbr: 'DHE', domain: 'urg', name: 'Dist. Hidroeletrolíticos', status: 'premium' },
      { abbr: 'CAD', domain: 'urg', name: 'Cetoacidose Diabética', status: 'free' },
      { abbr: 'VM', domain: 'urg', name: 'Ventilação Mecânica', status: 'free' },
      { abbr: 'Sepse', domain: 'urg', name: 'Sepse', status: 'free' },
      { abbr: 'Anaf', domain: 'urg', name: 'Anafilaxia', status: 'free' },
      { abbr: 'HAS', domain: 'urg', name: 'Crise Hipertensiva', status: 'free' },
      { abbr: 'EAP', domain: 'urg', name: 'Edema Agudo Pulmão', status: 'teste' },
      { abbr: 'AVC', domain: 'urg', name: 'AVC Isquêmico', status: 'free' },
      { abbr: 'SCA', domain: 'urg', name: 'Síndrome Coronariana', status: 'premium' },
      { abbr: 'Coma', domain: 'urg', name: 'Coma', status: 'free' },
      { abbr: 'TEP', domain: 'urg', name: 'Tromboembolismo Pulm.', status: 'premium' },
      { abbr: 'Hemo', domain: 'urg', name: 'Hemorragia Digestiva', status: 'free' },
      { abbr: 'Pneum', domain: 'urg', name: 'Pneumotórax', status: 'free' },
    ],
  },
  {
    icon: 'eyedropper', domain: 'dil', name: 'Diluições e Doses', count: 6,
    items: [
      { abbr: 'DVA', domain: 'dil', name: 'Drogas Vasoativas', status: 'free' },
      { abbr: 'Sed', domain: 'dil', name: 'Sedação', status: 'free' },
      { abbr: 'ATB', domain: 'dil', name: 'Antibióticos', status: 'free' },
      { abbr: 'SeqR', domain: 'dil', name: 'Seq. Rápida', status: 'free' },
      { abbr: 'Man', domain: 'dil', name: 'Manutenção', status: 'teste' },
      { abbr: 'Elet', domain: 'dil', name: 'Eletrólitos', status: 'free' },
    ],
  },
  {
    icon: 'calculator', domain: 'calc', name: 'Calculadoras', count: 11,
    items: [
      { abbr: 'CrCl', domain: 'calc', name: 'Clearance de Creatinina', status: 'free' },
      { abbr: 'IMC', domain: 'calc', name: 'Índice Massa Corp.', status: 'free' },
      { abbr: 'Na+', domain: 'calc', name: 'Sódio Corrigido', status: 'free' },
      { abbr: 'K+', domain: 'calc', name: 'Potássio Corrigido', status: 'free' },
      { abbr: 'Ca2+', domain: 'calc', name: 'Cálcio Corrigido', status: 'free' },
      { abbr: 'Osm', domain: 'calc', name: 'Osmolaridade', status: 'free' },
      { abbr: 'AG', domain: 'calc', name: 'Ânion Gap', status: 'free' },
      { abbr: 'TFG', domain: 'calc', name: 'Taxa Filtração Glom.', status: 'free' },
      { abbr: 'PAM', domain: 'calc', name: 'Pressão Arterial Média', status: 'free' },
      { abbr: 'SC', domain: 'calc', name: 'Superfície Corporal', status: 'premium' },
      { abbr: 'Gaso', domain: 'calc', name: 'Gasometrial', status: 'assinante' },
    ],
  },
  {
    icon: 'clipboard-text', domain: 'prot', name: 'Protocolos', count: 13,
    items: [
      { abbr: 'ACLS', domain: 'prot', name: 'Suporte Avançado', status: 'free' },
      { abbr: 'PALS', domain: 'prot', name: 'Suporte Pediátrico', status: 'free' },
      { abbr: 'BLS', domain: 'prot', name: 'Suporte Básico', status: 'free' },
      { abbr: 'Sepse', domain: 'prot', name: 'Protocolo Sepse', status: 'free' },
      { abbr: 'DVA', domain: 'prot', name: 'Protocolo DVA', status: 'free' },
      { abbr: 'TEP', domain: 'prot', name: 'Protocolo TEP', status: 'premium' },
      { abbr: 'AVC', domain: 'prot', name: 'Protocolo AVC', status: 'free' },
      { abbr: 'SCA', domain: 'prot', name: 'Protocolo SCA', status: 'free' },
      { abbr: 'CAD', domain: 'prot', name: 'Protocolo CAD', status: 'free' },
      { abbr: 'HAS', domain: 'prot', name: 'Crise Hipertensiva', status: 'free' },
      { abbr: 'Anaf', domain: 'prot', name: 'Protocolo Anafilaxia', status: 'free' },
      { abbr: 'HTx', domain: 'prot', name: 'Hemotransfusão', status: 'teste' },
      { abbr: 'Dor', domain: 'prot', name: 'Manejo da Dor', status: 'assinante' },
    ],
  },
  {
    icon: 'chart-bar', domain: 'esc', name: 'Escores', count: 22,
    items: [
      { abbr: 'GCS', domain: 'esc', name: 'Glasgow', status: 'free' },
      { abbr: 'NIHSS', domain: 'esc', name: 'AVC', status: 'free' },
      { abbr: 'RASS', domain: 'esc', name: 'Sedação', status: 'free' },
      { abbr: 'SOFA', domain: 'esc', name: 'SOFA', status: 'free' },
      { abbr: 'qSOFA', domain: 'esc', name: 'qSOFA', status: 'free' },
      { abbr: 'APACHE', domain: 'esc', name: 'APACHE II', status: 'premium' },
      { abbr: 'SAPS', domain: 'esc', name: 'SAPS 3', status: 'premium' },
      { abbr: 'Wells', domain: 'esc', name: 'Wells TEP', status: 'free' },
      { abbr: 'Geneva', domain: 'esc', name: 'Geneva Revisado', status: 'free' },
      { abbr: 'CHA2', domain: 'esc', name: 'CHA2DS2-VASc', status: 'free' },
      { abbr: 'HAS-B', domain: 'esc', name: 'HAS-BLED', status: 'free' },
      { abbr: 'CURB', domain: 'esc', name: 'CURB-65', status: 'free' },
      { abbr: 'NEWS', domain: 'esc', name: 'NEWS-2', status: 'free' },
      { abbr: 'MEWS', domain: 'esc', name: 'MEWS', status: 'free' },
      { abbr: 'Child', domain: 'esc', name: 'Child-Pugh', status: 'free' },
      { abbr: 'MELD', domain: 'esc', name: 'MELD', status: 'free' },
      { abbr: 'Rankin', domain: 'esc', name: 'Rankin Modificada', status: 'free' },
      { abbr: 'TIMI', domain: 'esc', name: 'TIMI Risk', status: 'free' },
      { abbr: 'GRACE', domain: 'esc', name: 'GRACE', status: 'teste' },
      { abbr: 'Aldrete', domain: 'esc', name: 'Aldrete', status: 'free' },
      { abbr: 'Ramsay', domain: 'esc', name: 'Ramsay', status: 'free' },
      { abbr: 'FOUR', domain: 'esc', name: 'FOUR Score', status: 'free' },
    ],
  },
  {
    icon: 'arrows-left-right', domain: 'conv', name: 'Conversores', count: 7,
    items: [
      { abbr: 'Opi', domain: 'conv', name: 'Opióides', status: 'free' },
      { abbr: 'Ins', domain: 'conv', name: 'Insulina', status: 'free' },
      { abbr: 'Cort', domain: 'conv', name: 'Corticóides', status: 'free' },
      { abbr: 'BZD', domain: 'conv', name: 'Benzodiazepínicos', status: 'free' },
      { abbr: 'Temp', domain: 'conv', name: 'Temperatura', status: 'free' },
      { abbr: 'Peso', domain: 'conv', name: 'Peso/Altura', status: 'free' },
      { abbr: 'Unid', domain: 'conv', name: 'Unidades Lab.', status: 'free' },
    ],
  },
]

// Search database
export const searchDb = [
  { nome: 'Noradrenalina', sub: 'Drogas Vasoativas', dominio: 'dil', icon: 'eyedropper', grupo: 'Diluições e Doses' },
  { nome: 'Noradrenalina', sub: 'Protocolo DVA', dominio: 'prot', icon: 'clipboard-text', grupo: 'Protocolos' },
  { nome: 'Noradrenalina', sub: 'Choque Séptico', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Intubação', sub: 'Sequência Rápida', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Clearance de Creatinina', sub: 'Calculadora', dominio: 'calc', icon: 'calculator', grupo: 'Calculadoras' },
  { nome: 'Glasgow', sub: 'Escala de Coma', dominio: 'esc', icon: 'chart-bar', grupo: 'Escores' },
  { nome: 'Potássio', sub: 'Dist. Hidroeletrolíticos', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Ventilação Mecânica', sub: 'Parâmetros', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'DVA', sub: 'Drogas Vasoativas', dominio: 'dil', icon: 'eyedropper', grupo: 'Diluições e Doses' },
  { nome: 'ACLS', sub: 'Suporte Avançado', dominio: 'prot', icon: 'clipboard-text', grupo: 'Protocolos' },
  { nome: 'Cetoacidose Diabética', sub: 'CAD', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Sedação', sub: 'Manutenção', dominio: 'dil', icon: 'eyedropper', grupo: 'Diluições e Doses' },
  { nome: 'NIHSS', sub: 'AVC', dominio: 'esc', icon: 'chart-bar', grupo: 'Escores' },
  { nome: 'RASS', sub: 'Sedação', dominio: 'esc', icon: 'chart-bar', grupo: 'Escores' },
  { nome: 'Sódio Corrigido', sub: 'Na+', dominio: 'calc', icon: 'calculator', grupo: 'Calculadoras' },
  { nome: 'IMC', sub: 'Índice Massa Corporal', dominio: 'calc', icon: 'calculator', grupo: 'Calculadoras' },
  { nome: 'Parada Cardíaca', sub: 'PCR', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Anafilaxia', sub: 'Protocolo', dominio: 'urg', icon: 'siren', grupo: 'Urgências' },
  { nome: 'Opióides', sub: 'Conversão', dominio: 'conv', icon: 'arrows-left-right', grupo: 'Conversores' },
]

export const domColors: Record<string, string> = {
  urg: 'var(--dom-urg)', dil: 'var(--dom-dil)', calc: 'var(--dom-calc)',
  prot: 'var(--dom-prot)', esc: 'var(--dom-esc)', conv: 'var(--dom-conv)',
}
