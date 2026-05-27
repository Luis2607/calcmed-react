import styles from './CarouselDots.module.css';

/**
 * Molecule: CarouselDots (DS · Figma 133:9766).
 * Indicador de slides. Ativo 20×8 (alongado), inativo 8×8 · pill.
 * Figma usa branco (overlay de imagem); aqui teal/cinza p/ fundo claro (prop onMedia p/ branco).
 */
export const CarouselDots = ({ count = 3, active = 0, onDotClick, onMedia = false }) => (
  <div className={[styles.dots, onMedia ? styles.onMedia : ''].filter(Boolean).join(' ')} role="tablist" aria-label="Slides">
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        type="button"
        role="tab"
        aria-selected={i === active}
        aria-label={`Slide ${i + 1}`}
        onClick={() => onDotClick && onDotClick(i)}
        className={[styles.dot, i === active ? styles.active : ''].filter(Boolean).join(' ')}
      />
    ))}
  </div>
);
