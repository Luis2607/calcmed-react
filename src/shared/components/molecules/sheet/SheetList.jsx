import styles from './Sheet.module.css';

/**
 * Molecule: SheetList.
 * Lista com bullets (marcador teal) usando o estilo de corpo do DS.
 * items: array de string|node.
 */
export function SheetList({ items = [] }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item, i) => (
        <li key={i} className={styles.bulletItem}>{item}</li>
      ))}
    </ul>
  );
}
