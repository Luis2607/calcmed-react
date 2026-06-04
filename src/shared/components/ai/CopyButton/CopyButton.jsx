import { Icon } from '../../atoms/Icon';
import { useCopy } from '../../../hooks/useCopy';
import styles from './CopyButton.module.css';

/**
 * CopyButton — copiar com micro-interação: ao copiar, o ícone faz cross-fade
 * para um check (com leve "pop") e volta sozinho. Só confirma em cópia REAL
 * (useCopy trata falha do clipboard — nunca "mente" sucesso).
 *
 * O chrome do botão (tamanho/fundo/borda/hover) vem do `className` do consumidor;
 * aqui só mora a lógica de cópia + a animação dos glifos. Assim o mesmo botão
 * serve o rodapé da resposta, o flutuante dentro de um card, etc.
 *
 * Props:
 *  - text: string | () => string   (conteúdo a copiar; função p/ lazy)
 *  - label / copiedLabel: aria-label/title nos dois estados
 *  - size: px do ícone (default 16)
 *  - className: chrome do botão
 *  - onCopied?: callback após disparar a cópia
 */
export function CopyButton({ text, label = 'Copiar', copiedLabel = 'Copiado', size = 16, className = '', onCopied }) {
  const { copied, copy } = useCopy();

  const handle = (e) => {
    e.stopPropagation(); // não dispara clique do card que o contém
    copy(typeof text === 'function' ? text() : text);
    onCopied?.();
  };

  return (
    <button
      type="button"
      className={[styles.btn, className].filter(Boolean).join(' ')}
      onClick={handle}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
    >
      <span className={styles.stack} data-copied={copied || undefined} style={{ width: size, height: size }}>
        <span className={styles.copy}><Icon name="copiar" size={size} /></span>
        <span className={styles.check}><Icon name="confirmacao" size={size} /></span>
      </span>
    </button>
  );
}
