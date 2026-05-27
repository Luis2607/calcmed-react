import styles from './GoldenProtocolFrame.module.css';

export function GoldenProtocolFrame({ protocol }) {
  return (
    <div className={styles.wrap}>
      <section className={styles.frameShell} aria-label={`${protocol.title} - prototipo validado`}>
        <iframe
          className={styles.frame}
          title={`${protocol.title} - HTML validado`}
          src={protocol.legacyPath}
        />
      </section>
    </div>
  );
}
