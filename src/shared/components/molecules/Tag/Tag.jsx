import styles from './Tag.module.css';

/**
 * Molecule: Tag (DS · Figma page "Tags e Chips").
 * Cobre 3 dos componentes de badge do Figma:
 *  - variant="status" (Tag Status 128:3769) · tone = premium|teste|gratuito|novo|atualizado|
 *      expira|melhoria|recomendado|bonus|atencao|critico|alerta
 *  - variant="domain" (Tag Domain 128:3744) · tone = urgencias|diluicoes|calculadoras|
 *      protocolos|escores|conversores
 *  - variant="count"  (Tag Count 128:3779) · número/contador, pill neutro
 *  - variant="abbr"   (Tag Abbr 145:33146) · abreviação 18 Semi Bold · tone = domínio (cor 12% + texto sólido)
 * Dark via escopo .modo-escuro (tokens).
 */
export const Tag = ({ children, label, variant = 'status', tone }) => {
  const cls = [
    styles.tag,
    styles[variant],
    tone ? styles[`tone-${tone}`] : '',
  ].filter(Boolean).join(' ');
  return <span className={cls}>{children ?? label}</span>;
};
