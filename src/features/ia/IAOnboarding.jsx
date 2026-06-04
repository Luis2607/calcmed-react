import { Icon } from '../../shared/components/atoms/Icon';
import styles from './IAOnboarding.module.css';

/**
 * IAOnboarding — modal de boas-vindas da IA do CalcMed (1º acesso, flag
 * ia_onboarded) e de "rever avisos". Aparece como overlay sobre o chat (não
 * toma a tela inteira): explica o que é a IA e dá os avisos de segurança.
 *
 * Props: onContinue() · onClose?() (X / backdrop) · ctaLabel?
 */
const POINTS = [
  {
    emoji: '⚠️',
    title: 'Apoio à decisão, não substituto',
    desc: 'As respostas ajudam o seu raciocínio. A decisão e a responsabilidade clínica são sempre suas.',
  },
  {
    emoji: '✅',
    title: 'Confira sempre',
    desc: 'Pode haver imprecisões. Valide doses e condutas com o protocolo da sua instituição.',
  },
  {
    emoji: '🔒',
    title: 'Sem dados que identifiquem o paciente',
    desc: 'Converse com a informação clínica — sem nome, prontuário ou identificadores.',
  },
];

export function IAOnboarding({ onContinue, onClose, ctaLabel = 'Entendi, começar' }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label="Sobre a IA do CalcMed" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            <Icon name="fechar" size={20} />
          </button>
        )}

        <div className={styles.scroll}>
          <span className={styles.mark}><Icon name="sparkles" size={28} /></span>
          <h1 className={styles.title}>IA do CalcMed</h1>
          <p className={styles.intro}>
            O assistente clínico do CalcMed para urgência e emergência. As respostas vêm
            <strong> estruturadas e com o próximo passo</strong> — não é um chatbot genérico.
          </p>

          <ul className={styles.points}>
            {POINTS.map((p) => (
              <li key={p.title} className={styles.point}>
                <span className={styles.pointIcon} aria-hidden="true">{p.emoji}</span>
                <span className={styles.pointText}>
                  <span className={styles.pointTitle}>{p.title}</span>
                  <span className={styles.pointDesc}>{p.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cta} onClick={onContinue}>
            {ctaLabel}
          </button>
          <p className={styles.fineprint}>
            Demonstração · conteúdo clínico ilustrativo, validação final pelo time médico.
          </p>
        </div>
      </div>
    </div>
  );
}
