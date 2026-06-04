import { DoseDisplay } from '../../molecules/DoseDisplay';
import { Icon } from '../../atoms/Icon';
import { useCopy } from '../../../hooks/useCopy';
import styles from './DoseBlock.module.css';

/**
 * AI · DoseBlock — resposta de dose objetiva (Compact Answer). Compõe o
 * DoseDisplay do DS e acopla a ação de copiar (dose é o caso clássico de
 * reaproveitamento). Não reinventa a exibição de dose.
 *
 * Props:
 *  - value, unit, via: repassados ao DoseDisplay
 *  - copyable: mostra botão de copiar (default true)
 *  - copyText: texto copiado (default `${value} ${unit}`)
 */
export const DoseBlock = ({ value, unit, via, copyable = true, copyText }) => {
  const { copied, copy } = useCopy();
  const payload = copyText ?? [value, unit].filter(Boolean).join(' ');

  return (
    <div className={styles.block}>
      <DoseDisplay value={value} unit={unit} via={via} />
      {copyable && (
        <button
          type="button"
          className={styles.copy}
          onClick={() => copy(payload)}
          aria-label={copied ? 'Dose copiada' : 'Copiar dose'}
        >
          <Icon name={copied ? 'confirmacao' : 'copiar'} size={16} />
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      )}
    </div>
  );
};
