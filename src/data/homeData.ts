export type Domain = 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'
export type Status = 'free' | 'premium'

export interface Feature {
  abbr: string
  domain: Domain
  name: string
  status: Status
}

export const favorites: Feature[] = [
  { abbr: 'IOT', domain: 'urg', name: 'Intubação', status: 'free' },
  { abbr: 'DVA', domain: 'dil', name: 'Drogas Vasoativas', status: 'free' },
  { abbr: 'CrCl', domain: 'calc', name: 'Clearance Creatinina', status: 'free' },
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
    ],
  },
  {
    icon: 'eyedropper', domain: 'dil', name: 'Diluições e Doses', count: 6,
    items: [
      { abbr: 'DVA', domain: 'dil', name: 'Drogas Vasoativas', status: 'free' },
      { abbr: 'Sed', domain: 'dil', name: 'Sedação', status: 'free' },
      { abbr: 'ATB', domain: 'dil', name: 'Antibióticos', status: 'free' },
    ],
  },
  {
    icon: 'calculator', domain: 'calc', name: 'Calculadoras', count: 11,
    items: [
      { abbr: 'CrCl', domain: 'calc', name: 'Clearance Creatinina', status: 'free' },
      { abbr: 'IMC', domain: 'calc', name: 'Índice Massa Corp.', status: 'free' },
      { abbr: 'Na+', domain: 'calc', name: 'Sódio Corrigido', status: 'free' },
    ],
  },
  {
    icon: 'clipboard-text', domain: 'prot', name: 'Protocolos', count: 13,
    items: [
      { abbr: 'ACLS', domain: 'prot', name: 'Suporte Avançado', status: 'free' },
      { abbr: 'PALS', domain: 'prot', name: 'Suporte Pediátrico', status: 'free' },
    ],
  },
  {
    icon: 'chart-bar', domain: 'esc', name: 'Escores', count: 22,
    items: [
      { abbr: 'GCS', domain: 'esc', name: 'Glasgow', status: 'free' },
      { abbr: 'NIHSS', domain: 'esc', name: 'AVC', status: 'free' },
      { abbr: 'RASS', domain: 'esc', name: 'Sedação', status: 'free' },
    ],
  },
  {
    icon: 'arrows-left-right', domain: 'conv', name: 'Conversores', count: 7,
    items: [
      { abbr: 'Opi', domain: 'conv', name: 'Opióides', status: 'free' },
      { abbr: 'Ins', domain: 'conv', name: 'Insulina', status: 'free' },
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
