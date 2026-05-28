import styles from './PanfletoPlaceholder.module.css';

/**
 * Organism: PanfletoPlaceholder (DS · code-first F-PCR-2.9).
 * Placeholder pra panfletos AHA 2025 (algoritmo · cuidados pós-PCR · qualidade RCP)
 * enquanto Gustavo entrega os SVGs definitivos.
 *
 * Anatomia: frame dashed + ícone livro + label "{title}" + helper "Será importado do Figma".
 *
 * Props:
 *  - title: string (required) — nome do panfleto.
 *  - figmaRef?: string — referência Figma file/node (mostrada se dev mode).
 *
 * Tokens-only. Substituível por componente final quando Gustavo entregar.
 */
export function PanfletoPlaceholder({ title, figmaRef }) {
  return (
    <div className={styles.placeholder} role="region" aria-label={`Panfleto · ${title}`}>
      <svg className={styles.icon} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      <span className={styles.title}>{title}</span>
      <span className={styles.helper}>Será importado do Figma (AHA 2025)</span>
      {figmaRef && <span className={styles.ref}>{figmaRef}</span>}
    </div>
  );
}
