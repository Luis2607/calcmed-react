import { Tag } from '../../molecules/Tag/Tag';
import styles from './PatientDetail.module.css';

const EMPTY_SUMMARY = [];
const EMPTY_SECTIONS = [];

export function PatientDetail({
  initials,
  protocol,
  status,
  statusTone = 'novo',
  summary = EMPTY_SUMMARY,
  sections = EMPTY_SECTIONS,
}) {
  return (
    <article className={styles.detail}>
      <header className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.initials}>{initials}</span>
          <span className={styles.protocol}>{protocol}</span>
        </div>
        {status && <Tag variant="status" tone={statusTone}>{status}</Tag>}
      </header>

      {summary.length > 0 && (
        <dl className={styles.summary}>
          {summary.map((item) => (
            <div key={item.label} className={styles.summaryItem}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.title} className={styles.block}>
            <div className={styles.blockHeader}>
              <span>{section.title}</span>
              {section.meta && <strong>{section.meta}</strong>}
            </div>
            <div className={styles.rows}>
              {section.rows?.map((row) => (
                <div key={row.label} className={styles.row}>
                  <span>{row.label}</span>
                  <strong>{row.value}</strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
