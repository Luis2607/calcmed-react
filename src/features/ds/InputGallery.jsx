import { useEffect, useRef, useState } from 'react';
import styles from './ButtonsGallery.module.css';
import { INPUT_TOKEN_META, INPUT_TOKEN_GROUPS } from '../../shared/design-tokens/inputTokens';
import { InputField } from '../../shared/components/molecules/InputField';
import { Textarea } from '../../shared/components/molecules/Textarea';
import { Select } from '../../shared/components/molecules/Select';

const SIZE_GROUP = INPUT_TOKEN_GROUPS[0];
const STATE_GROUP = INPUT_TOKEN_GROUPS[1];
const ANATOMY_GROUP = INPUT_TOKEN_GROUPS[2];
const PROPS_GROUP = INPUT_TOKEN_GROUPS[3];

// Mede a caixa real (.inputWrap) e confronta com a altura do Figma.
function HeightAuditorRow({ token }) {
  const wrapRef = useRef(null);
  const [h, setH] = useState('0px');
  useEffect(() => {
    const t = setTimeout(() => {
      const box = wrapRef.current?.querySelector('[class*="inputWrap"]');
      if (box) setH(`${Math.round(box.getBoundingClientRect().height)}px`);
    }, 150);
    return () => clearTimeout(t);
  }, []);
  const hasDrift = h !== token.figmaHeight && h !== '0px';
  return (
    <tr className={styles.tableRow} data-drift={hasDrift}>
      <td className={styles.tableCell}>
        <strong>Input {token.size}</strong>
        <span className={styles.subtext}>Figma: {token.figmaText}</span>
      </td>
      <td className={styles.tableCell}>
        <div ref={wrapRef} style={{ width: 220 }}>
          <InputField placeholder="Ex: 70" unit="kg" showUnit />
        </div>
      </td>
      <td className={styles.tableCell}><code className={styles.specCode}>{token.figmaHeight}</code></td>
      <td className={styles.tableCell}>
        <code className={`${styles.specCode} ${hasDrift ? styles.driftValue : styles.okValue}`}>
          {h === '0px' ? 'Medindo...' : h}
        </code>
      </td>
      <td className={styles.tableCell}>
        <span className={`${styles.statusBadge} ${hasDrift ? styles.drift : styles.ok}`}>
          {hasDrift ? 'DIVERGENTE' : 'SINCRONIZADO'}
        </span>
      </td>
    </tr>
  );
}

// Renderiza o InputField no estado correspondente (mapeando nomes Figma -> props codigo).
function renderStateInput(token) {
  const common = { label: 'Peso', placeholder: 'Ex: 70', unit: 'kg', showUnit: true };
  switch (token.state) {
    case 'Filled':
      return <InputField {...common} value="70" />;
    case 'Error':
      return <InputField {...common} value="70" state="error" helperText="Valor fora do esperado" />;
    case 'Success':
      return <InputField {...common} value="70" state="sucesso" />;
    case 'Disabled':
      return <InputField {...common} disabled />;
    case 'Focus':
    case 'Typing':
      return <InputField {...common} placeholder="Foco via :focus-within — clique para ver" />;
    default:
      return <InputField {...common} />;
  }
}

