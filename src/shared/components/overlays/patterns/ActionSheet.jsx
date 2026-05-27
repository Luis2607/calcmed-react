import { BottomSheet } from '../BottomSheet';
import { SheetSection } from '../../molecules/sheet/SheetSection';
import { SheetActionItem } from '../../molecules/sheet/SheetActionItem';
import styles from '../../molecules/sheet/Sheet.module.css';

/**
 * Pattern: ActionSheet.
 * Uso: lista de acoes por secao (ex: PCR "Adicionar evento").
 * sections: [{ title?, items: [{ id, label, description?, disabled? }] }]
 * onSelect(item): chamado ao tocar um item.
 * extra: { label, onSelect } opcional (linha tracejada "Outro · nao listado").
 */
export function ActionSheet({
  open,
  onClose,
  title,
  description,
  sections = [],
  onSelect,
  extra,
  closeLabel = 'Fechar',
  maxHeight = 'tall',
}) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      maxHeight={maxHeight}
      footer={{ primary: { label: closeLabel, onClick: onClose } }}
    >
      {sections.map((section, i) => (
        <SheetSection key={section.title || i} title={section.title}>
          <ul className={styles.actionList}>
            {section.items.map((item) => (
              <SheetActionItem
                key={item.id ?? item.label}
                label={item.label}
                description={item.description}
                disabled={item.disabled}
                onSelect={() => onSelect?.(item)}
              />
            ))}
          </ul>
        </SheetSection>
      ))}
      {extra && (
        <ul className={styles.actionList}>
          <SheetActionItem variant="extra" label={extra.label} onSelect={extra.onSelect} />
        </ul>
      )}
    </BottomSheet>
  );
}
