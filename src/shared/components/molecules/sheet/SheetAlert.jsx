import styles from './Sheet.module.css';

export function SheetAlert({ tone = 'info', title, children }) {
  return (
    <div className={styles.alert} data-tone={tone} role={tone === 'critical' ? 'alert' : 'note'}>
      {title && <div className={styles.alertTitle}>{title}</div>}
      {children && <div className={styles.alertBody}>{children}</div>}
    </div>
  );
}