export function InputGallery() {
  const [pgValue, setPgValue] = useState('');
  const [pgState, setPgState] = useState('default');
  const [pgUnit, setPgUnit] = useState(true);
  const [ta, setTa] = useState('');
  const [sel, setSel] = useState('');

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Inputs</h1>
        <p>
          Painel de conformidade de campos de entrada. Mede a altura real (touch target) via getBoundingClientRect()
          e confronta o componente React contra o Component Set real do Figma.
        </p>
        <span className={styles.sourceMeta}>
          Figma {INPUT_TOKEN_META.figmaFileKey} · página {INPUT_TOKEN_META.figmaPage} · node {INPUT_TOKEN_META.figmaNodeId} · snapshot {INPUT_TOKEN_META.extractedAt}
        </span>
      </header>

      {/* Altura */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Auditoria Real de Altura (Touch Target)</h2>
          <p>Mede a caixa do input no browser e confronta com o alvo de 48px do Figma.</p>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Tamanho</th>
                <th className={styles.tableHeader}>Componente React</th>
                <th className={styles.tableHeader}>Figma Espec.</th>
                <th className={styles.tableHeader}>Browser Medido</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GROUP.tokens.map((t) => <HeightAuditorRow key={t.size} token={t} />)}
            </tbody>
          </table>
        </div>
      </section>

      {/* Estados */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Estados Visuais (7 variants do Figma)</h2>
          <p>Cada estado renderizado vs o spec do Figma. Filled e Disabled divergem do código (flagados).</p>
        </div>
        <div className={styles.variantsGrid}>
          {STATE_GROUP.tokens.map((t) => (
            <div key={t.state} className={styles.variantCard}>
              <div className={styles.variantHeader}>
                <h3>State="{t.state}"</h3>
                <p>código: {t.codeState}</p>
              </div>
              <div className={styles.demoArea}>
                <div style={{ width: '100%' }}>{renderStateInput(t)}</div>
              </div>
              <div className={styles.specsFooter}>
                <div className={styles.specColorItem}>
                  <span>Figma:</span>
                  <code>{t.figmaStroke} · {t.figmaFill}</code>
                </div>
                <div className={styles.specColorItem}>
                  <span>Código:</span>
                  <code>{t.codeSpec}</code>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className={`${styles.statusBadge} ${t.drift ? styles.drift : styles.ok}`}>
                    {t.drift ? 'DIVERGENTE' : 'SINCRONIZADO'}
                  </span>
                  {t.driftNote && <span className={styles.subtext} style={{ display: 'block', marginTop: 4 }}>{t.driftNote}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dark mode */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Modo Escuro (Dark mode)</h2>
          <p>Escopo .modo-escuro remapeia os tokens base · grounded no Figma (Dark mode=True · #1A2942 / #2A3F5F / #0096B7).</p>
        </div>
        <div className="modo-escuro" style={{ background: 'var(--fundo-pagina)', padding: 24, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <InputField label="Peso" placeholder="Ex: 70" unit="kg" showUnit />
          <InputField label="Peso" value="70" unit="kg" showUnit />
          <InputField label="Peso" value="70" state="error" unit="kg" showUnit helperText="Valor fora do esperado" />
          <InputField label="Peso" value="70" state="sucesso" unit="kg" showUnit />
          <InputField label="Peso" placeholder="Ex: 70" unit="kg" showUnit disabled />
          <Textarea label="Observações" placeholder="Digite as observações..." />
          <Select label="Sexo" placeholder="Selecione..." onClick={() => {}} />
        </div>
      </section>

      {/* Textarea & Select (mesma pagina Inputs do Figma) */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Textarea &amp; Select</h2>
          <p>Componentes de entrada da mesma página do Figma. Reusam --ds-input-* (dark mode automático).</p>
        </div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Textarea
            label="Observações"
            placeholder="Evolução, condutas, intercorrências..."
            maxLength={500}
            value={ta}
            onChange={setTa}
            helperText="Figma 127:3228 · box 96 · r12 · 1px #E2E8F0"
          />
          <Select label="Sexo" placeholder="Selecione..." value={sel} onClick={() => setSel(sel ? '' : 'Masculino')} />
          <Select label="Sexo (erro)" placeholder="Obrigatório" state="error" onClick={() => {}} />
        </div>
      </section>

      {/* Anatomia */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Anatomia & Tipografia</h2>
          <p>Especificação de cada parte do input contra o código.</p>
        </div>
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
              {ANATOMY_GROUP.tokens.map((t) => (
                <tr key={t.part} className={styles.tableRow} data-drift={t.drift}>
                  <td className={styles.tableCell}><strong>{t.part}</strong></td>
                  <td className={styles.tableCell}><code className={styles.specCode}>{t.figma}</code></td>
                  <td className={styles.tableCell}><code className={styles.specCode}>{t.code}</code></td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${t.drift ? styles.drift : styles.ok}`}>{t.drift ? 'DIVERGENTE' : 'OK'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Properties & Gaps */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Component Properties & Gaps</h2>
          <p>Properties do Figma e cobertura no código. Ícones, dark mode e Modo são gaps conhecidos.</p>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Property</th>
                <th className={styles.tableHeader}>Figma</th>
                <th className={styles.tableHeader}>Código</th>
                <th className={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {PROPS_GROUP.tokens.map((t) => (
                <tr key={t.prop} className={styles.tableRow} data-drift={t.drift}>
                  <td className={styles.tableCell}><strong>{t.prop}</strong></td>
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
      </section>

      {/* Playground */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Playground</h2>
          <p>Itere com estado e unidade ao vivo (sem alterar o componente base).</p>
        </div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <input type="checkbox" checked={pgUnit} onChange={(e) => setPgUnit(e.target.checked)} /> Mostrar unidade (mg/dL)
            </label>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>Estado</label>
              <select value={pgState} onChange={(e) => setPgState(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 4 }}>
                <option value="default">default</option>
                <option value="error">error</option>
                <option value="sucesso">sucesso</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 8, padding: 16 }}>
            <div style={{ width: '100%' }}>
              <InputField
                label="HGT (Glicemia)"
                placeholder="Ex: 350"
                value={pgValue}
                onChange={setPgValue}
                unit="mg/dL"
                showUnit={pgUnit}
                state={pgState}
                mono
                helperText={pgState === 'error' ? 'Verifique o valor' : undefined}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
