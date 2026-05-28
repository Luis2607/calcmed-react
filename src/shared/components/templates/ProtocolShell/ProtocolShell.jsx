import { ProtocolHeader } from '../../organisms/ProtocolHeader/ProtocolHeader';
import { TabBar } from '../../molecules/TabBar/TabBar';
import { ActionFooter } from '../../organisms/ActionFooter/ActionFooter';
import styles from './ProtocolShell.module.css';

/**
 * Template L2: ProtocolShell — a casca canônica dos 5 protocolos (achado F0.3: shell uniforme).
 * Compõe ProtocolHeader (K1, + ProtocolSteps OPCIONAL) → painel da aba ativa → ActionFooter
 * (K5, só na executar) → TabBar (K6, 3 abas fixas). NÃO reinventa nada.
 *
 * Props:
 *   domain · title · subtitle · timer? · timerVariant? · timerLabel? · onBack? · actions? · chips?
 *     → repassados ao ProtocolHeader (chips = tags por doença/contexto: modo/peso/idade)
 *   steps? · currentStep? · onStepClick? → stepper OPCIONAL (PCR = dashboard, sem)
 *   activeTab ('executar'|'historico'|'teoria') · onTabChange
 *   tabs? → override dos 3 itens da TabBar (label/icon/badge); default Executar/Histórico/Teoria
 *   executar · historico · teoria → conteúdo (node) de cada aba
 *   footer? → props do ActionFooter (renderizado só na aba executar)
 */
const DEFAULT_TABS = [
  { id: 'executar', label: 'Executar', icon: 'play' },
  { id: 'historico', label: 'Histórico', icon: 'tempo' },
  { id: 'teoria', label: 'Teoria', icon: 'livro' },
];

export const ProtocolShell = ({
  domain,
  title,
  subtitle,
  timer,
  timerVariant,
  timerLabel,
  onBack,
  actions,
  chips,
  steps,
  currentStep,
  onStepClick,
  stepStates,
  activeTab = 'executar',
  onTabChange,
  tabs = DEFAULT_TABS,
  executar,
  historico,
  teoria,
  footer,
}) => {
  const content =
    activeTab === 'historico' ? historico : activeTab === 'teoria' ? teoria : executar;

  return (
    <div className={styles.shell}>
      <ProtocolHeader
        domain={domain}
        title={title}
        subtitle={subtitle}
        timer={timer}
        timerVariant={timerVariant}
        timerLabel={timerLabel}
        onBack={onBack}
        actions={actions}
        chips={chips}
        steps={activeTab === 'executar' ? steps : undefined}
        currentStep={currentStep}
        onStepClick={onStepClick}
        stepStates={activeTab === 'executar' ? stepStates : undefined}
      />

      <main className={styles.body}>{content}</main>

      {activeTab === 'executar' && footer ? <ActionFooter {...footer} /> : null}

      <TabBar items={tabs} activeId={activeTab} onChange={onTabChange} sticky />
    </div>
  );
};
