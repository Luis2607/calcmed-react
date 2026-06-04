import styles from './PrimaryAction.module.css';

/**
 * AI · PrimaryAction — destaque da ação principal de uma resposta operacional.
 * Eyebrow ("Próxima ação") + conteúdo em peso forte. Bloco tonalizado com o
 * primário do DS; em risco alto usa a família crítica.
 *
 * Props:
 *  - label: eyebrow (default "Próxima ação")
 *  - children: a ação (texto, pode conter <strong>)
 *  - tone: 'primary' (default) | 'critico'
 */
export const PrimaryAction = ({ label = 'Próxima ação', children, tone = 'primary' }) => (
  <div className={styles.block} data-tone={tone}>
    <span className={styles.label}>{label}</span>
    <div className={styles.content}>{children}</div>
  </div>
);
