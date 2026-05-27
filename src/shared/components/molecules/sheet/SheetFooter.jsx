import { Button } from '../../atoms/Button';
import styles from './Sheet.module.css';

/**
 * footer prop shape:
 *   { primary: { label, onClick, variant?, loading?, disabled? }, secondary?: {...} }
 * variant defaults: primary='primary', secondary='secondary'
 */
export function SheetFooter({ footer }) {
  if (!footer) return null;
  const { primary, secondary } = footer;

  const renderBtn = (cfg, fallbackVariant) => {
    if (!cfg) return null;
    const { label, onClick, variant = fallbackVariant, loading, disabled } = cfg;
    return (
      <Button
        variant={variant}
        size="lg"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? '...' : label}
      </Button>
    );
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerActions}>
        {renderBtn(secondary, 'secondary')}
        {renderBtn(primary, 'primary')}
      </div>
    </footer>
  );
}
