import { useState } from 'react';
import styles from './ButtonsGallery.module.css';
import { URGENCY_TOKEN_META, URGENCY_INVENTORY } from '../../shared/design-tokens/urgencyTokens';
import { StepItem } from '../../shared/components/atoms/StepItem/StepItem';
import { ProtocolSteps } from '../../shared/components/molecules/ProtocolSteps/ProtocolSteps';
import { TabBar } from '../../shared/components/molecules/TabBar/TabBar';
import { ProtocolHeader } from '../../shared/components/organisms/ProtocolHeader/ProtocolHeader';
import { ActionFooter } from '../../shared/components/organisms/ActionFooter/ActionFooter';
import { Timeline } from '../../shared/components/organisms/Timeline/Timeline';
import { PatientDetail } from '../../shared/components/organisms/PatientDetail/PatientDetail';
import { StepHeader } from '../../shared/components/molecules/StepHeader/StepHeader';
import { OptionCard } from '../../shared/components/molecules/OptionCard/OptionCard';
import { StatGrid } from '../../shared/components/molecules/StatGrid/StatGrid';
import { RangeChip } from '../../shared/components/molecules/Chip/Chip';
import { ActionTile } from '../../shared/components/molecules/ActionTile/ActionTile';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard/ClinicalCard';
import { TimerCard } from '../../shared/components/organisms/TimerCard/TimerCard';
import { DetailRow } from '../../shared/components/molecules/DetailRow/DetailRow';

const STATUS_BADGE = { ok: 'OK', pendente: 'PENDENTE' };

const timelineEvents = [
  {
    id: 'e1',
    time: '00:00',
    title: 'Protocolo iniciado',
    description: 'Paciente identificado e monitorizacao inicial registrada.',
    status: 'info',
    statusLabel: 'Inicio',
  },
  {
    id: 'e2',
    time: '02:00',
    title: 'Ritmo checado',
    description: 'FV/TV sem pulso. Choque indicado antes de retomar compressoes.',
    status: 'critical',
    statusLabel: 'Critico',
    meta: '200 J',
  },
  {
    id: 'e3',
    time: '04:10',
    title: 'Adrenalina aplicada',
    description: 'Dose registrada e novo ciclo programado.',
    status: 'warning',
    statusLabel: 'Droga',
    meta: '1 mg IV',
  },
];

const patientSections = [
  {
    title: 'Resumo clinico',
    meta: 'CAD',
    rows: [
      { label: 'Modo', value: 'Adulto' },
      { label: 'Criterios atendidos', value: '3/3' },
      { label: 'Desfecho', value: 'Alta segura' },
    ],
  },
  {
    title: 'Condutas principais',
    rows: [
      { label: 'Soro inicial', value: 'SF 0,9%' },
      { label: 'Insulina', value: '7 U/h' },
      { label: 'Medidas lancadas', value: '6' },
    ],
  },
];

