import styles from './ButtonsGallery.module.css';
import {
  CLINICAL_TOKEN_META,
  CLINICAL_TOKEN_GROUPS,
  CLINICAL_INVENTORY,
} from '../../shared/design-tokens/clinicalTokens';
import { useState } from 'react';
import { SectionLabel } from '../../shared/components/atoms/SectionLabel';
import { DoseDisplay } from '../../shared/components/molecules/DoseDisplay';
import { DividerOu } from '../../shared/components/molecules/DividerOu';
import { DisclosureCard } from '../../shared/components/molecules/DisclosureCard';
import { InputField } from '../../shared/components/molecules/InputField';
import { ChecklistBlock } from '../../shared/components/organisms/ChecklistBlock';
import { ClinicalCard } from '../../shared/components/organisms/ClinicalCard';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { ScoreResult } from '../../shared/components/molecules/ScoreResult';
import { ScoreRangeTable } from '../../shared/components/molecules/ScoreRangeTable';
import { ScoreActions } from '../../shared/components/organisms/ScoreActions';
import { ScoreCriterionGroup } from '../../shared/components/organisms/ScoreCriterionGroup';
import { ScoreCriterion } from '../../shared/components/organisms/ScoreCriterion';
import { InfoSheet } from '../../shared/components/overlays/patterns/InfoSheet';

const STATUS_BADGE = { ok: 'OK', pendente: 'PENDENTE' };

