import styles from './EntryChooser.module.css';

/**
 * Gate de entrada do app — escolhe entre ver o Protótipo (produto funcional /
 * Central de Urgência) ou o Design System (documentação viva + galerias QA).
 *
 * É um seletor de visão, não produto: vive fora do frame do celular e usa os
 * tokens do DS (sem inventar paleta nova). A escolha é persistida em
 * localStorage (app_mode) pelo App; daqui só emitimos a intenção via onChoose.
 *
 * Props:
 *  - onChoose(mode): 'prototype' | 'ds'
 */
const OPTIONS = [
  {
    mode: 'prototype',
    glyph: '🩺',
    eyebrow: 'Produto',
    title: 'Protótipo',
    desc: 'Central de Urgência funcional — Home, protocolos (PCR, SCA, Sepse, AVC, CAD) e fluxos clínicos guiados.',
    bullets: ['Navegação real do app', 'Protocolos React + golden master', 'Estados, timers e histórico'],
    cta: 'Abrir protótipo',
  },
  {
    mode: 'ds',
    glyph: '🎨',
    eyebrow: 'Documentação',
    title: 'Design System',
    desc: 'Documentação viva do DS CalcMed — tokens, componentes, galerias QA e o sistema de respostas da IA.',
    bullets: ['Cores, tipografia, espaçamento', 'Componentes e bottom sheets', 'IA · Sistema de Respostas'],
    cta: 'Abrir Design System',
  },
];

export function EntryChooser({ onChoose }) {
  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>🏆</span>
            <div className={styles.brandText}>
              <strong>CalcMed</strong>
              <span>CENTRAL DE URGÊNCIA</span>
            </div>
          </div>
          <h1 className={styles.title}>O que você quer ver?</h1>
          <p className={styles.subtitle}>
            Escolha entre o protótipo do produto ou a documentação do Design System.
            Dá para trocar de visão a qualquer momento.
          </p>
        </header>

        <div className={styles.grid}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              className={styles.card}
              data-mode={opt.mode}
              onClick={() => onChoose(opt.mode)}
            >
              <span className={styles.glyph} aria-hidden="true">{opt.glyph}</span>
              <span className={styles.eyebrow}>{opt.eyebrow}</span>
              <span className={styles.cardTitle}>{opt.title}</span>
              <span className={styles.cardDesc}>{opt.desc}</span>
              <ul className={styles.bullets}>
                {opt.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <span className={styles.cta}>
                {opt.cta}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <footer className={styles.foot}>
          <span>DS v6.5 · 2026</span>
          <span>A seleção fica salva neste navegador.</span>
        </footer>
      </div>
    </div>
  );
}
