import { InputField } from '../../molecules/InputField';
import styles from './AlertCard.module.css';

export const AlertCard = ({
  level = 'info', // 'info' | 'warning' | 'critical' | 'result' | 'footnote'
  darkMode = false,
  showIcon = true,
  title,
  children,
  showValue = false, // Figma "Show Value" — exibe Dose + Unit (cor do level)
  value,
  unit,
  // valueInput (DS): renderiza um input compacto DENTRO do card (ex.: peso) p/ doses
  // por peso. O `value` exibido é recalculado pelo PARENT a partir desse input.
  // { label, value, onChange, placeholder?, unit? }
  valueInput,
  className = '',
  ...props
}) => {
  // Dark é dirigido pelo escopo global .modo-escuro (tokens --ds-*/--retorno-* já
  // remapeiam pros valores dark do Figma). A prop darkMode aplica esse escopo no
  // próprio card p/ uso isolado fora de um ancestral .modo-escuro.
  const containerClass = [
    styles.card,
    styles[`level-${level}`],
    darkMode ? 'modo-escuro' : '',
    className
  ].filter(Boolean).join(' ');

  // Ícones por Level — glifos confirmados via export SVG real do Figma 130:4043:
  //   Info=informacao(círculo-i) · Result=sucesso(círculo-check) · Critical=atencao(TRIÂNGULO)
  //   · Warning=critico(OCTÓGONO) · Footnote=rodape(NOTA c/ linhas + dobra).
  const getIcon = () => {
    switch (level) {
      case 'critical': // Figma icone/atencao — triângulo de alerta
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 3.53 21h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'warning': // Figma icone/critico — octógono de alerta
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case 'result': // Figma icone/sucesso — círculo com check
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="16 9 11 14 8 11" />
          </svg>
        );
      case 'footnote': // Figma icone/rodape — nota/documento com linhas + dobra inferior-direita
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h14a1 1 0 0 1 1 1v10l-5 5H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
            <polyline points="20 15 15 15 15 20" />
            <line x1="8" y1="9" x2="16" y2="9" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="8" y1="15" x2="12" y2="15" />
          </svg>
        );
      case 'info':
      default: // Figma icone/informacao — círculo com i
        return (
          <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <div className={containerClass} {...props}>
      <div className={styles.topRow}>
        {showIcon && <div className={styles.iconWrapper}>{getIcon()}</div>}
        {title && <span className={styles.title}>{title}</span>}
      </div>
      {valueInput && (
        <div className={styles.inputRow}>
          <InputField
            label={valueInput.label}
            type="text"
            inputMode="decimal"
            mono
            value={valueInput.value}
            onChange={valueInput.onChange}
            placeholder={valueInput.placeholder}
            unit={valueInput.unit}
            showUnit={Boolean(valueInput.unit)}
          />
        </div>
      )}
      {showValue && value != null && (
        <div className={styles.value}>
          <span className={`${styles.dose} mono`}>{value}</span>
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      )}
      {children && <div className={styles.body}>{children}</div>}
    </div>
  );
};
