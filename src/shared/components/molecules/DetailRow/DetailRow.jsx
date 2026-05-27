import styles from './DetailRow.module.css';

/**
 * Molecule: DetailRow — linha rótulo/valor de TELA (log/resumo, detalhe de caso).
 *
 * Espelha o padrão canônico `SheetDetailRow`/`.detailRow` (usado no DetailSheet do
 * histórico — port do golden), mas standalone p/ uso direto em tela. Criado SEPARADO
 * do SheetDetailRow de propósito: não tocar os sheets (fusão futura, N3 do plano).
 * Divisor (border-bottom sutil) entre linhas irmãs; última sem divisor.
 * Cor/spacing só via token.
 *
 * Props: label · value
 */
export const DetailRow = ({ label, value, className = '', ...props }) => (
  <div className={[styles.row, className].filter(Boolean).join(' ')} {...props}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);
