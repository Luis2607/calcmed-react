import styles from './Sheet.module.css';

/**
 * Molecule: SheetMedia.
 * Imagem/ECG/diagrama dentro do body. Largura 100%, radius por token,
 * alt obrigatorio quando comunica informacao, caption opcional.
 */
export function SheetMedia({ src, alt = '', caption }) {
  return (
    <figure className={styles.media}>
      <img className={styles.mediaImg} src={src} alt={alt} />
      {caption && <figcaption className={styles.mediaCaption}>{caption}</figcaption>}
    </figure>
  );
}
