import styles from './Sheet.module.css';

/**
 * Molecule: SheetText.
 * Bloco de texto do body com estilo de texto do DS.
 * variant="body" (14/22 · secundario) | "auxiliary" (12/16 · terciario · o "textinho pequeno").
 * Aceita <strong> pra enfase (700 · texto-padrao).
 */
export function SheetText({ variant = 'body', children }) {
  return <p className={variant === 'auxiliary' ? styles.textAux : styles.text}>{children}</p>;
}
