import { DoseDisplay } from '../../molecules/DoseDisplay';
import { CopyButton } from '../CopyButton';
import styles from './DoseBlock.module.css';

/**
 * AI · DoseBlock — resposta de dose objetiva (Compact Answer). Compõe o
 * DoseDisplay do DS. O copiar é um botão flutuante no canto superior direito
 * DENTRO do card (com espaço reservado p/ não colidir com o valor), com a
 * micro-interação de check do CopyButton.
 *
 * Props:
 *  - value, unit, via: repassados ao DoseDisplay
 *  - copyable: mostra o botão de copiar (default true)
 *  - copyText: texto copiado (default `${value} ${unit} ${via}`)
 */
export const DoseBlock = ({ value, unit, via, copyable = true, copyText }) => {
  const payload = copyText ?? [value, unit, via].filter(Boolean).join(' ');

  return (
    <div className={styles.block} data-copyable={copyable || undefined}>
      <DoseDisplay value={value} unit={unit} via={via} />
      {copyable && (
        <CopyButton text={payload} className={styles.copy} size={16} label="Copiar dose" />
      )}
    </div>
  );
};
