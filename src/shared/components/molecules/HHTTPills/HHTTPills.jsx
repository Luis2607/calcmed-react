import styles from './HHTTPills.module.css';

/**
 * Molecule: HHTTPills (DS · code-first F-PCR-2.7).
 * Mnemônicos 5H + 5T das causas reversíveis de PCR não-chocável (AHA 2025).
 * Cada item: letra colorida (H teal · T amber) + termo. Grid 2-col responsive.
 *
 * Usado em:
 *  - Modal `hh-tt` (Causas reversíveis · Sub-tab Fluxogramas)
 *  - Modal `5h5t-resumo` (auto-trigger após selecionar AESP/Assist · 250ms delay)
 *
 * Props:
 *  - items: [{letter: 'H' | 'T', label: string}] — 10 itens fixos do ACLS:
 *      Hipovolemia · Hipóxia · H+ (acidose) · Hipo/hiperK+ · Hipotermia
 *      Tensão (pneumo) · Tamponamento · Toxinas · TEP · Trombose coronária
 *
 *  - emphasized? (string): item específico em destaque (ex.: 'Hipovolemia' bg highlight).
 *
 * Tokens-only. Letra colorida via tone classes (sem hardcode).
 */
export function HHTTPills({ items = [], emphasized }) {
  return (
    <ul className={styles.grid}>
      {items.map((item, i) => {
        const isH = item.letter === 'H';
        const isEmphasized = emphasized && item.label === emphasized;
        return (
          <li
            key={`${item.letter}-${i}`}
            className={[
              styles.pill,
              isH ? styles.toneH : styles.toneT,
              isEmphasized ? styles.emphasized : '',
            ].filter(Boolean).join(' ')}
          >
            <span className={styles.letter}>{item.letter}</span>
            <span className={styles.label}>{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

