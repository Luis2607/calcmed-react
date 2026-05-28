import styles from './OptionCard.module.css';

/**
 * Molecule: OptionCard — superfície de escolha rica (cenário/conduta).
 *
 * Ancorada no GOLDEN consistente (`.exame-card` + seleção `.faixa-chip.selecionado`),
 * o padrão compartilhado por CAD/Sepse/PCR/AVC — NÃO no SCA (fluxo menos consistente).
 * title + meta + descrição/children; seleção pela própria superfície (borda 2px na cor
 * do tone, sem controle). Distinto do RadioGroup/CheckboxGroup variante card (controle +
 * label simples). Tones só via token.
 *
 * Props:
 *   title       node (obrigatório) — rótulo principal
 *   meta        node? — eyebrow/badge à direita do título (ex.: "Preferencial")
 *   description node? — texto de apoio
 *   media       node? — slot de mídia à esquerda (ex.: <RitmoIcon/>) · §B1 PCR
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
  media,
  children,
  tone = 'default',
  selected = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const hasBody = (description != null && description !== '') || Boolean(children);

  const inner = (
    <>
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
    </>
  );

  return (
    <button
      type="button"
      className={[styles.card, media ? styles.withMedia : '', className].filter(Boolean).join(' ')}
      data-tone={tone}
      data-selected={selected ? 'true' : 'false'}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {media ? (
        <>
          <span className={styles.media} aria-hidden="true">{media}</span>
          <span className={styles.content}>{inner}</span>
        </>
      ) : inner}
    </button>
  );
};
