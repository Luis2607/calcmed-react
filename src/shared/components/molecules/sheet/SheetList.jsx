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
        // Envelopa {item} em span pra o conteúdo virar UM filho do flex container.
        // Sem isso, <strong>Risco MRSA</strong> + texto restante viram 2 flex items
        // separados (criam 2 colunas indesejadas no list item). Luis 2026-05-28.
        <li key={i} className={styles.bulletItem}>
          <span className={styles.bulletText}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
