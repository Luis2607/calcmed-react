import { Icon } from '../../atoms/Icon';
import styles from './OpenToolButton.module.css';

/**
 * AI · OpenToolButton — deep-link da resposta para uma ferramenta do CalcMed.
 * Visualmente distinto de um Chip de continuidade (que segue a conversa): é um
 * botão de largura cheia, ícone de "abrir" à esquerda e seta à direita,
 * comunicando "sair do chat e abrir a ferramenta". Vai no rodapé da resposta,
 * depois dos chips — é a última afordância ("resolveu aqui? então execute lá").
 *
 * Props: label (ex.: "Abrir Sepse no CalcMed") · onOpen (dispara a navegação)
 */
export const OpenToolButton = ({ label, onOpen }) => (
  <button type="button" className={styles.openTool} onClick={onOpen}>
    <span className={styles.icon} aria-hidden="true"><Icon name="link-externo" size={16} /></span>
    <span className={styles.label}>{label}</span>
    <span className={styles.arrow} aria-hidden="true"><Icon name="seta-direita" size={16} /></span>
  </button>
);