export function UrgencyGallery() {
  const [step, setStep] = useState(2);
  const [tab, setTab] = useState('executar');
  const [strategy, setStrategy] = useState('ppci');
  const [kRange, setKRange] = useState('normal');

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva · code-first</span>
        <h1>Central de Urgencia (kit)</h1>
        <p>Componentes do app de urgencia, construidos no codigo (a partir dos prints) para portar ao Figma. Ver docs/kit-central-urgencia.md.</p>
        <span className={styles.sourceMeta}>{URGENCY_TOKEN_META.note}</span>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Inventario do kit (K1-K8)</h2><p>Status real de construcao.</p></div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Componente</th>
                <th className={styles.tableHeader}>Kit</th>
                <th className={styles.tableHeader}>Codigo</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {URGENCY_INVENTORY.map((c) => (
                <tr key={c.comp} className={styles.tableRow} data-drift={c.status !== 'ok'}>
                  <td className={styles.tableCell}><strong>{c.comp}</strong></td>
                  <td className={styles.tableCell}>{c.kit}</td>
                  <td className={styles.tableCell}><code className={styles.specCode}>{c.code}</code></td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${c.status === 'ok' ? styles.ok : styles.drift}`}>{STATUS_BADGE[c.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K2 · StepItem (atomo)</h2><p>Estados: completo / ativo / pendente.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', gap: 32 }}>
          <StepItem number={1} label="Completo" state="completed" disabled={false} onClick={() => {}} />
          <StepItem number={2} label="Ativo" state="active" disabled />
          <StepItem number={3} label="Pendente" state="pending" disabled />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K2 · ProtocolSteps (grupo N=5)</h2><p>Compoe StepItem. Clique nos completos.</p></div>
        <div className={styles.tableContainer} style={{ padding: 0 }}>
          <ProtocolSteps steps={['Triagem', 'ECG', 'Estratif.', 'Conduzir', 'Reavaliar']} current={step} onStepClick={setStep} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K1 · ProtocolHeader + steps</h2><p>Header com cronometro, acoes e steps embutidos.</p></div>
        <div className={styles.tableContainer} style={{ padding: 0 }}>
          <ProtocolHeader
            domain="sca"
            title="Modo SCA"
            subtitle="Aberto ha"
            timer="00:00"
            timerVariant="stacked"
            actions={[{ icon: 'edit', label: 'Editar' }, { icon: 'exit', label: 'Sair' }]}
            steps={['Triagem', 'ECG', 'Estratif.', 'Conduzir', 'Reavaliar']}
            currentStep={step}
            onStepClick={setStep}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K5 · ActionFooter</h2><p>Barra fixa acima da navbar, com texto auxiliar opcional.</p></div>
        <div className={styles.tableContainer} style={{ padding: 0, maxWidth: 430 }}>
          <ActionFooter
            hint="Proximo: confirmar ECG em ate 10 min"
            meta="T+04:10"
            secondary={{ label: 'Sair', variant: 'secondary' }}
            primary={{ label: 'Confirmar', variant: 'primary', rightIcon: 'seta-direita' }}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K6 · TabBar</h2><p>Navbar inferior do protocolo: executar, historico e teoria/ACLS.</p></div>
        <div className={styles.tableContainer} style={{ padding: 0, maxWidth: 430 }}>
          <TabBar
            activeId={tab}
            onChange={setTab}
            items={[
              { id: 'executar', label: 'Executar', icon: 'onda-ecg' },
              { id: 'historico', label: 'Historico', icon: 'tempo', badge: '3' },
              { id: 'teoria', label: 'Teoria', icon: 'informacao' },
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K7 · Timeline</h2><p>Linha do tempo de eventos do atendimento.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430 }}>
          <Timeline events={timelineEvents} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>K8 · PatientDetail</h2><p>Caso aberto no historico, em blocos escaneaveis.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430 }}>
          <PatientDetail
            initials="TAM"
            protocol="Caso encerrado · CAD"
            status="Alta"
            statusTone="novo"
            summary={[
              { label: 'Duracao', value: '43 min' },
              { label: 'Idade', value: '32a' },
              { label: 'Peso', value: '70kg' },
            ]}
            sections={patientSections}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1a · StepHeader (cabecalho de tela)</h2><p>Golden .tela-cabecalho: titulo + subtitulo + info/acao. Reusa InfoButton.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430, display: 'flex', flexDirection: 'column', gap: 32 }}>
          <StepHeader title="Triagem inicial" />
          <StepHeader title="Estratificacao de risco" subtitle="Calcule HEART e confirme o ECG antes de conduzir." />
          <StepHeader
            title="Conduzir tratamento"
            subtitle="Toque no ? para abrir a teoria do passo."
            onInfo={() => {}}
          />
          <StepHeader
            title="Reavaliar"
            subtitle="Passo 5 de 5."
            action={<span className={styles.statusBadge}>5/5</span>}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1b · OptionCard (escolha rica)</h2><p>Padrao golden .exame-card + selecao .faixa-chip (borda 2px no tone). Tones tokenizados.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <OptionCard
            title="PPCI"
            meta="Preferencial"
            tone="info"
            selected={strategy === 'ppci'}
            onClick={() => setStrategy('ppci')}
          >
            Angioplastia primaria em ate 120 min do primeiro contato.
          </OptionCard>
          <OptionCard
            title="Fibrinolise"
            meta="Se atraso PCI"
            tone="warning"
            selected={strategy === 'fibrinolise'}
            onClick={() => setStrategy('fibrinolise')}
            description="Quando a PPCI nao for viavel na janela recomendada."
          />
          <OptionCard
            title="STEMI classico"
            meta="Supra persistente"
            tone="critical"
            selected={strategy === 'stemi'}
            onClick={() => setStrategy('stemi')}
            description="Ativa hemodinamica imediatamente."
          />
          <OptionCard
            title="Alta segura"
            meta="Rule-out"
            tone="success"
            selected={strategy === 'alta'}
            onClick={() => setStrategy('alta')}
            description="Troponina seriada negativa e escore baixo."
          />
          <OptionCard title="Opcao desabilitada" description="Indisponivel neste cenario." disabled />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1c · StatGrid (resumo em tiles)</h2><p>Padrao golden valor-card. Grade compacta label/valor; data-columns 1-4.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <StatGrid
            items={[
              { label: 'Duracao', value: '43 min' },
              { label: 'Modo', value: 'Adulto' },
              { label: 'Criterios', value: '3/3' },
              { label: 'Desfecho', value: 'Alta segura' },
            ]}
          />
          <StatGrid
            columns={3}
            items={[
              { label: 'Idade', value: '32a' },
              { label: 'Peso', value: '70 kg' },
              { label: 'K+', value: '4.1' },
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1d · RangeChip (seletor de faixa)</h2><p>Familia Chip (golden .faixa-chip). Single-select; tone critical na faixa perigosa (K abaixo de 3,5).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <RangeChip selected={kRange === 'baixo'} tone="critical" onClick={() => setKRange('baixo')}>{'< 3,5'}</RangeChip>
            <RangeChip selected={kRange === 'normal'} onClick={() => setKRange('normal')}>3,5 a 5</RangeChip>
            <RangeChip selected={kRange === 'alto'} onClick={() => setKRange('alto')}>5 a 6,5</RangeChip>
            <RangeChip selected={kRange === 'muito-alto'} onClick={() => setKRange('muito-alto')}>{'> 6,5'}</RangeChip>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1e · ActionTile (acao rica)</h2><p>Golden PCR .btn-acao-grande: icone-quadrado + label + status. Estados default/disabled.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <ActionTile icon="batimento" label="Selecionar ritmo" value="Nao avaliado" onClick={() => {}} />
            <ActionTile icon="onda-ecg" label="Checar ritmo" value="Marco 2:00" disabled />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1f · ClinicalCard variante plain</h2><p>Card de secao neutro (golden .exame-card): gap 12, titulo 16/600, borda padrao. Aditivo: variant default inalterado.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <ClinicalCard variant="plain" title="Manejo inicial">
            <span style={{ fontSize: 14, lineHeight: '20px', color: 'var(--ds-texto-secundario)' }}>Soro fisiologico 0,9% em acesso calibroso. Reavaliar volemia a cada hora.</span>
          </ClinicalCard>
          <ClinicalCard variant="plain" title="Potassio serico" subtitle="K abaixo de 3,5 bloqueia o inicio da insulina.">
            <StatGrid columns={3} items={[{ label: 'K+', value: '4,1' }, { label: 'Status', value: 'OK' }, { label: 'Fonte', value: 'Gaso' }]} />
          </ClinicalCard>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.1g · TimerCard (5 estados PCR)</h2><p>Golden .pcr-card: idle / running / cycle-end / window-ok / window-overdue (pulso). data-state opcional; tone (SCA) inalterado.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 640, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <TimerCard state="idle" label="Compressoes" value="00:00" description="Toque para iniciar o ciclo." />
          <TimerCard state="running" label="Compressoes" value="01:23" meta="Ciclo 1" description="Compressao em andamento." />
          <TimerCard state="cycle-end" label="Checar ritmo" value="02:00" description="Marco de 2 min — checar ritmo." />
          <TimerCard state="window-ok" label="Adrenalina" value="00:45" description="Janela aberta — aplicar agora." />
          <TimerCard state="window-overdue" label="Adrenalina" value="05:30" description="Dose atrasada." />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>F0.2 · DetailRow (linha rotulo/valor)</h2><p>Mesmo padrao do DetailSheet (golden detalhe), p/ tela: log/resumo. Divisor entre linhas; ultima sem.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 430 }}>
          <div>
            <DetailRow label="Abertura" value="08:42" />
            <DetailRow label="Soro inicial" value="SF 0,9% · 1000 mL" />
            <DetailRow label="Insulina" value="7 U/h" />
            <DetailRow label="Potassio" value="4,1 mEq/L" />
            <DetailRow label="Duracao" value="43 min" />
          </div>
        </div>
      </section>
    </div>
  );
}
