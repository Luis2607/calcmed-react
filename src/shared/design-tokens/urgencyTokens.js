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
  { comp: 'ActionTile (ritmo/desfibrilar)', kit: 'K4', code: 'molecules/ActionTile (golden PCR .btn-acao-grande; compõe Icon) · raio/coração pendentes no Icon', status: 'ok' },
  { comp: 'ActionFooter (sticky + hint)', kit: 'K5', code: 'organisms/ActionFooter', status: 'ok' },
  { comp: 'TabBar (navbar inferior)', kit: 'K6', code: 'molecules/TabBar (prop sticky)', status: 'ok' },
  { comp: 'Timeline (linha do tempo)', kit: 'K7', code: 'organisms/Timeline', status: 'ok' },
  { comp: 'PatientDetail (blocos)', kit: 'K8', code: 'organisms/PatientDetail', status: 'ok' },
  { comp: 'StepHeader (cabeçalho de tela)', kit: 'F0.1a', code: 'molecules/StepHeader → compõe InfoButton', status: 'ok' },
  { comp: 'OptionCard (escolha rica)', kit: 'F0.1b', code: 'molecules/OptionCard (golden .exame-card + seleção .faixa-chip; tones tokenizados)', status: 'ok' },
  { comp: 'StatGrid (resumo em tiles)', kit: 'F0.1c', code: 'molecules/StatGrid (golden .valor-card; data-columns 1-4)', status: 'ok' },
  { comp: 'RangeChip (seletor de faixa)', kit: 'F0.1d', code: 'molecules/Chip → RangeChip (golden .faixa-chip; substitui FieldTrigger; tone critical)', status: 'ok' },
  { comp: 'ClinicalCard variante plain', kit: 'F0.1f', code: 'organisms/ClinicalCard (variant=plain, golden .exame-card; aditivo, default inalterado)', status: 'ok' },
];
