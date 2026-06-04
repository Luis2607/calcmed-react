import { Icon } from '../../atoms/Icon';
import styles from './AIResponse.module.css';

/**
 * AI · AIResponse — container de uma resposta estruturada da IA do CalcMed.
 *
 * É a "bolha" que envolve os blocos de uma resposta (header, ação, tabela,
 * alerta, chips...). Não decide conteúdo: só dá a moldura, o respiro e o
 * estado de risco. Tudo sobre tokens do DS — nenhuma cor nova.
 *
 * Props:
 *  - children: blocos da resposta (ResponseHeader, PrimaryAction, Table, ...)
 *  - risk: 'baixo' | 'medio' | 'alto' — realça a borda esquerda em risco alto
 *  - barLabel: rótulo da barra superior (default "Resposta CalcMed IA")
 *  - showBar: exibe a barra superior (default true)
 */
export const AIResponse = ({ children, risk, barLabel = 'Resposta CalcMed IA', showBar = true }) => (
  <article className={styles.response} data-risk={risk || undefined}>
    {showBar && (
      <div className={styles.bar}>
        <span className={styles.brand}>
          <Icon name="sparkles" size={14} />
          {barLabel}
        </span>
        {risk === 'alto' && <span className={styles.riskFlag}>Prioridade</span>}
      </div>
    )}
    <div className={styles.body}>{children}</div>
  </article>
);
