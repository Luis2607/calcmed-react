import { useState } from 'react';
import { Chip } from '../../molecules/Chip';
import { CopyButton } from '../CopyButton';
import styles from './CopyableBlock.module.css';

/**
 * AI · CopyableBlock — texto pronto para reaproveitar fora do chat (evolução,
 * prontuário, WhatsApp). Suporta variações de formato via chips; copiar leva
 * o texto da variação ativa. Compõe Chip + CopyButton (micro-interação de check).
 *
 * Props:
 *  - text: texto único (quando não há variações)
 *  - variants: [{ label, text }] — alterna o formato; sobrepõe `text`
 */
export const CopyableBlock = ({ text, variants }) => {
  const list = variants && variants.length ? variants : null;
  const [active, setActive] = useState(0);
  // clamp: se `variants` encolher, não estoura o índice (copiaria string vazia).
  const safe = list ? Math.min(active, list.length - 1) : 0;
  const current = list ? list[safe]?.text : text;

  return (
    <div className={styles.block}>
      {list && (
        <div className={styles.formats}>
          {list.map((v, i) => (
            <Chip key={`${v.label}-${i}`} state={i === safe ? 'active' : 'default'} onClick={() => setActive(i)}>
              {v.label}
            </Chip>
          ))}
        </div>
      )}
      <div className={styles.textWrap}>
        <p className={styles.text}>{current}</p>
        <CopyButton text={() => current} className={styles.copy} size={15} label="Copiar texto" />
      </div>
    </div>
  );
};
