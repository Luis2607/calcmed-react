import styles from './Sheet.module.css';

/**
 * SheetSection — grupo de conteúdo dentro de um sheet.
 * `boxed` aplica fundo cinza + padding (usado nos grupos do detalhe de histórico,
 * espelhando o legado; não usar na timeline).
 */
export function SheetSection({ title, children, boxed = false, className = '' }) {
  return (
    <section className={[styles.section, boxed ? styles.sectionBoxed : '', className].filter(Boolean).join(' ')}>
      {title && <h3 className={styles.sectionTitle}>{title}</h3>}
      {children}
    </section>
  );
}
