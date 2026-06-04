import { Icon } from '../../shared/components/atoms/Icon';
import styles from './IAOnboarding.module.css';

/**
 * IAOnboarding — tela de 1º acesso à IA do CalcMed (mostrada uma vez, flag
 * ia_onboarded). Explica o que é a IA (assistente clínico do CalcMed, não um
 * chatbot genérico) e dá os avisos de segurança antes do uso.
 *
 * Props: onContinue() · onBack?()
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

export function IAOnboarding({ onContinue, onBack }) {
  return (
    <div className={styles.screen}>
      {onBack && (
        <button type="button" className={styles.back} onClick={onBack} aria-label="Voltar ao app">
          <Icon name="voltar" size={22} />
        </button>
      )}

      <div className={styles.scroll}>
        <span className={styles.mark}><Icon name="sparkles" size={30} /></span>
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
          Entendi, começar
        </button>
        <p className={styles.fineprint}>
          Demonstração · conteúdo clínico ilustrativo, validação final pelo time médico.
        </p>
      </div>
    </div>
  );
}
