import styles from './SectionLabel.module.css';
import { InfoButton } from '../InfoButton/InfoButton';

/**
 * Atom: SectionLabel (DS · Figma calc/section-label 173:10833).
 * Label uppercase 11 Semi Bold. Figma property "Show Info Button" → prop onInfo (InfoButton).
 * Sem onInfo, renderiza idêntico ao comportamento anterior (zero regressão).
 */
export const SectionLabel = ({
  children,
  onInfo,
  className = '',
  ...props
}) => {
  if (!onInfo) {
    return (
      <span className={`${styles.label} ${className}`} {...props}>
        {children}
      </span>
    );
  }
  return (
    <span className={`${styles.row} ${className}`} {...props}>
      <span className={styles.label}>{children}</span>
      <InfoButton onClick={onInfo} size={16} />
    </span>
  );
};
