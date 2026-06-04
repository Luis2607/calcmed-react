import { Icon } from '../../atoms/Icon';
import styles from './AIResponse.module.css';

/**
 * AI · AIResponse — container de uma resposta estruturada da IA do CalcMed.
 *
 * Não decide conteúdo: dá a moldura, o respiro e o estado de risco. Sobre
 * tokens do DS — nenhuma cor nova.
 *
 * Variantes:
 *  - 'card' (default): caixa com borda/sombra. Uso: documentação do DS (delimita
 *    o exemplo como um artefato).
 *  - 'plain': largura cheia, sem caixa — os blocos internos (tabela, alerta,
 *    ação) já têm estrutura própria. Uso: conversa (chat), onde encaixotar cada
 *    resposta desperdiça espaço.
 *
 * Props:
 *  - children, risk ('baixo'|'medio'|'alto'), variant ('card'|'plain')
 *  - barLabel (default "Resposta CalcMed IA"), showBar (default true)
 */
export const AIResponse = ({ children, risk, variant = 'card', barLabel = 'Resposta CalcMed IA', showBar = true }) => (
  <article className={styles.response} data-risk={risk || undefined} data-variant={variant}>
    {showBar && (
      <div className={styles.bar}>
        <span className={styles.brand}>
          <Icon name="sparkles" size={14} />
          {variant === 'plain' ? 'IA · CalcMed' : barLabel}
        </span>
        {risk === 'alto' && <span className={styles.riskFlag}>Prioridade</span>}
      </div>
    )}
    <div className={styles.body}>{children}</div>
  </article>
);