function MatrixTable({ group }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Parte</th>
            <th className={styles.tableHeader}>Figma</th>
            <th className={styles.tableHeader}>Código</th>
            <th className={styles.tableHeader}>Status</th>
          </tr>
        </thead>
        <tbody>
          {group.tokens.map((t) => (
            <tr key={t.part} className={styles.tableRow} data-drift={t.drift}>
              <td className={styles.tableCell}>
                <strong>{t.part}</strong>
                {t.note && <span className={styles.subtext}>{t.note}</span>}
              </td>
              <td className={styles.tableCell}><code className={styles.specCode}>{t.figma}</code></td>
              <td className={styles.tableCell}><code className={styles.specCode}>{t.code}</code></td>
              <td className={styles.tableCell}>
                <span className={`${styles.statusBadge} ${t.drift ? styles.drift : styles.ok}`}>{t.drift ? 'GAP' : 'OK'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ClinicalGallery() {
  const [checks, setChecks] = useState([
    { label: 'Acesso venoso calibroso', checked: true },
    { label: 'Monitorização contínua', checked: false },
    { label: 'Coleta de gasometria', checked: false },
    { label: 'Reavaliação em 1h', checked: false },
  ]);
  const toggle = (i) => setChecks((arr) => arr.map((it, idx) => (idx === i ? { ...it, checked: !it.checked } : it)));
  const doneCount = checks.filter((c) => c.checked).length;
  const [sheet, setSheet] = useState(null); // { title, body }
  const [dose, setDose] = useState('0,10');

  // Score subsistema — estado vivo
  const cvOptions = [
    { label: 'PAM ≥ 70 mmHg', points: '+0' },
    { label: 'PAM < 70 mmHg', points: '+1' },
    { label: 'Dopamina ≤ 5 ou dobutamina', points: '+2' },
    { label: 'Dopamina > 5 ou nora ≤ 0,1', points: '+3' },
    { label: 'Dopamina > 15 ou nora > 0,1', points: '+4' },
  ];
  const [cvOpen, setCvOpen] = useState(true);
  const [cvValue, setCvValue] = useState(null);
  const [respOpen, setRespOpen] = useState(false);
  const [critCheck, setCritCheck] = useState(false);
  const [critRadio, setCritRadio] = useState(false);
  const [critSeg, setCritSeg] = useState('a');
  const [critStep, setCritStep] = useState(40);
  const [critNum, setCritNum] = useState('');
  const [critSlider, setCritSlider] = useState(7);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Componentes Clínicos</h1>
        <p>Página Figma 114:3750. Slice 1 (fundacionais) + cards + subsistema Score completos.</p>
        <span className={styles.sourceMeta}>
          Figma {CLINICAL_TOKEN_META.figmaFileKey} · {CLINICAL_TOKEN_META.figmaPage} · snapshot {CLINICAL_TOKEN_META.extractedAt}
        </span>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Inventário da página (status real)</h2><p>13 componentes — transparência do que está pronto vs pendente.</p></div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Componente Figma</th>
                <th className={styles.tableHeader}>Variantes</th>
                <th className={styles.tableHeader}>Código</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {CLINICAL_INVENTORY.map((c) => (
                <tr key={c.comp} className={styles.tableRow} data-drift={c.status !== 'ok'}>
                  <td className={styles.tableCell}><strong>{c.comp}</strong><span className={styles.subtext}>{c.node}</span></td>
                  <td className={styles.tableCell}>{c.variants}</td>
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
        <div className={styles.sectionHeader}><h2>Section Label</h2><p>Label uppercase + info button (Show Info Button).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionLabel>Analgesia</SectionLabel>
          <SectionLabel onInfo={() => {}}>Dose de ataque</SectionLabel>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Dose Display</h2><p>Inline (teal) — Single / Range / Conversor + via.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 40 }}>
          <DoseDisplay value="2,8" unit="mL" via="EV em bolus" tipo="single" />
          <DoseDisplay value="1,4 – 4,2" unit="mL" via="EV em bolus" tipo="range" />
          <DoseDisplay value="0,9" unit="mg/kg" via="IM se sem acesso" tipo="single" />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Divider “OU”</h2><p>Divisor com label central.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24 }}>
          <DividerOu />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Disclosure Card (Teoria → BottomSheet)</h2><p>Row tappável que abre um sheet com o conteúdo. Clique para abrir.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <DisclosureCard
            title="Por que corrigir o sódio?"
            subtitle="Teoria — sódio corrigido na hiperglicemia"
            onClick={() => setSheet({ title: 'Sódio corrigido', body: 'Na hiperglicemia, cada 100 mg/dL de glicose acima de 100 reduz o sódio medido em ~1,6 mEq/L. Corrija antes de definir a diluição do soro.' })}
          />
          <DisclosureCard
            title="Noradrenalina 4mg/4mL"
            subtitle="Preparo — 4 ampolas em 234 mL de SG 5%"
            onClick={() => setSheet({ title: 'Preparo da Noradrenalina', body: 'Diluir 4 ampolas (16 mg) em 234 mL de SG 5% → concentração final 64 mcg/mL. Infundir em bomba, acesso central preferencial.' })}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Checklist Block</h2><p>Card de checklist: tag de estado + contador + itens checkáveis.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 420 }}>
          <ChecklistBlock
            tagLabel="URGENTE"
            tagTone="critico"
            count={`${doneCount}/${checks.length}`}
            subtitle="4 ações em ≤ 1 hora"
            onInfo={() => setSheet({ title: 'Ações na 1ª hora', body: 'Checklist das condutas críticas que devem ser concluídas em até 1 hora do diagnóstico.' })}
            items={checks}
            onToggle={toggle}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Clinical Card (container composável)</h2><p>Shell + header (tags/título/subtítulo = props) + children livre. O “drug-card-vaso” agora é só uma composição.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* Exemplo 1: recriando o drug-card-vaso por composição */}
          <ClinicalCard
            state="ativo"
            tags={[{ label: '1ª LINHA', tone: 'atencao' }, { label: 'ATIVA', tone: 'premium' }]}
            title="Norepinefrina"
            subtitle="Iniciar periférico, escalonar conforme PAM."
          >
            <InputField label="Dose Atual" value={dose} onChange={setDose} showUnit unit="mcg/kg/min" mono helperText="Faixa usual: 0,01 – 1,0" />
            <AlertCard level="info" showValue value="150" unit="mg" title="Prescrição">
              Noradrenalina (4 mg/4 mL) — 4 ampolas em 234 mL SG 5%.
            </AlertCard>
            <AlertCard level="warning" showValue value="0,25" unit="mcg/kg/min" title="PRÓXIMO PASSO">
              Escalonar até 0,25 se PAM &lt; 65 mmHg.
            </AlertCard>
          </ClinicalCard>

          {/* Exemplo 2: mesmo container, conteúdo totalmente diferente (checklist) */}
          <ClinicalCard
            state="default"
            tags={[{ label: 'PASSOS', tone: 'premium' }]}
            title="Acesso e monitorização"
            subtitle="Mesmo container, conteúdo = ChecklistBlock + dose."
          >
            <DoseDisplay value="500" unit="mL" via="Bolus inicial" tipo="single" />
            <DividerOu />
            <AlertCard level="footnote">Container agnóstico: aceita qualquer clínico via children.</AlertCard>
          </ClinicalCard>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Score — Resultado &amp; Interpretação</h2><p>ScoreResult (faixa de risco) + ScoreRangeTable. Falta acordeão (criterion-group) e criterion (mega).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ScoreResult value="0" risk="baixo" riskLabel="Baixo Risco" />
            <ScoreResult value="1" risk="moderado" riskLabel="Risco Intermediário" />
            <ScoreResult value="3" risk="alto" riskLabel="Alto Risco" />
          </div>
          <ScoreRangeTable
            title="Interpretação"
            rows={[
              { points: '0 pts', label: 'Baixo — sem necessidade de anticoagulação' },
              { points: '1 pt', label: 'Intermediário — considerar caso a caso' },
              { points: '≥2 pts', label: 'Alto — anticoagular se sem contraindicação' },
            ]}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Score — Criterion Group (acordeão)</h2><p>Header com eixo + critério selecionado + badge de pontos + chevron. Expandido = seleção única (radio). Clique pra abrir/fechar e selecionar.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
          <ScoreCriterionGroup
            systemName="Cardiovascular"
            parameter="PAM / drogas"
            options={cvOptions}
            value={cvValue}
            onChange={setCvValue}
            expanded={cvOpen}
            onToggle={() => setCvOpen((o) => !o)}
            name="sofa-cv"
          />
          <ScoreCriterionGroup
            systemName="Respiratório"
            parameter="PaO₂ / FiO₂"
            options={[
              { label: '≥ 400', points: '+0' },
              { label: '< 400', points: '+1' },
              { label: '< 300', points: '+2' },
            ]}
            value={null}
            onChange={() => {}}
            expanded={respOpen}
            onToggle={() => setRespOpen((o) => !o)}
            name="sofa-resp"
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Score — Criterion (dispatcher · 6 tipos)</h2><p>Critério único cujo input varia por Type. Cada tipo reusa o átomo/molécula DS apropriado.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
          <ScoreCriterion type="checkbox" label="Lactato > 2 mmol/L" points="+1" checked={critCheck} onChange={setCritCheck} />
          <ScoreCriterion type="radio" label="Hipotensão persistente" points="+2" name="crit-r" checked={critRadio} onChange={() => setCritRadio((v) => !v)} />
          <ScoreCriterion type="numeric" label="Idade do paciente" points="+1" unit="anos" placeholder="0" value={critNum} onChange={setCritNum} />
          <ScoreCriterion type="numeric" state="error" label="Idade do paciente" points="+1" unit="anos" placeholder="0" value="200" onChange={() => {}} helperText="A idade deve ser entre 0 e 120 anos" />
          <ScoreCriterion type="stepper" label="Fração inspirada de O₂" points="+1" stepperLabel="FiO₂" unit="%" value={critStep} onChange={setCritStep} min={21} max={100} />
          <ScoreCriterion type="slider" label="Escala de dor (EVA)" points="+1" value={critSlider} onChange={setCritSlider} min={0} max={10} minLabel="0 — Sem dor" maxLabel="10 — Pior dor" />
          <div style={{ gridColumn: '1 / -1' }}>
            <ScoreCriterion
              type="segmented"
              label="Nível de consciência (AVDI)"
              points="+1"
              value={critSeg}
              onChange={setCritSeg}
              options={[
                { value: 'a', label: 'Alerta', points: '+0' },
                { value: 'v', label: 'Verbal', points: '+1' },
                { value: 'd', label: 'Dor', points: '+2' },
              ]}
            />
          </div>
          <ScoreCriterion type="checkbox" label="Critério desabilitado" points="+1" state="disabled" />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Score — Actions</h2><p>Linha de ações do resultado: Copiar + Compartilhar (botões Secondary).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, maxWidth: 420 }}>
          <ScoreActions onCopy={() => setSheet({ title: 'Copiado', body: 'Resultado copiado para a área de transferência.' })} onShare={() => setSheet({ title: 'Compartilhar', body: 'Abrir folha de compartilhamento.' })} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Modo Escuro</h2><p>Slice 1 sob .modo-escuro.</p></div>
        <div className="modo-escuro" style={{ background: 'var(--fundo-pagina)', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <SectionLabel onInfo={() => {}}>Diluição</SectionLabel>
          <DoseDisplay value="10" unit="mL/h" via="Bomba de infusão" tipo="single" />
          <DividerOu />
          <ScoreCriterionGroup
            systemName="Cardiovascular"
            parameter="PAM / drogas"
            options={cvOptions}
            value={1}
            onChange={() => {}}
            expanded
            onToggle={() => {}}
            name="sofa-cv-dark"
          />
          <ScoreCriterion type="slider" label="Escala de dor (EVA)" points="+1" value={7} onChange={() => {}} min={0} max={10} minLabel="0 — Sem dor" maxLabel="10 — Pior dor" />
          <ScoreActions />
        </div>
      </section>

      {CLINICAL_TOKEN_GROUPS.map((g) => (
        <section className={styles.section} key={g.title}>
          <div className={styles.sectionHeader}><h2>{g.title}</h2><p>Figma node {g.figmaNode}</p></div>
          <MatrixTable group={g} />
        </section>
      ))}

      <InfoSheet
        open={!!sheet}
        onClose={() => setSheet(null)}
        title={sheet?.title}
      >
        {sheet?.body}
      </InfoSheet>
    </div>
  );
}
