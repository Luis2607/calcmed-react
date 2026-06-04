import styles from './LimitationNote.module.css';

/**
 * AI · LimitationNote — nota de segurança/limitação. No chat, é um rodapé
 * SUTIL (não um card): ícone pequeno + texto atenuado, separado por um filete.
 * Sinaliza dependência de validação clínica/protocolo local sem competir
 * visualmente com a resposta.
 *
 * Props: children (texto da limitação)
 */
export const LimitationNote = ({ children }) => (
  <p className={styles.note}>
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
    <span>{children}</span>
  </p>
);
