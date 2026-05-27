import styles from './StepHeader.module.css';
import { InfoButton } from '../../atoms/InfoButton/InfoButton';

/**
 * Molecule: StepHeader — cabeçalho de tela/passo (golden `.tela-cabecalho`).
 *
 * Título (titulo-pagina 24/700/32) + subtítulo opcional (corpo-secundário 14/400/20).
 * `onInfo` → InfoButton "?" no topo direito; `action` → slot livre à direita
 * (golden `.tela-cabecalho-row`, info alinhada ao topo do título). Reusa o atom
 * InfoButton. Cor/spacing só via tokens (--ds-* / --esp-N).
 *
 * Props:
 *   title      string  (obrigatório) — título da tela/passo
 *   subtitle   string? — linha de apoio abaixo do título
 *   onInfo     fn?     — abre teoria/explicação (renderiza InfoButton)
 *   action     node?   — slot à direita (ex.: contador de passo, botão)
 *   as         tag?    — elemento do título ('h1' default | 'h2' | ...)
 */
export const StepHeader = ({
  title,
  subtitle,
  onInfo,
  action,
  as: As = 'h1',
  className = '',
  ...props
}) => {
  const hasAside = Boolean(action) || Boolean(onInfo);
  const rootClass = [styles.root, hasAside && styles.row, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} {...props}>
      <div className={styles.cabecalho}>
        <As className={styles.titulo}>{title}</As>
        {subtitle ? <p className={styles.subtitulo}>{subtitle}</p> : null}
      </div>
      {hasAside ? (
        <div className={styles.aside}>
          {action}
          {onInfo ? <InfoButton onClick={onInfo} size={20} /> : null}
        </div>
      ) : null}
    </div>
  );
};
