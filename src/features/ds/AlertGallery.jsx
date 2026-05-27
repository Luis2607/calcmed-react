import styles from './ButtonsGallery.module.css';
import {
  ALERT_TOKEN_META,
  ALERT_TOKEN_GROUPS,
  ALERT_PROPERTIES,
  ALERT_VARIANT_AXES,
} from '../../shared/design-tokens/alertTokens';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import { Toast } from '../../shared/components/molecules/Toast';

const LEVELS = [
  { level: 'info', title: 'Informação' },
  { level: 'result', title: 'Resultado' },
  { level: 'critical', title: 'Crítico' },
  { level: 'warning', title: 'Atenção' },
  { level: 'footnote', title: 'Nota de rodapé' },
];

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

const STATUS_LABEL = { ok: 'OK', parcial: 'PARCIAL', gap: 'GAP' };

export function AlertGallery() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · QA viva</span>
        <h1>Alertas (Alert Card)</h1>
        <p>Alert Card confrontado com o Component Set real do Figma (20 variantes). Saída clínica de protocolos/calculadoras.</p>
        <span className={styles.sourceMeta}>
          Figma {ALERT_TOKEN_META.figmaFileKey} · {ALERT_TOKEN_META.figmaPage} · snapshot {ALERT_TOKEN_META.extractedAt}
        </span>
        <span className={styles.sourceMeta}>
          Eixos: {ALERT_VARIANT_AXES.map((a) => `${a.name} (${a.values.length})`).join(' × ')}
        </span>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Levels (Light · Adulto)</h2><p>Estado atual do componente em código — os drifts vs Figma estão na matriz abaixo.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {LEVELS.map((l) => (
            <AlertCard key={l.level} level={l.level} title={l.title}>
              Texto de corpo do alerta para conferência de cor, espaçamento e tipografia.
            </AlertCard>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Pediatria (.modo-pediatrico)</h2><p>Radius cascateia (24). Fill tintado e title colorido ainda são gap (MT-G).</p></div>
        <div className="modo-pediatrico" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--fundo-pagina)', borderRadius: 12 }}>
          <AlertCard level="result" title="Resultado pediátrico">Conferir radius arredondado (24).</AlertCard>
          <AlertCard level="critical" title="Crítico pediátrico">Conferir radius arredondado (24).</AlertCard>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Modo Escuro (.modo-escuro)</h2><p>Atenção: prop darkMode aciona classe .dark inexistente (MT-F). Aqui testamos só o escopo de tokens.</p></div>
        <div className="modo-escuro" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--fundo-pagina)', borderRadius: 12 }}>
          <AlertCard level="info" title="Info dark">Texto de corpo no modo escuro.</AlertCard>
          <AlertCard level="result" title="Resultado dark">Texto de corpo no modo escuro.</AlertCard>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Toast / Snackbar</h2><p>Base Alert Compact (131:4093). Success/Error + ação Desfazer (extensão de código) + dismiss.</p></div>
        <div className={styles.tableContainer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Toast type="success" message="Evento adicionado ao histórico." onUndo={() => {}} onDismiss={() => {}} />
          <Toast type="error" message="Falha ao salvar. Tente novamente." onDismiss={() => {}} />
          <Toast type="success" message="Cronômetro reiniciado." onUndo={() => {}} />
        </div>
        <div className="modo-escuro" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--fundo-pagina)', borderRadius: 12 }}>
          <Toast type="success" message="Toast no modo escuro." onUndo={() => {}} onDismiss={() => {}} />
          <Toast type="error" message="Erro no modo escuro." onDismiss={() => {}} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}><h2>Component Properties</h2><p>Properties reais do Figma confrontadas com o código.</p></div>
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
              {ALERT_PROPERTIES.map((p) => (
                <tr key={p.prop} className={styles.tableRow} data-drift={p.status !== 'ok'}>
                  <td className={styles.tableCell}><strong>{p.prop}</strong></td>
                  <td className={styles.tableCell}><code className={styles.specCode}>{p.figma}</code></td>
                  <td className={styles.tableCell}><code className={styles.specCode}>{p.code}</code></td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${p.status === 'ok' ? styles.ok : styles.drift}`}>{STATUS_LABEL[p.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {ALERT_TOKEN_GROUPS.map((g) => (
        <section className={styles.section} key={g.title}>
          <div className={styles.sectionHeader}><h2>{g.title}</h2><p>Figma node {g.figmaNode}</p></div>
          <MatrixTable group={g} />
        </section>
      ))}
    </div>
  );
}
