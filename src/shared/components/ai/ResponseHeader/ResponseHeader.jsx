import styles from './ResponseHeader.module.css';

/**
 * AI · ResponseHeader — topo de uma resposta: badge de intenção + título +
 * linha de contexto clínico. O badge de intenção é da camada de IA (taxonomia
 * comportamental), colorido pelos tokens de tag do DS via data-intent.
 *
 * Intenções: dose | ambigua | operacional | exame | comparacao | protocolo |
 *            aprendizado | resumo | triagem | critico
 *
 * Props:
 *  - title (obrigatório)
 *  - context: linha de contexto clínico (opcional)
 *  - intent: chave da intenção (colore o badge)
 *  - intentLabel: rótulo exibido no badge (opcional; default = chave)
 */
export const ResponseHeader = ({ title, context, intent, intentLabel }) => (
  <header className={styles.header}>
    {intent && (
      <span className={styles.intent} data-intent={intent}>
        {intentLabel ?? intent}
      </span>
    )}
    <h3 className={styles.title}>{title}</h3>
    {context && <p className={styles.context}>{context}</p>}
  </header>
);
