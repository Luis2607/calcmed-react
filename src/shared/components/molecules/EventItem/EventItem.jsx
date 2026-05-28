import { Tag } from '../Tag/Tag';
import styles from './EventItem.module.css';

/**
 * Molecule: EventItem (DS · code-first F-PCR-2.1).
 * Linha de evento da Timeline T2 PCR. Mostra hora absoluta + offset desde início do
 * caso + descrição da ação + tag colorida lateral por categoria. Read-only.
 *
 * Distinto do organism Timeline (Sepse) que tem rail vertical (dot + linha conectora)
 * e anatomia mais elaborada (eventHeader + eventTitle + description). EventItem é o
 * pattern compacto do golden PCR — sem rail, lado-a-lado.
 *
 * Props:
 *  - time (string · required): HH:MM:SS, hora absoluta.
 *  - offset (string · required): T+MM:SS, tempo desde início do caso.
 *  - title (string · required): descrição da ação (ex: "Adrenalina ×1 · 1 mg IV/IO").
 *  - tag? ('droga' | 'choque' | 'marco' | 'rce'): categoria do evento; mapeia para
 *    Tag.tone (premium/atencao/critico/novo respectivamente).
 *
 * Tokens: --esp-2 · --esp-3 · --fonte-mono · --ds-font-corpo-2 · --ds-texto-* ·
 *         --ds-borda-sutil. Zero hardcode.
 */
const TAG_LABEL = {
  droga: 'Droga',
  choque: 'Choque',
  marco: 'Marco',
  rce: 'RCE',
};

const TAG_TONE = {
  droga: 'premium',   // teal
  choque: 'atencao',  // amarelo
  marco: 'critico',   // vermelho
  rce: 'novo',        // verde
};

export function EventItem({ time, offset, title, tag }) {
  return (
    <li className={styles.item}>
      <div className={styles.timeBlock}>
        <span className={styles.time}>{time}</span>
        <span className={styles.offset}>{offset}</span>
      </div>
      <span className={styles.title}>{title}</span>
      {tag && (
        <Tag variant="status" tone={TAG_TONE[tag]}>
          {TAG_LABEL[tag]}
        </Tag>
      )}
    </li>
  );
}
