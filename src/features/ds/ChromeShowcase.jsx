import { useState } from 'react';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader';
import { ProtocolSteps } from '../../shared/components/molecules/ProtocolSteps';
import styles from './SheetGallery.module.css';

export function ChromeShowcase() {
  const [audio, setAudio] = useState(true);
  const [step, setStep] = useState(3);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Headers &amp; Steppers</span>
        <span className={styles.subtitle}>ProtocolHeader (variantes PCR/CAD) + ProtocolSteps · React tokenizado.</span>
      </div>

      <ProtocolHeader
        title="MODO PCR"
        subtitle="Aberto há"
        timer="1h14"
        timerVariant="stacked"
        actions={[
          { icon: audio ? 'audio' : 'audioOff', label: 'Áudio', active: audio, onClick: () => setAudio((a) => !a) },
          { icon: 'edit', label: 'Editar paciente', onClick: () => {} },
          { icon: 'exit', label: 'Sair', onClick: () => {} },
        ]}
        chips={[{ label: 'CICLO 7', mono: true }, { label: 'ADREN ×0', mono: true }]}
      />

      <ProtocolHeader
        onBack={() => {}}
        title="Protocolo CAD"
        subtitle="Cetoacidose Diabética"
        timer="43:53"
        timerLabel="Caso"
        chips={[{ label: 'Adulto', tone: 'primario' }, { label: '32a', mono: true }, { label: '70kg', mono: true }]}
      />

      <ProtocolSteps
        steps={['Diagnóstico', 'Exames', 'Insulina', 'Controle', 'Alta', 'Fim']}
        current={step}
        onStepClick={setStep}
      />
    </section>
  );
}
