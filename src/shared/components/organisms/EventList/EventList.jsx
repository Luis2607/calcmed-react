import { Tag } from '../../molecules/Tag/Tag';
import { EventItem } from '../../molecules/EventItem';
import styles from './EventList.module.css';

/**
 * Organism: EventList (DS · code-first F-PCR-2.2).
 * Lista colapsável de eventos PCR T2 (Linha do tempo). Compõe N×EventItem com:
 *   <details><summary>Linha do tempo + contador</summary> + lista reverse</details>
 * Empty state com texto auxiliar.
 *
 * Golden anatomia (pcr.js linha 1091 renderizarEventos · pcr.html linha 184):
 * - Summary: "Linha do tempo" + Tag count (mais novo no topo)
 * - Vazio: texto auxiliar dashed
 *
 * Distinto do organism Timeline (Sepse · DetailSheet) — EventList tem details
 * collapsible + summary clicável; Timeline é lista aberta sempre.
 *
 * Props:
 *  - events ([{time, offset, title, tag}]): eventos já formatados. Renderizados em
 *    ordem REVERSE (mais novo primeiro · consistente com golden).
 *  - emptyText? (string): texto do estado vazio.
 *  - defaultOpen? (bool): se details abre por default.
 *  - title? (string): label do summary (default "Linha do tempo").
 *
 * Tokens-only. Zero hardcode.
 */
export function EventList({
  events = [],
  emptyText = 'Eventos vão aparecer aqui conforme você opera.',
  defaultOpen = false,
  title = 'Linha do tempo',
}) {
  // §golden · renderiza reverse (mais novo no topo)
  const reversedEvents = [...events].reverse();

  if (events.length === 0) {
    return (
      <section className={styles.wrap} aria-label={title}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryTitle}>{title}</span>
        </div>
        <div className={styles.empty}>{emptyText}</div>
      </section>
    );
  }

  return (
    <details className={styles.wrap} open={defaultOpen || undefined}>
      <summary className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryTitle}>{title}</span>
          <span className={styles.summaryRight}>
            <Tag variant="count">{events.length}</Tag>
            <span className={styles.chevron} aria-hidden="true">▾</span>
          </span>
        </div>
      </summary>
      <ol className={styles.list}>
        {reversedEvents.map((event, index) => (
          <EventItem
            key={event.id || `${event.time}-${index}`}
            time={event.time}
            offset={event.offset}
            title={event.title}
            tag={event.tag}
          />
        ))}
      </ol>
    </details>
  );
}
