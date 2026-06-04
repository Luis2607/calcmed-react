import { Icon } from '../../shared/components/atoms/Icon';
import { InfoSheet } from '../../shared/components/overlays/patterns';
import styles from './IAOnboarding.module.css';

/**
 * IAOnboarding — boas-vindas/avisos da IA do CalcMed como BottomSheet do DS
 * (pattern InfoSheet). 1º acesso (flag ia_onboarded) e "rever avisos".
 *
 * Props: open · onClose() · ctaLabel? · blocking? (1º acesso só fecha pelo CTA)
 */
const POINTS = [
  {
    icon: 'atencao',
    tone: 'warning',
    title: 'Quem decide é você',
    desc: 'A IA organiza o raciocínio. A conduta e a responsabilidade continuam suas.',
  },
  {
    icon: 'confirmacao',
    tone: 'success',
    title: 'Confirme antes de aplicar',
    desc: 'Ela pode errar. Cheque dose e conduta no protocolo do seu serviço.',
  },
  {
    icon: 'cadeado',
    tone: 'neutral',
    title: 'Nada que identifique o paciente',
    desc: 'Fale da clínica — sem nome, leito ou prontuário.',
  },
];

export function IAOnboarding({ open, onClose, ctaLabel = 'Entendi, começar', blocking = false }) {
  return (
    <InfoSheet
      open={open}
      onClose={onClose}
      title="IA do CalcMed"
      description="Apoio clínico pro plantão."
      leadingIcon={<Icon name="sparkles" size={20} />}
      tone="info"
      acknowledgeLabel={ctaLabel}
      blocking={blocking}
    >
      <p className={styles.intro}>
        Pergunte uma dose, descreva um caso ou mande um exame. A resposta vem direto ao ponto —
        conduta, dose e o próximo passo.
      </p>

      <ul className={styles.points}>
        {POINTS.map((p) => (
          <li key={p.title} className={styles.point}>
            <span className={styles.icon} data-tone={p.tone} aria-hidden="true">
              <Icon name={p.icon} size={18} />
            </span>
            <span className={styles.text}>
              <span className={styles.pointTitle}>{p.title}</span>
              <span className={styles.pointDesc}>{p.desc}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className={styles.fineprint}>Demonstração — conteúdo clínico ilustrativo.</p>
    </InfoSheet>
  );
}
