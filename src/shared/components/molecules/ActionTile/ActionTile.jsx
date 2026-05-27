import styles from './ActionTile.module.css';
import { Icon } from '../../atoms/Icon/Icon';

/**
 * Molecule: ActionTile — ação rica em grade, ancorada no GOLDEN PCR `.btn-acao-grande`
 * (ícone em quadrado + label + status/valor). Usada em `.acoes-row` do PCR
 * (Selecionar ritmo / Desfibrilar). Reusa o atom Icon. Cor/spacing/radius só via token.
 *
 * Props:
 *   icon     name do Icon (opcional)
 *   label    string (obrigatório) — ação
 *   value    string? — status/valor abaixo (ex.: "Não avaliado", "200 J · bifásico")
 *   disabled bool
 *   onClick  fn
 */
export const ActionTile = ({
  icon,
  label,
  value,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => (
  <button
    type="button"
    className={[styles.tile, className].filter(Boolean).join(' ')}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {icon ? (
      <span className={styles.icon}>
        <Icon name={icon} size={20} />
      </span>
    ) : null}
    <span className={styles.label}>{label}</span>
    {value != null && value !== '' ? <span className={styles.value}>{value}</span> : null}
  </button>
);
