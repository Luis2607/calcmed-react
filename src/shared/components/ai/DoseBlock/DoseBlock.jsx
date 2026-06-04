import { DoseDisplay } from '../../molecules/DoseDisplay';
import { Icon } from '../../atoms/Icon';
import { useCopy } from '../../../hooks/useCopy';
import styles from './DoseBlock.module.css';

/**
 * AI · DoseBlock — resposta de dose objetiva (Compact Answer). Compõe o
 * DoseDisplay do DS. O copiar é um ícone discreto ABAIXO do card (não rouba
 * largura do valor) e dispara `onCopied` para o consumidor mostrar um toast.
 *
 * Props:
 *  - value, unit, via: repassados ao DoseDisplay
 *  - copyable: mostra o botão de copiar (default true)
 *  - copyText: texto copiado (default `${value} ${unit}`)
 *  - onCopied(msg): callback após copiar (ex.: abrir toast)
 */
export const DoseBlock = ({ value, unit, via, copyable = true, copyText, onCopied }) => {
  const { copied, copy } = useCopy();
  const payload = copyText ?? [value, unit, via].filter(Boolean).join(' ');

  const handleCopy = () => {
    copy(payload);
    onCopied?.('Dose copiada');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.block}>
        <DoseDisplay value={value} unit={unit} via={via} />
      </div>
      {copyable && (
        <div className={styles.copyRow}>
          <button
            type="button"
            className={styles.copy}
            onClick={handleCopy}
            aria-label="Copiar dose"
            title="Copiar dose"
          >
            <Icon name={copied ? 'confirmacao' : 'copiar'} size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
