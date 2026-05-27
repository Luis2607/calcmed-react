import styles from './OptionCard.module.css';

/**
 * Molecule: OptionCard — superfície de escolha rica (cenário/conduta).
 *
 * Porta o SCA `SelectCard` (title + meta + descrição/children, seleção pela própria
 * superfície: borda + fundo + inset, tone-aware) e as seleções do CAD. Distinto do
 * RadioGroup/CheckboxGroup variante card (controle + label simples) — aqui NÃO há
 * controle; a seleção é o próprio cartão. Tones com cor só via token (sem o hex
 * cravado que o flow usava).
 *
 * Props:
 *   title       node (obrigatório) — rótulo principal
 *   meta        node? — eyebrow/badge à direita do título (ex.: "Preferencial")
 *   description node? — texto de apoio
 *   children    node? — corpo livre (além de description)
 *   tone        'default' | 'info' | 'warning' | 'critical' | 'success'
 *   selected    bool — estado selecionado (borda + fundo + inset na cor do tone)
 *   disabled    bool
 *   onClick     fn
 */
export const OptionCard = ({
  title,
  meta,
  description,
  children,
  tone = 'default',
  selected = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const hasBody = (description != null && description !== '') || Boolean(children);

  return (
    <button
      type="button"
      className={[styles.card, className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-selected={selected ? 'true' : 'false'}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <span className={styles.header}>
        <strong className={styles.title}>{title}</strong>
        {meta != null && meta !== '' ? <em className={styles.meta}>{meta}</em> : null}
      </span>
      {hasBody ? (
        <span className={styles.body}>
          {description}
          {children}
        </span>
      ) : null}
    </button>
  );
};
