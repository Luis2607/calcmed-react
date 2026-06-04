export const MIGRATION_PHASES = {
  migrated: 'Migrado',
  inProgress: 'Em migracao',
  queued: 'Na fila',
};

// Inventário das Centrais de Urgência — todas componentizadas em React.
// O bridge golden (iframe do HTML validado) foi removido: cada protocolo
// tem seu flow React próprio em src/features/<id>/.
export const PROTOCOLS = [
  {
    id: 'cad',
    title: 'Cetoacidose Diabetica',
    shortTitle: 'CAD',
    subtitle: 'HGT, insulina IV por peso, potassio e resolucao.',
    domain: 'protocolos',
    phase: MIGRATION_PHASES.migrated,
    priority: 1,
    storageKey: 'cad_protocolo_atual',
    historyKey: 'cad_historico',
  },
  {
    id: 'sepse',
    title: 'Sepse',
    shortTitle: 'Sepse',
    subtitle: 'Triagem, foco, antibiotico, vasopressor e metas.',
    domain: 'escores',
    phase: MIGRATION_PHASES.migrated,
    priority: 2,
    storageKey: 'sepse_protocolo_atual',
    historyKey: 'sepse_historico',
  },
  {
    id: 'pcr',
    title: 'Modo PCR',
    shortTitle: 'PCR',
    subtitle: 'Ritmo, drogas, choque, RCE, ACLS e historico.',
    domain: 'urgencias',
    phase: MIGRATION_PHASES.migrated,
    priority: 3,
    storageKey: 'pcr_protocolo_atual',
    historyKey: 'pcr_historico',
  },
  {
    id: 'avc',
    title: 'AVC',
    shortTitle: 'AVC',
    subtitle: 'Janela, NIHSS, contraindicacoes, trombolise e historico.',
    domain: 'neurologia',
    phase: MIGRATION_PHASES.migrated,
    priority: 4,
    storageKey: 'avc_protocolo_atual',
    historyKey: 'avc_historico_casos',
  },
  {
    id: 'sca',
    title: 'Sindrome Coronariana Aguda',
    shortTitle: 'SCA',
    subtitle: 'ECG, risco, troponina, antiagregacao e destino.',
    domain: 'cardio',
    phase: MIGRATION_PHASES.migrated,
    priority: 5,
    storageKey: 'sca_protocolo_atual',
    historyKey: 'sca_historico',
  },
];

export const getProtocolById = (id) => PROTOCOLS.find((protocol) => protocol.id === id);
