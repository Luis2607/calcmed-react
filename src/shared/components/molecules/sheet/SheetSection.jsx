import styles from './Sheet.module.css';

export function SheetSection({ title, children, className = '' }) {
  return (
    <section className={[styles.section, className].filter(Boolean).join(' ')}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      {children}
    </section>
  );
}
