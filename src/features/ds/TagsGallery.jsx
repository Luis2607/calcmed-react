import { useState } from 'react';
import styles from './ButtonsGallery.module.css';
import {
  TAGS_TOKEN_META,
  TAGS_TOKEN_GROUPS,
  TAG_STATUS_TONES,
  TAG_DOMAIN_TONES,
} from '../../shared/design-tokens/tagsTokens';
import { Tag } from '../../shared/components/molecules/Tag';
import { Chip, UnitChip } from '../../shared/components/molecules/Chip';

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

export function TagsGallery() {
  const [filtros, setFiltros] = useState({ a: true, b: false, c: false });
  const [chips, setChips] = useState(['Dor torácica', 'Dispneia']);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Tags e Chips</h1>
        <p>Tag (Status/Domain/Count), Chip (filtro/removível) e UnitChip confrontados com o Figma.</p>
        <span className={styles.sourceMeta}>
          Figma {TAGS_TOKEN_META.figmaFileKey} · página {TAGS_TOKEN_META.figmaPage} · snapshot {TAGS_TOKEN_META.extractedAt}
        </span>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Tag Status (12 tones)</h2><p>Solid/tint por tipo. Crítico/Alerta usam cor nova (Figma não tokenizou).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TAG_STATUS_TONES.map((t) => (
            <Tag key={t.tone} variant="status" tone={t.tone}>{t.label}</Tag>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Tag Domain (6)</h2><p>tint-bg + texto colorido (valores Figma).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TAG_DOMAIN_TONES.map((t) => (
            <Tag key={t.tone} variant="domain" tone={t.tone}>{t.label}</Tag>
          ))}
          <Tag variant="count">12</Tag>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Tag Abbr (6)</h2><p>Abreviações 18 Semi Bold (cor 12% + texto sólido). Figma não tokenizou — ver ledger TC3.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Tag variant="abbr" tone="urgencias">IOT</Tag>
          <Tag variant="abbr" tone="diluicoes">SF</Tag>
          <Tag variant="abbr" tone="calculadoras">IMC</Tag>
          <Tag variant="abbr" tone="protocolos">CAD</Tag>
          <Tag variant="abbr" tone="escores">SOFA</Tag>
          <Tag variant="abbr" tone="conversores">mEq</Tag>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Chip (filtro)</h2><p>Default / Active / Inactive + removível (X).</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Chip state={filtros.a ? 'active' : 'default'} onClick={() => setFiltros((f) => ({ ...f, a: !f.a }))}>Todos</Chip>
          <Chip state={filtros.b ? 'active' : 'default'} onClick={() => setFiltros((f) => ({ ...f, b: !f.b }))}>Adulto</Chip>
          <Chip state="inactive">Indisponível</Chip>
          {chips.map((c) => (
            <Chip key={c} tone="urgencias" onDismiss={() => setChips((arr) => arr.filter((x) => x !== c))}>{c}</Chip>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>UnitChip (concentração)</h2><p>Chip pequeno de unidade para calculadoras.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <UnitChip>50 mcg/mL</UnitChip>
          <UnitChip>0,9% NaCl</UnitChip>
          <UnitChip>1 mEq/mL</UnitChip>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Modo Escuro</h2><p>Tags e Chips sob .modo-escuro.</p></div>
        <div className="modo-escuro" style={{ background: 'var(--fundo-pagina)', padding: 24, borderRadius: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <Tag variant="status" tone="premium">Premium</Tag>
          <Tag variant="status" tone="novo">Novo</Tag>
          <Tag variant="domain" tone="urgencias">Urgências</Tag>
          <Tag variant="count">3</Tag>
          <Chip state="active">Ativo</Chip>
          <Chip state="default">Filtro</Chip>
          <UnitChip>10 mg/mL</UnitChip>
        </div>
      </section>

      {TAGS_TOKEN_GROUPS.map((g) => (
        <section className={styles.section} key={g.title}>
          <div className={styles.sectionHeader}><h2>{g.title}</h2><p>Figma node {g.figmaNode}</p></div>
          <MatrixTable group={g} />
        </section>
      ))}
    </div>
  );
}
