import { useState } from 'react';
import { Chip } from '../../molecules/Chip';
import { Icon } from '../../atoms/Icon';
import { useCopy } from '../../../hooks/useCopy';
import styles from './CopyableBlock.module.css';

/**
 * AI · CopyableBlock — texto pronto para reaproveitar fora do chat (evolução,
 * prontuário, WhatsApp). Suporta variações de formato via chips; copiar leva
 * o texto da variação ativa. Compõe Chip + ação de copiar do DS.
 *
 * Props:
 *  - text: texto único (quando não há variações)
 *  - variants: [{ label, text }] — alterna o formato; sobrepõe `text`
 *  - onCopied(msg): callback após copiar (ex.: abrir toast)
 */
export const CopyableBlock = ({ text, variants, onCopied }) => {
  const list = variants && variants.length ? variants : null;
  const [active, setActive] = useState(0);
  const { copied, copy } = useCopy();
  const current = list ? list[active]?.text : text;

  const handleCopy = () => {
    copy(current);
    onCopied?.('Texto copiado');
  };

  return (
    <div className={styles.block}>
      {list && (
        <div className={styles.formats}>
          {list.map((v, i) => (
            <Chip key={v.label} state={i === active ? 'active' : 'default'} onClick={() => setActive(i)}>
              {v.label}
            </Chip>
          ))}
        </div>
      )}
      <div className={styles.textWrap}>
        <p className={styles.text}>{current}</p>
        <button
          type="button"
          className={styles.copy}
          onClick={handleCopy}
          aria-label={copied ? 'Texto copiado' : 'Copiar texto'}
          title="Copiar"
        >
          <Icon name={copied ? 'confirmacao' : 'copiar'} size={15} />
        </button>
      </div>
    </div>
  );
};
