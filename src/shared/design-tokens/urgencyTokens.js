export const URGENCY_TOKEN_META = {
  origin: 'code-first',
  note: 'Kit Central de Urgência — construído NO CÓDIGO (a partir dos prints), a portar pro Figma. Ver docs/kit-central-urgencia.md + figma-sync-ledger.md.',
  extractedAt: '2026-05-26',
  status: 'qa-registry',
};

// Inventário do kit (K1..K8) com status de construção.
export const URGENCY_INVENTORY = [
  { comp: 'StepItem (átomo)', kit: 'K2', code: 'atoms/StepItem (extraído de ProtocolSteps)', status: 'ok' },
  { comp: 'ProtocolSteps (recomposto)', kit: 'K2', code: 'molecules/ProtocolSteps → compõe StepItem', status: 'ok' },
  { comp: 'ProtocolHeader + steps + domain', kit: 'K1', code: 'organisms/ProtocolHeader (props steps/currentStep/domain/statusDot/timerIcon)', status: 'ok' },
  { comp: 'TimerCard (Porta-ECG/compressões/adrenalina)', kit: 'K3', code: 'organisms/TimerCard (usado no SCA; PCR pendente)', status: 'parcial' },
  { comp: 'ActionTile (ritmo/desfibrilar)', kit: 'K4', code: 'pendente', status: 'pendente' },
  { comp: 'ActionFooter (sticky + hint)', kit: 'K5', code: 'organisms/ActionFooter', status: 'ok' },
  { comp: 'TabBar (navbar inferior)', kit: 'K6', code: 'molecules/TabBar (prop sticky)', status: 'ok' },
  { comp: 'Timeline (linha do tempo)', kit: 'K7', code: 'organisms/Timeline', status: 'ok' },
  { comp: 'PatientDetail (blocos)', kit: 'K8', code: 'organisms/PatientDetail', status: 'ok' },
];
