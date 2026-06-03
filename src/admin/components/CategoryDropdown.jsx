import { useEffect, useRef, useState } from 'react';
import { Select } from '../../shared/components/molecules/Select/Select';
import { Checkbox } from '../../shared/components/atoms/Checkbox/Checkbox';
import styles from './CategoryDropdown.module.css';

/**
 * Dropdown de categoria — trigger = Select do DS, menu custom (token-only) que abre no
 * HOVER (e clique). MESMO padrão visual em dois modos:
 *  - multiple: itens com Checkbox (filtro da lista), fica aberto, tem "Limpar seleção".
 *  - single (default): SEM check; clicar seleciona e fecha (campo do editor). O selecionado
 *    fica destacado em teal.
 *
 * O menu encosta no trigger (sem gap) e é descendente do wrapper → mover o mouse do
 * trigger pro menu não dispara mouseleave (continua aberto).
 *
 * Props comuns: options [{value,label}], placeholder, block (largura 100%), disabled.
 * multiple: selected (Set), onToggle(value), onClear()
 * single:   value (string), onChange(value)
 */
export function CategoryDropdown({
  options,
  multiple = false,
  selected,
  onToggle,
  onClear,
  value,
  onChange,
  placeholder = 'Selecione',
  ariaLabel,
  block = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Ao abrir: foca o 1º item (teclado). Esc fecha (sem fechar um modal pai — listener
  // no document dispara antes do window do DesktopModal e dá stopPropagation).
  useEffect(() => {
    if (!open) return undefined;
    menuRef.current?.querySelector('button, input')?.focus?.({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const triggerLabel = multiple
    ? selected.size === 0
      ? ''
      : selected.size === 1
        ? options.find((o) => selected.has(o.value))?.label || '1 categoria'
        : `${selected.size} categorias`
    : options.find((o) => o.value === value)?.label || '';

  return (
    <div
      className={[styles.wrap, block ? styles.block : ''].filter(Boolean).join(' ')}
      onMouseEnter={() => !disabled && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Select
        value={triggerLabel}
        placeholder={placeholder}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
      />
      {open && !disabled && (
        <div ref={menuRef} className={styles.menu} role="listbox" aria-multiselectable={multiple || undefined}>
          {options.map((o) =>
            multiple ? (
              <div key={o.value} className={styles.item}>
                <Checkbox checked={selected.has(o.value)} onChange={() => onToggle(o.value)} label={o.label} />
              </div>
            ) : (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={value === o.value}
                className={`${styles.option} ${value === o.value ? styles.optionActive : ''}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </button>
            ),
          )}
          {multiple && selected.size > 0 && (
            <>
              <div className={styles.sep} />
              <button type="button" className={styles.clear} onClick={onClear}>
                Limpar seleção
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
