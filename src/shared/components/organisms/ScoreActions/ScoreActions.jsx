import { Button } from '../../atoms/Button';
import styles from './ScoreActions.module.css';

/**
 * Organism: ScoreActions (DS · Figma calc/score-actions 2235:94802).
 * Linha de ações do resultado do escore. No Figma = 2 botões Secondary MD lado a lado
 * com Left Icon (Copiar / Compartilhar), gap 12. Aqui generalizado: orquestra `actions[]`
 * de Buttons reusando o átomo Button (zero estilo novo). Dark via .modo-escuro.
 *
 * Props:
 *  - actions: [{ label, icon?, variant?, onClick }] (default: Copiar + Compartilhar)
 *  - onCopy, onShare: atalhos pros 2 botões default
 */
const DEFAULT_ACTIONS = (onCopy, onShare) => [
  { label: 'Copiar', icon: 'copiar', variant: 'secondary', onClick: onCopy },
  { label: 'Compartilhar', icon: 'compartilhar', variant: 'secondary', onClick: onShare },
];

export const ScoreActions = ({ actions, onCopy, onShare }) => {
  const list = actions && actions.length ? actions : DEFAULT_ACTIONS(onCopy, onShare);
  return (
    <div className={styles.row}>
      {list.map((a, i) => (
        <Button
          key={a.label || i}
          className={styles.action}
          variant={a.variant || 'secondary'}
          size="md"
          leftIcon={a.icon}
          showLeftIcon={!!a.icon}
          onClick={a.onClick}
        >
          {a.label}
        </Button>
      ))}
    </div>
  );
};
