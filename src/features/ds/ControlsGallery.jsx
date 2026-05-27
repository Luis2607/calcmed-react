import { useState } from 'react';
import styles from './ButtonsGallery.module.css';
import { CONTROLS_TOKEN_META, CONTROLS_TOKEN_GROUPS } from '../../shared/design-tokens/controlsTokens';
import { Checkbox } from '../../shared/components/atoms/Checkbox';
import { Radio } from '../../shared/components/atoms/Radio';
import { Toggle } from '../../shared/components/atoms/Toggle';
import { Segmented } from '../../shared/components/molecules/Segmented';
import { RadioGroup } from '../../shared/components/molecules/RadioGroup';
import { CheckboxGroup } from '../../shared/components/molecules/CheckboxGroup';
import { ToggleTab } from '../../shared/components/molecules/ToggleTab';
import { CarouselDots } from '../../shared/components/molecules/CarouselDots';
import { ToggleField } from '../../shared/components/molecules/ToggleField';

const [CHECKBOX_G, RADIO_G, TOGGLE_G] = CONTROLS_TOKEN_GROUPS;

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

export function ControlsGallery() {
  const [cb1, setCb1] = useState(true);
  const [cb2, setCb2] = useState(false);
  const [radio, setRadio] = useState('a');
  const [tg1, setTg1] = useState(true);
  const [tg2, setTg2] = useState(false);
  const [cbk, setCbk] = useState(false);
  const [tgk, setTgk] = useState(true);
  const [seg, setSeg] = useState('adulto');
  const [rg, setRg] = useState('a');
  const [rg2, setRg2] = useState('sim');
  const [cg, setCg] = useState(['x']);
  const [tab, setTab] = useState('ecg');
  const [carousel, setCarousel] = useState(0);
  const [tf, setTf] = useState(false);
  const noop = () => {};

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Controles de Seleção</h1>
        <p>Checkbox, Radio e Toggle confrontados com o Component Set real do Figma.</p>
        <span className={styles.sourceMeta}>
          Figma {CONTROLS_TOKEN_META.figmaFileKey} · página {CONTROLS_TOKEN_META.figmaPage} · snapshot {CONTROLS_TOKEN_META.extractedAt}
        </span>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Checkbox</h2><p>States + Maior + Strikethrough (gaps flagados).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkbox label="Marcado" checked={cb1} onChange={setCb1} />
          <Checkbox label="Desmarcado" checked={cb2} onChange={setCb2} />
          <Checkbox label="Disabled marcado" checked disabled onChange={noop} />
          <Checkbox label="Disabled desmarcado" disabled onChange={noop} />
        </div>
        <MatrixTable group={CHECKBOX_G} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Radio</h2><p>Selected / Unselected / Disabled.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Radio name="g" label="Opção A" checked={radio === 'a'} onChange={() => setRadio('a')} />
          <Radio name="g" label="Opção B" checked={radio === 'b'} onChange={() => setRadio('b')} />
          <Radio label="Disabled selecionado" checked disabled onChange={noop} />
          <Radio label="Disabled" disabled onChange={noop} />
        </div>
        <MatrixTable group={RADIO_G} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Toggle (atom novo)</h2><p>Track 51×31 · on #007993 / off #F1F5F9 · thumb 27.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Toggle label="Ligado" checked={tg1} onChange={setTg1} />
          <Toggle label="Desligado" checked={tg2} onChange={setTg2} />
          <Toggle label="Disabled" checked disabled onChange={noop} />
        </div>
        <MatrixTable group={TOGGLE_G} />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Segmented &amp; Grupos</h2><p>Segmented (Adulto/Pediatra), RadioGroup e CheckboxGroup (colunas 1/2) — novos.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Segmented label="Modo de atendimento" options={[{ value: 'adulto', label: 'Adulto' }, { value: 'pediatra', label: 'Pediatra' }]} value={seg} onChange={setSeg} />
          <RadioGroup label="Onde reperfundir? (card · radius card)" name="rep" columns={1} value={rg} onChange={setRg} options={[{ value: 'a', label: 'Cathlab interno' }, { value: 'b', label: 'Transferência' }, { value: 'c', label: 'Fibrinólise local' }]} />
          <RadioGroup label="Sim / Não (card · pill · 2 col)" name="rep2" columns={2} radius="pill" value={rg2} onChange={setRg2} options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
          <CheckboxGroup label="Critérios (card · 2 colunas)" columns={2} value={cg} onChange={setCg} options={[{ value: 'x', label: 'Dor torácica' }, { value: 'y', label: 'Dispneia' }, { value: 'z', label: 'Sudorese' }, { value: 'w', label: 'Náusea' }]} />
          <RadioGroup label="Plain (sem borda · legado)" name="rep3" variant="plain" value={rg} onChange={setRg} options={[{ value: 'a', label: 'Opção A' }, { value: 'b', label: 'Opção B' }]} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Família (Toggle Tab · Carousel · Toggle-Field)</h2><p>Componentes da página antes ausentes — agora componentizados (grounded Figma).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'inline-flex', gap: 8, background: 'var(--ds-fundo-elevado)', borderRadius: 12, padding: 4, alignSelf: 'flex-start' }}>
            <ToggleTab label="ECG" active={tab === 'ecg'} onClick={() => setTab('ecg')} />
            <ToggleTab label="Risco" active={tab === 'risco'} onClick={() => setTab('risco')} points="+3" />
            <ToggleTab label="Conduta" active={tab === 'conduta'} onClick={() => setTab('conduta')} />
          </div>
          <CarouselDots count={4} active={carousel} onDotClick={setCarousel} />
          <ToggleField label="Sou estrangeiro" checked={tf} onChange={setTf} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Modo Escuro</h2><p>Os 3 controles sob .modo-escuro (tokens dark).</p></div>
        <div className="modo-escuro" style={{ background: 'var(--fundo-pagina)', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Checkbox label="Checkbox dark" checked={cbk} onChange={setCbk} />
          <Radio label="Radio dark" checked onChange={noop} />
          <Toggle label="Toggle dark" checked={tgk} onChange={setTgk} />
        </div>
      </section>
    </div>
  );
}
