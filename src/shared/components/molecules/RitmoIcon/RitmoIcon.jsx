import styles from './RitmoIcon.module.css';

/**
 * Molecule: RitmoIcon (DS · code-first F-PCR · §B1 Gustavo).
 * Ícone de traçado ECG característico por ritmo de PCR. Reconhecível em 1 olhada
 * (médico identifica o ritmo pelo padrão visual, não só pelo texto).
 *
 * Ritmos (ACLS 2025):
 *  - fv (Fibrilação Ventricular): traçado caótico, irregular, amplitude variável.
 *  - tv (TV sem pulso): ondas largas monomórficas regulares (sinusoidal larga).
 *  - aesp (Atv Elétrica Sem Pulso): complexo QRS organizado (engana — sem pulso).
 *  - assistolia: linha reta (flatline).
 *  - na (Não avaliado): linha tracejada.
 *
 * Cor herda currentColor (tom dado pelo contexto · chocável vermelho, etc).
 *
 * Props:
 *  - ritmo: 'fv' | 'tv' | 'aesp' | 'assistolia' | 'na' (required)
 *  - size?: number (default 40) — largura; altura = size / 2 (traçado é wide).
 *  - className?: string
 */
const PATHS = {
  // Caótico irregular — amplitude variável (FV)
  fv: 'M0 12 L3 7 L5 16 L8 5 L11 18 L13 9 L16 15 L19 6 L22 17 L25 10 L28 15 L31 7 L34 16 L37 10 L40 13 L44 8 L48 12',
  // Ondas largas monomórficas regulares (TV)
  tv: 'M0 12 Q6 1 12 12 Q18 23 24 12 Q30 1 36 12 Q42 23 48 12',
  // Complexo QRS organizado (AESP) — parece normal mas sem pulso
  aesp: 'M0 12 L9 12 L11 9 L13 12 L15 12 L17 3 L19 21 L21 12 L27 12 L29 9 L31 12 L33 12 L35 3 L37 21 L39 12 L48 12',
  // Linha reta (Assistolia)
  assistolia: 'M0 12 L48 12',
  // Linha tracejada (Não avaliado)
  na: 'M0 12 L48 12',
};

export function RitmoIcon({ ritmo = 'na', size = 40, className = '' }) {
  const path = PATHS[ritmo] || PATHS.na;
  const isNa = ritmo === 'na';
  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(' ')}
      width={size}
      height={size / 2}
      viewBox="0 0 48 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={isNa ? '4 4' : undefined}
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
