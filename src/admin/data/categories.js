/**
 * Categorias hardcoded (UUID -> nome) — o cliente (Gustavo) só SELECIONA qual é,
 * nunca cria/edita. UUIDs reais extraídos do scores-v2.json do banco do Gui;
 * nomes confirmados com Luis (2026-06-01).
 *
 * Pendência leve: Gui confirmar o pareamento UUID<->nome e se o arquivo cheio
 * (113 KB) tem outras categorias além destas 5. Categoria nova = só adicionar aqui.
 */
export const CATEGORIES = [
  { id: 'c228a2c8-eb52-4713-b89b-d3af2ea0e6ad', name: 'Cardiologia' },
  { id: '560123b4-1377-4a1a-9af9-cd8b32be2fd2', name: 'Neurologia' },
  { id: 'c47937ba-8556-4ae7-adfc-687520f7401f', name: 'Pneumologia' },
  { id: 'e48b1cbd-28ef-4d75-87f7-d2056afc451c', name: 'Gastro' },
  { id: '0e4e5298-e809-42c3-af12-5606b103194d', name: 'Infectologia' },
];

const BY_ID = new Map(CATEGORIES.map((c) => [c.id, c.name]));

/** Nome humano da categoria, ou '' se vazia/desconhecida. */
export const categoryName = (id) => (id ? BY_ID.get(id) || '' : '');

/** True se o id existe no mapa hardcoded (UUID conhecido). */
export const isKnownCategory = (id) => BY_ID.has(id);

/** Opções p/ o <select> do filtro/editor. */
export const categoryOptions = CATEGORIES.map((c) => ({ value: c.id, label: c.name }));
