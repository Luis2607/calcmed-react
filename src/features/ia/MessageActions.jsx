import { CopyButton } from '../../shared/components/ai';
import styles from './MessageActions.module.css';

/**
 * MessageActions — rodapé discreto de uma resposta da IA (estilo ChatGPT):
 * copiar resposta inteira · útil (👍) · não útil (👎) · regenerar.
 *
 * Props:
 *  - copyText (string | () => string) · feedback ('up'|'down'|null)
 *  - onFeedback(value) · onRegenerate?()
 */
const ThumbUp = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 10v11" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L14 3a1.4 1.4 0 0 1 1 1.66z" />
  </svg>
);
const ThumbDown = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17 14V3" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H17a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L10 21a1.4 1.4 0 0 1-1-1.66z" />
  </svg>
);
const Regen = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" />
  </svg>
);

export function MessageActions({ copyText, feedback, onFeedback, onRegenerate }) {
  return (
    <div className={styles.row}>
      <CopyButton text={copyText} className={styles.btn} size={16} label="Copiar resposta" />
      <button
        type="button"
        className={`${styles.btn} ${feedback === 'up' ? styles.active : ''}`}
        onClick={() => onFeedback(feedback === 'up' ? null : 'up')}
        aria-label="Resposta útil"
        aria-pressed={feedback === 'up'}
        title="Útil"
      >
        <ThumbUp width="15" height="15" />
      </button>
      <button
        type="button"
        className={`${styles.btn} ${feedback === 'down' ? styles.active : ''}`}
        onClick={() => onFeedback(feedback === 'down' ? null : 'down')}
        aria-label="Resposta não útil"
        aria-pressed={feedback === 'down'}
        title="Não útil"
      >
        <ThumbDown width="15" height="15" />
      </button>
      {onRegenerate && (
        <button type="button" className={styles.btn} onClick={onRegenerate} aria-label="Regenerar resposta" title="Regenerar">
          <Regen width="15" height="15" />
        </button>
      )}
    </div>
  );
}
