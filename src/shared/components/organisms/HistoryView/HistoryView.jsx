import styles from './HistoryView.module.css';

/**
 * Organism: HistoryView.
 * Lista de casos com cabecalho + Limpar Tudo + empty-state. Aprovado DS.2 (Luis):
 * quando `onCaseClick` for passada, cada card vira <button> clivavel; sem ela,
 * preserva o comportamento atual (div estatico).
 */
export const HistoryView = ({
  cases = [],
  onClear,
  onCaseClick,
  ...props
}) => {
  // Map status values to Tag Status classes
  const getStatusClass = (status) => {
    switch (status) {
      case 'Alta':
      case 'Sucesso':
        return styles.statusSuccess;
      case 'UTI':
      case 'Atenção':
        return styles.statusWarning;
      case 'Óbito':
      case 'Crítico':
        return styles.statusCritical;
      default:
        return styles.statusInfo;
    }
  };

  return (
    <div className={styles.container} {...props}>
      <div className={styles.headerRow}>
        <span className={styles.sectionLabel}>Histórico de Casos</span>
        {cases.length > 0 && onClear && (
          <button 
            type="button" 
            className={styles.clearBtn} 
            onClick={onClear}
          >
            Limpar Tudo
          </button>
        )}
      </div>

      {cases.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className={styles.emptyTitle}>Nenhum Caso Registrado</span>
          <span className={styles.emptySubtitle}>Os atendimentos concluídos serão exibidos aqui de forma segura e local.</span>
          <span className={styles.disclaimer}>LGPD-compliant (somente iniciais do paciente)</span>
        </div>
      ) : (
        <div className={styles.list}>
          {cases.map((c) => {
            const inner = (
              <>
                <div className={styles.cardHeader}>
                  <div className={styles.patientInfo}>
                    <span className={styles.initials}>{c.initials}</span>
                    <span className={styles.date}>{c.date}</span>
                  </div>
                  <span className={`${styles.statusTag} ${getStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duração:</span>
                    <span className={styles.metaValue}>{c.duration}</span>
                  </div>
                </div>
              </>
            );
            if (onCaseClick) {
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.card} ${styles.cardButton}`}
                  onClick={() => onCaseClick(c)}
                >
                  {inner}
                </button>
              );
            }
            return (
              <div key={c.id} className={styles.card}>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
