import { Tag } from '../../molecules/Tag/Tag';
import styles from './Timeline.module.css';

const EMPTY_EVENTS = [];

const toneByStatus = {
  success: 'novo',
  warning: 'atencao',
  critical: 'critico',
  info: 'premium',
};

export function Timeline({ title = 'Linha do tempo', events = EMPTY_EVENTS, emptyText = 'Nenhum evento registrado.' }) {
  return (
    <section className={styles.timeline}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <Tag variant="count">{events.length}</Tag>
      </div>

      {events.length === 0 ? (
        <div className={styles.empty}>{emptyText}</div>
      ) : (
        <ol className={styles.list}>
          {events.map((event, index) => (
            <li key={event.id || `${event.time}-${index}`} className={styles.event} data-status={event.status || 'info'}>
              <div className={styles.rail}>
                <span className={styles.dot} />
                {index < events.length - 1 && <span className={styles.line} />}
              </div>
              <div className={styles.card}>
                <div className={styles.eventHeader}>
                  <span className={styles.time}>{event.time}</span>
                  {event.statusLabel && (
                    <Tag variant="status" tone={toneByStatus[event.status] || 'premium'}>
                      {event.statusLabel}
                    </Tag>
                  )}
                </div>
                <span className={styles.eventTitle}>{event.title}</span>
                {event.description && <p className={styles.description}>{event.description}</p>}
                {event.meta && <span className={styles.meta}>{event.meta}</span>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
