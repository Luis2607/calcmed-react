import { Icon } from '../Icon';
import styles from './FAB.module.css';

/**
 * Atom: FAB (Floating Action Button · DS · code-first F-PCR-2.5).
 * 56×56 circle teal · ancorado top do ActionFooter na T2 PCR (golden `.fab-evento`).
 * Position absolute · bottom: 100% · margin-bottom: var(--esp-4).
 *
 * Anchor pattern: o componente é position absolute, mas o container PAI deve ser
 * position relative. Use dentro da seção que contém o ActionFooter.
 *
 * Props:
 *  - icon: string (required) — nome do Icon (ex: 'plus').
 *  - onClick: () => void
 *  - ariaLabel: string (required) — descrição acessível ("Adicionar evento").
 *  - disabled?: bool
 *  - className?: string — override (uso raro).
 */
export function FAB({ icon, onClick, ariaLabel, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      className={[styles.fab, className].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      <Icon name={icon} size={24} />
    </button>
  );
}
